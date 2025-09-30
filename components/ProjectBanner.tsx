import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
// import { urlFor } from '@/lib/sanity'
import { getPosterUrl } from '@/lib/poster'
// SharedElement retiré (non nécessaire pour le morph)
import MorphablePoster from './MorphablePoster'
import { finishPosterTransition } from '@/lib/posterTransition'

type InfoItem = {
  label: string
  value?: string
}

type Props = {
  title: string
  slug: string
  banner?: any
  infoItems: InfoItem[]
  basePath?: 'exposition' | 'collaboration' | 'shop'
}

// Helper pour retourner une URL uniquement si l'image est valide
const getImageUrl = (image: any) => getPosterUrl(image)

export default function ProjectBanner({ title, slug, banner, infoItems, basePath = 'exposition' }: Props) {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)
  
  const imageUrl = getImageUrl(banner)
  const sharedId = `banner-${basePath}-${slug}`

  useEffect(() => {
    const win = window as any
    const reveal = () => setShowContent(true)
    if (!win.__posterTransition) {
      reveal();
      return
    }

    let attempts = 0
    const tryFinish = () => {
      attempts += 1
      const target = document.querySelector(`[data-shared-id="${sharedId}"]`) as HTMLElement | null
      if (target) {
        // Masquer la bannière pendant le morph
        const prevOpacity = target.style.opacity
        const prevVisibility = target.style.visibility
        target.style.opacity = '0'
        target.style.visibility = 'hidden'

        const onReached = () => {
          // Début du fade-out de l'overlay → ré-afficher la bannière
          target.style.opacity = prevOpacity || '1'
          target.style.visibility = prevVisibility || 'visible'
          window.removeEventListener('imageMorph:reached', onReached)
        }
        window.addEventListener('imageMorph:reached', onReached)

        const onDone = () => {
          try {
            // S'assurer que la bannière est bien visible même si 'reached' n'a pas été reçu
            target.style.opacity = '1'
            target.style.visibility = 'visible'
          } catch {}
          reveal()
          window.removeEventListener('imageMorph:done', onDone)
        }
        window.addEventListener('imageMorph:done', onDone)
        finishPosterTransition(target)
        // Filet de sécurité supplémentaire si l'événement ne remonte pas
        const baseDur = (win.__posterTransition?.durationMs ?? 1400)
        const dur = baseDur + 400
        // Ré-afficher au début estimé du fadeout même si 'reached' ne remonte pas
        setTimeout(() => {
          try {
            target.style.opacity = '1'
            target.style.visibility = 'visible'
          } catch {}
        }, Math.max(0, baseDur - 280))
        setTimeout(() => {
          if (!showContent) {
            reveal()
          }
        }, dur)
      } else if (attempts < 10) {
        requestAnimationFrame(tryFinish)
      } else {
        // Fallback durci: si la cible n'apparaît jamais, on nettoie l'overlay et on révèle
        try { win.__posterTransition?.overlay?.remove?.() } catch {}
        win.__posterTransition = undefined
        window.dispatchEvent(new Event('imageMorph:done'))
        reveal()
      }
    }

    // attendre 2 frames puis tenter en boucle jusqu'à présence de la cible
    requestAnimationFrame(() => requestAnimationFrame(tryFinish))
  }, [])

  return (
        <div
          data-shared-id={sharedId}
          className="relative w-full h-[45vh] text-white overflow-hidden"
        >
      <MorphablePoster imageUrl={imageUrl} alt={title || 'Image'} variant="banner">
        <div className="relative z-20 h-full flex flex-col justify-end pb-4">
        <div className="w-full max-w-screen-lg mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.11, 0.68, 0.17, 0.99],
              delay: 0
            }}
            className="text-[24px] md:text-[30px] lg:text-[40px] font-bold leading-tight break-words mb-2 md:mb-[30px]"
          >
            {title}
          </motion.h1>

          <motion.div 
            className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] md:text-[14px] lg:text-[14px] xl:text-[20px] text-white/90"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 50 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2
            }}
          >
            {infoItems.map(({ label, value }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + (index * 0.1),
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="max-w-[300px] min-w-[120px]"
              >
                <p className="font-semibold tracking-wide text-white">{label}</p>
                <p className="break-words">{value || '—'}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        </div>
      </MorphablePoster>
    </div>
  )
}