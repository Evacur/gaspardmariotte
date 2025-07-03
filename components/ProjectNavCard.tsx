import Link from 'next/link'
import { urlFor } from '@/lib/sanity'

interface ProjectNavCardProps {
  direction: 'prev' | 'next'
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration'
  title?: string
  isAlone?: boolean // Nouvelle prop pour savoir si la carte est seule
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
  isAlone = false,
}: ProjectNavCardProps) {
  const href = `/${basePath}/${slug}`
  const imageUrl = getImageUrl(banner)

  return (
    <Link href={href} legacyBehavior>
      <a className={`
        h-[150px] rounded-sm overflow-hidden bg-gray-300 block group relative
        ${isAlone ? 'w-full' : 'w-full flex-1 min-w-0'}
      `}>
        {imageUrl && (
          <img
            src={imageUrl}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={title || ''}
          />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <span className="text-white text-xl sm:text-2xl font-clash font-semibold tracking-wide">
            {direction === 'prev' ? 'Précédent' : 'Suivant'}
          </span>
          {title && <p className="mt-2 text-white text-sm">{title}</p>}
        </div>
      </a>
    </Link>
  )
}

// Composant container pour gérer la logique d'affichage
interface ProjectNavContainerProps {
  prevProject?: {
    slug: string
    banner?: any
    title?: string
  }
  nextProject?: {
    slug: string
    banner?: any
    title?: string
  }
  basePath?: 'exposition' | 'collaboration'
}

export function ProjectNavContainer({
  prevProject,
  nextProject,
  basePath = 'exposition'
}: ProjectNavContainerProps) {
  const hasBothProjects = prevProject && nextProject
  const hasOnlyOne = (prevProject && !nextProject) || (!prevProject && nextProject)

  return (
    <div className="w-full">
      <div className={`
        flex gap-4 md:gap-6 w-full
        ${hasOnlyOne ? 'justify-center' : 'justify-between'}
      `}>
        {prevProject && (
          <ProjectNavCard
            direction="prev"
            slug={prevProject.slug}
            banner={prevProject.banner}
            title={prevProject.title}
            basePath={basePath}
            isAlone={!nextProject}
          />
        )}
        
        {nextProject && (
          <ProjectNavCard
            direction="next"
            slug={nextProject.slug}
            banner={nextProject.banner}
            title={nextProject.title}
            basePath={basePath}
            isAlone={!prevProject}
          />
        )}
      </div>
    </div>
  )
}