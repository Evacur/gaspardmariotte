import Link from 'next/link'
import { getPosterUrl } from '@/lib/poster'
import { startPosterTransition } from '@/lib/posterTransition'

type RelatedItem = {
  _id: string
  slug: { current: string }
  title: string
  image?: any
  prix?: number
  format?: string
}

type Props = {
  title?: string
  items: RelatedItem[]
}

export default function RelatedShop({ title = 'Autres oeuvres', items }: Props) {
  if (!items || items.length === 0) return null

  return (
    <section className="w-full">
      <h2 className="font-clash text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => {
          const imageUrl = getPosterUrl(item.image)
          const href = `/shop/${item.slug.current}`

          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault()
            const sourceEl = e.currentTarget as HTMLElement
            startPosterTransition({
              sourceEl,
              imageUrl: imageUrl || '',
              durationMs: 1200,
              easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
              addGradient: true,
              targetId: `banner-shop-${item.slug.current}`,
            })
            window.location.href = href
          }

          return (
            <Link
              key={item._id}
              href={href}
              scroll={false}
              onClick={handleClick}
              className="group block"
            >
              <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-black/5">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                )}
              </div>
              <div className="pt-2">
                <h3 className="font-clash text-sm md:text-base font-semibold leading-tight text-black">
                  {item.title}
                </h3>
                {(item.format || item.prix != null) && (
                  <p className="text-xs md:text-sm text-black/60 mt-0.5">
                    {item.format ? item.format : ''}
                    {item.format && item.prix != null ? ' · ' : ''}
                    {item.prix != null ? `${item.prix} €` : ''}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}


