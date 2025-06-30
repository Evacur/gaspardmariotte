import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface ProjectNavCardProps {
  direction: 'prev' | 'next'
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration'
  title?: string
}

const getImageUrl = (image: any) => {
  return image?._type === 'image' && image.asset ? urlFor(image).url() : null
}

export default function ProjectNavCard({
  direction,
  slug,
  banner,
  basePath = 'exposition',
  title,
}: ProjectNavCardProps) {
  const href = `/${basePath}/${slug}`
  const imageUrl = getImageUrl(banner)

  return (
    <Link
      href={href}
      className="w-full h-[150px] md:h-[200px] rounded-sm overflow-hidden bg-gray-300"
    >
      <div className="relative w-full h-full group rounded-sm overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={title || ''}
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-white text-xl sm:text-2xl font-clash font-semibold tracking-wide">
            {direction === 'prev' ? 'Précédent' : 'Suivant'}
          </span>
          {title && <p className="mt-2 text-white text-sm">{title}</p>}
        </div>
      </div>
    </Link>
  )
}
