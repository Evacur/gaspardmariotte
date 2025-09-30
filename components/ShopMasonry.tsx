import Link from 'next/link'
import { startPosterTransition } from '@/lib/posterTransition'
import { getPosterUrl } from '@/lib/poster'
import { Badge } from '@/components/ui/badge'

type ShopCard = {
  _id: string
  slug: { current: string }
  title: string
  image?: any
  prix?: number
  format?: string
  description?: string
  vendu?: boolean
}

type Props = {
  items: ShopCard[]
}

export default function ShopMasonry({ items }: Props) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
      <div
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
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
              className="group mb-8 block break-inside-avoid"
            >
              <div className="relative w-full overflow-hidden rounded-sm bg-black/5">
                <img
                  src={imageUrl || ''}
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="pt-3">
                <h3 className="font-clash text-lg md:text-xl font-semibold leading-tight text-black">
                  {item.title}
                </h3>
                {(item.format || item.prix != null) && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-black/60">
                    <p>
                      {item.format ? item.format : ''}
                      {item.format && item.prix != null ? ' · ' : ''}
                      {item.prix != null ? `${item.prix} €` : ''}
                    </p>
                    <Badge
                      variant={item.vendu ? 'secondary' : 'default'}
                      className={item.vendu ? 'bg-black/10 text-black border-transparent' : ''}
                    >
                      {item.vendu ? 'Vendu' : 'En vente'}
                    </Badge>
                  </div>
                )}
                {item.description && (
                  <p className="text-sm text-black/60 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


