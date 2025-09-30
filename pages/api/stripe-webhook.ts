import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { createClient as createSanityClient } from '@sanity/client'
import { config as sanityPublicConfig } from '@/lib/sanity'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: any): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const stripeSecret = process.env.STRIPE_SECRET_KEY as string
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

const stripe = new Stripe(stripeSecret || '', { apiVersion: '2024-06-20' })

const sanity = createSanityClient({
  projectId: process.env.SANITY_PROJECT_ID || (sanityPublicConfig as any).projectId,
  dataset: process.env.SANITY_DATASET || (sanityPublicConfig as any).dataset,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN || (sanityPublicConfig as any).token,
  useCdn: false,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  if (!stripeSecret || !webhookSecret) {
    return res.status(500).json({ error: 'Stripe env vars manquantes' })
  }

  let event: Stripe.Event
  try {
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature'] as string
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret)
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // 1) Correspondance via Payment Link (recommandé si vous collez un Payment Link dans Sanity)
      if (session.payment_link) {
        const plink = await stripe.paymentLinks.retrieve(session.payment_link as string)
        const paymentLinkUrl = plink.url
        if (paymentLinkUrl) {
          const doc = await sanity.fetch<{ _id: string } | null>(
            `*[_type == "shop" && stripeUrl == $url][0]{ _id }`,
            { url: paymentLinkUrl }
          )
          if (doc?._id) {
            await sanity.patch(doc._id).set({ vendu: true }).commit()
            // Optionnel: désactiver le Payment Link pour éviter un second achat
            try {
              await stripe.paymentLinks.update(plink.id, { active: false })
            } catch {}
          }
        }
      }

      // 2) Correspondance via metadata.sanityId si vous l’utilisez
      if (session.metadata && session.metadata.sanityId) {
        const sanityId = session.metadata.sanityId
        try {
          await sanity.patch(sanityId).set({ vendu: true }).commit()
        } catch {}
      }
    }

    return res.json({ received: true })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}


