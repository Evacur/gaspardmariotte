import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

type Props = {
  title: string
  slug: string
  banner?: any
}

export default function SectionPosterCard({ title, slug, banner }: Props) {
  let imageUrl = ''
  try {
    if (banner && banner.asset) {
      imageUrl = urlFor(banner).width(600).height(800).fit('crop').url()
    }
  } catch (error) {
    console.error('Erreur de génération d’image Sanity:', error)
  }

  console.log('Rendering:', title, '| imageUrl:', imageUrl)

  return (
    <Link
      href={`/${slug}`}
      scroll={false}
      className="
        group relative
        w-full
        sm:w-[calc(50%-8px)]
        md:w-[calc(33.333%-10.66px)]
        xl:w-[calc(25%-12px)]
        h-[300px]
        md:h-[350px]
        rounded-sm overflow-hidden bg-black
      "
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-red-100 text-red-700 flex items-center justify-center text-sm font-medium">
          Image manquante
        </div>
      )}

      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-base font-bold mb-1">{title}</h2>
      </div>
    </Link>
  )
}
