import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPosterUrl } from '@/lib/poster'
import MorphablePoster from './MorphablePoster'
import { startPosterTransition } from '@/lib/posterTransition'

interface ProjectNavCardProps {
  direction: 'prev' | 'next'
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration' | 'shop'
  title?: string
  isAlone?: boolean // Nouvelle prop pour savoir si la carte est seule
}

const getImageUrl = (image: any) => getPosterUrl(image)

export default function ProjectNavCard({
  direction,
  slug,
  banner,
  basePath = 'exposition',
  title,
  isAlone = false,
}: ProjectNavCardProps) {
  const router = useRouter()
  const href = `/${basePath}/${slug}`
  const imageUrl = getImageUrl(banner)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const sourceEl = (e.currentTarget as HTMLElement)
    startPosterTransition({
      sourceEl,
      imageUrl: imageUrl || '',
      durationMs: 1500,
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
      addGradient: true,
      targetId: `banner-${basePath}-${slug}`,
    })
    router.push(href)
  }

  return (
    <Link
      href={href}
      scroll={false}
      onClick={handleClick}
      className={`
        group relative w-full h-[45vh] rounded-sm overflow-hidden bg-black flex items-center justify-center cursor-pointer
        ${isAlone ? 'w-full' : 'w-full flex-1 min-w-0'}
      `}
    >
      <MorphablePoster imageUrl={imageUrl} alt={title || ''} variant="card">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <span className="text-white text-2xl md:text-3xl lg:text-4xl font-clash font-semibold tracking-wide">
            {direction === 'prev' ? 'Précédent' : 'Suivant'}
          </span>
          {title && <p className="mt-1 text-white text-sm md:text-base lg:text-lg">{title}</p>}
        </div>
      </MorphablePoster>
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
  basePath?: 'exposition' | 'collaboration' | 'shop'
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