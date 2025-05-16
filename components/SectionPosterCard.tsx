import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

type Props = {
  title: string
  slug: string
  banner: any
}

export default function SectionPosterCard({ title, slug, banner }: Props) {
  return (
    <Link href={`/collaboration/${slug}`} scroll={false}>
      <div
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
        {/* Image de fond */}
        {banner ? (
          <img
            src={urlFor(banner).width(600).height(800).fit('crop').url()}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
            Image manquante
          </div>
        )}

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 z-10" />

        {/* Texte centré */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-base font-bold mb-1">{title}</h2>
        </div>
      </div>
    </Link>
  )
}