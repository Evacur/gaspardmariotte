import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import { getPosterUrl } from '@/lib/poster'
// SharedElement retiré
import MorphablePoster from './MorphablePoster'
import { startPosterTransition } from '@/lib/posterTransition'

type Props = {
  title: string
  slug: string
  banner?: any
  basePath?: 'exposition' | 'collaboration' | 'shop'
}

export default function SectionPosterCard({ title, slug, banner, basePath = 'exposition' }: Props) {
  const router = useRouter()
  
  
  const imageUrl = getPosterUrl(banner)

  const href = `/${basePath}/${slug}`
  const sharedId = `card-${basePath}-${slug}`

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Lancer la transition centralisée
    const sourceEl = (e.currentTarget as HTMLElement)
    startPosterTransition({ 
      sourceEl, 
      imageUrl: imageUrl || '', 
      durationMs: 1400, 
      easing: 'cubic-bezier(0.65, 0, 0.35, 1)', 
      addGradient: true,
      targetId: `banner-${basePath}-${slug}`
    })

    // Navigation immédiate sans délai
    router.push(href)
  }

  return (
      <Link
        href={href}
        scroll={false}
        onClick={handleClick}
        className="group relative w-full h-[300px] rounded-sm overflow-hidden bg-black flex items-center justify-center cursor-pointer"
      >
        <MorphablePoster imageUrl={imageUrl} alt={title} variant="card">
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
            <motion.h2 
              className="text-xl font-clash font-semibold mb-1 max-w-full break-words"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h2>
          </div>
        </MorphablePoster>
      </Link>
  )
}
