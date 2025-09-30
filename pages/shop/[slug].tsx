import { GetStaticPaths, GetStaticProps } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity'
import Header from '@/components/Header'
import PageContent from '@/components/PageContent'
import Carousel from '@/components/Carousel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RelatedShop from '@/components/RelatedShop'


type ShopItem = {
  _id?: string
  title: string
  slug: { current: string }
  image?: any
  images?: any[]
  format?: string
  prix?: number
  description?: string
  livraison?: string
  stripeUrl?: string
  vendu?: boolean
}

type RelatedItem = {
  _id: string
  slug: { current: string }
  title: string
  image?: any
  prix?: number
  format?: string
}

type Props = {
  data: ShopItem
  previousItem: ShopItem | null
  nextItem: ShopItem | null
  related: RelatedItem[]
}

export default function ShopItemPage({ data, previousItem, nextItem, related }: Props) {
  const allImages = (data.images && data.images.length > 0) ? data.images : (data.image ? [data.image] : [])
  return (
    <div className="bg-white">
      <Header dark={false} backSlugPath={previousItem ? `/shop/${previousItem.slug.current}` : undefined} />

      <PageContent className="px-6 pt-28 md:pt-32 pb-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="md:sticky md:top-6">
            <Carousel images={allImages} alt={data.title} />
          </div>

          <div className="space-y-6">
            <header className="space-y-2 border-b border-[#FAFAFA] pb-6">
              <div>
                <Badge
                  variant={data.vendu ? 'secondary' : 'default'}
                  className={data.vendu ? 'bg-black/10 text-black border-transparent' : ''}
                >
                  {data.vendu ? 'Vendu' : 'En vente'}
                </Badge>
              </div>
              <h1 className="font-clash text-3xl md:text-5xl font-semibold">{data.title}</h1>
              {data.description && (
                <p className="leading-7 whitespace-pre-line text-black/80">{data.description}</p>
              )}
            </header>

            {data.format && (
              <section className="space-y-2 border-b border-[#FAFAFA] pb-6">
                <h2 className="font-clash text-sm">Format</h2>
                <p>{data.format}</p>
              </section>
            )}

            {data.livraison && (
              <section className="space-y-2 border-b border-[#FAFAFA] pb-6">
                <h2 className="font-clash text-sm">Livraison</h2>
                <p className="whitespace-pre-line">{data.livraison}</p>
              </section>
            )}

            <div className="flex flex-col gap-4 pt-2">
              {data.prix != null && (
                <span className="text-2xl font-semibold">{data.prix} €</span>
              )}
              {data.stripeUrl && (
                <Button asChild className="w-full h-12 rounded-sm bg-black text-white hover:bg-black/90">
                  <a href={data.stripeUrl} target="_blank" rel="noopener noreferrer">
                    Commander cette oeuvre
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {related && related.length > 0 && (
          <div className="pt-10">
            <RelatedShop items={related} />
          </div>
        )}
      </PageContent>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await client.fetch(
    groq`*[_type == "shop" && defined(slug.current)]{ slug }`
  )
  return {
    paths: slugs.map(({ slug }: any) => ({ params: { slug: slug.current } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string }

  const allItems: RelatedItem[] = await client.fetch(
    groq`*[_type == "shop"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      image,
      prix,
      format
    }`
  )

  const index = allItems.findIndex((p) => p.slug.current === slug)
  const previousItem = allItems[index - 1] || null
  const nextItem = allItems[index + 1] || null

  const data = await client.fetch(
    groq`*[_type == "shop" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      image,
      images[] { ... },
      format,
      prix,
      description,
      livraison,
      stripeUrl,
      vendu
    }`,
    { slug }
  )

  if (!data) {
    return { notFound: true }
  }

  return {
    props: {
      data,
      previousItem,
      nextItem,
      related: allItems.filter((p) => p.slug.current !== slug).sort(() => 0.5 - Math.random()).slice(0, 4),
    },
    revalidate: 120,
  }
}


