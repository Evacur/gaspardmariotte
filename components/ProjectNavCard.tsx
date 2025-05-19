import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface ProjectNavCardProps {
  direction: 'prev' | 'next'
  slug: string
  banner: any
}

export default function ProjectNavCard({ direction, slug, banner }: ProjectNavCardProps) {
  return (
    <Link
      href={`/collaboration/${slug}`}
      className="w-full h-[200px] rounded-sm overflow-hidden bg-gray-300"
    >
      <div className="relative w-full h-full group rounded-sm overflow-hidden">
        {/* Image de fond si dispo */}
        {banner && (
          <img
            src={urlFor(banner).url()}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

        {/* Texte centré */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <span className="text-white text-xl sm:text-2xl font-clash font-semibold tracking-wide">
            {direction === 'prev' ? 'Précédent' : 'Suivant'}
          </span>
        </div>
      </div>
    </Link>
  )
}
