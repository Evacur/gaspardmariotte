import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

type Props = {
  title: string
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration' // <-- ici
}

export default function SectionPosterCard({ title, slug, banner, basePath = 'exposition' }: Props) {
  let imageUrl = ''
  try {
    if (banner && banner.asset) {
      imageUrl = urlFor(banner).width(600).height(800).fit('crop').url()
    }
  } catch (error) {
    console.error('Erreur de génération d’image Sanity:', error)
  }

  const href = `/${basePath}/${slug}` // <-- ici

  return (
    <Link
      href={href}
      scroll={false}
className="group relative w-full sm:w-full md:w-full lg:w-[250px] h-[300px] rounded-sm overflow-hidden bg-black"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-red-100 text-red-700 flex items-center justify-center text-sm font-medium">
          Image manquante
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <h2 className="text-xl font-clash font-semibold mb-1 max-w-full break-words">{title}</h2>
      </div>
    </Link>
  )
}
