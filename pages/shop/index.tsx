import { useEffect, useState } from 'react'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'
import Header from '@/components/Header'
import ShopMasonry from '@/components/ShopMasonry'

type ShopItem = {
  _id: string
  slug: { current: string }
  title: string
  image?: any
  prix?: number
  format?: string
  description?: string
  vendu?: boolean
}

const query = groq`
  *[_type == "shop" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    slug,
    image,
    prix,
    format,
    description,
    vendu
  }
`

export default function ShopIndexPage() {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    client.fetch(query)
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Erreur lors du chargement des produits.')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center mt-20">Chargement...</div>
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">{error}</div>
  }

  return (
    <div className="bg-white">
      <Header dark={false} />

      <main className="pt-28 md:pt-32 pb-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">

        </div>

        <ShopMasonry items={items} />
      </main>
    </div>
  )
}


