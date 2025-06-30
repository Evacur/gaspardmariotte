import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface ImageType {
  _type: string
  asset?: { _ref?: string; _id?: string }
}

interface ProjectNavCardProps {
  title: string
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration'
  direction?: 'prev' | 'next'
}

// Helper pour générer l'URL d'image en sécurité
const getImageUrl = (image?: ImageType | null): string | null => {
  return image?._type === 'image' && image.asset ? urlFor(image).url() : null
}

export default function ProjectNavCard({
direction,
  title,
  slug,
  banner,
  basePath = 'exposition',
}: ProjectNavCardProps) {
  const href = `/${basePath}/${slug}`
  const imageUrl = getImageUrl(banner)

  return (
    <Link href={href} className="w-full h-[200px] rounded-sm overflow-hidden bg-gray-300" aria-label={`${direction === 'prev' ? 'Projet précédent' : 'Projet suivant'}`}>
      <div className="relative w-full h-full group rounded-sm overflow-hidden">
        {/* Image de fond si disponible */}
        {imageUrl && (
          <img
            src={imageUrl}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={`${direction === 'prev' ? 'Image du projet précédent' : 'Image du projet suivant'}`}
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
