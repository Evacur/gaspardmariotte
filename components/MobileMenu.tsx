import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const [autoTextMode, setAutoTextMode] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Détection de luminosité derrière la zone du tiroir mobile (bas de l'écran)
  useEffect(() => {
    if (!isOpen) return
    if (typeof window === 'undefined') return

    const headerEl = document.querySelector('header') as HTMLElement | null

    const sampleImageBrightness = async (imgEl: HTMLImageElement, targetHeight: number, targetTop: number): Promise<number | null> => {
      try {
        if (!imgEl.complete || imgEl.naturalWidth === 0) {
          await new Promise<void>((resolve) => {
            const onLoad = () => resolve()
            const onError = () => resolve()
            imgEl.addEventListener('load', onLoad, { once: true })
            imgEl.addEventListener('error', onError, { once: true })
          })
        }

        const src = imgEl.currentSrc || imgEl.src
        if (!src) return null

        const image = new Image()
        image.crossOrigin = 'anonymous'
        image.decoding = 'async'
        image.src = src
        await new Promise<void>((resolve) => {
          if (image.complete) return resolve()
          image.onload = () => resolve()
          image.onerror = () => resolve()
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return null

        const w = 200
        const h = 200
        canvas.width = w
        canvas.height = h

        const rect = imgEl.getBoundingClientRect()
        const containerW = Math.max(1, Math.round(rect.width))
        const containerH = Math.max(1, Math.round(rect.height))
        const naturalW = image.naturalWidth || 1
        const naturalH = image.naturalHeight || 1

        const isContain = (imgEl.className || '').includes('object-contain')
        const scaleCover = Math.max(containerW / naturalW, containerH / naturalH)
        const scaleContain = Math.min(containerW / naturalW, containerH / naturalH)
        const s = isContain ? scaleContain : scaleCover

        const sw = Math.min(naturalW, containerW / s)
        const sh = Math.min(naturalH, containerH / s)
        const sx = Math.max(0, (naturalW - sw) / 2)
        const sy = Math.max(0, (naturalH - sh) / 2)

        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, w, h)

        // Bande correspondant à la zone du tiroir (partie basse)
        const vh = window.innerHeight
        const drawerTop = targetTop
        const drawerHeight = targetHeight
        const overlapTopOnImagePx = Math.max(0, drawerTop - rect.top)
        const overlapHeightOnImagePx = Math.max(0, Math.min(rect.bottom, drawerTop + drawerHeight) - Math.max(rect.top, drawerTop))
        const overlapRatioTop = Math.min(1, Math.max(0, overlapTopOnImagePx / containerH))
        const overlapRatioH = Math.min(1, Math.max(0.02, overlapHeightOnImagePx / containerH))

        const yStart = Math.round(h * overlapRatioTop)
        const yH = Math.max(1, Math.round(h * overlapRatioH))
        const data = ctx.getImageData(0, Math.min(h - 1, yStart), w, Math.min(h - yStart, yH)).data

        const vals: number[] = []
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
          vals.push(brightness)
        }
        if (!vals.length) return null
        vals.sort((a, b) => a - b)
        const cut = Math.max(1, Math.floor(vals.length * 0.4))
        const avg = vals.slice(0, cut).reduce((s, v) => s + v, 0) / cut

        let adjusted = avg
        const banner = imgEl.closest('[data-banner-visual="true"]')
        if (banner) {
          const overlayAlpha = 0.5
          adjusted = adjusted * (1 - overlayAlpha)
        }
        return adjusted
      } catch {
        return null
      }
    }

    const pickCandidateImage = (): HTMLImageElement | null => {
      const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      // Choisit l'image la plus proche de la zone du tiroir
      const drawer = drawerRef.current
      if (!drawer) return null
      const dRect = drawer.getBoundingClientRect()
      const candidates = imgs
        .filter((img) => {
          const r = img.getBoundingClientRect()
          // Intersection avec la zone du tiroir
          return r.bottom > dRect.top && r.top < dRect.bottom
        })
        .sort((a, b) => {
          const ra = a.getBoundingClientRect()
          const rb = b.getBoundingClientRect()
          // Plus grande zone d'intersection en premier
          const overlapA = Math.max(0, Math.min(ra.bottom, dRect.bottom) - Math.max(ra.top, dRect.top))
          const overlapB = Math.max(0, Math.min(rb.bottom, dRect.bottom) - Math.max(rb.top, dRect.top))
          return overlapB - overlapA
        })
      return candidates[0] || null
    }

    const compute = async () => {
      const drawer = drawerRef.current
      if (!drawer) return
      const dRect = drawer.getBoundingClientRect()
      const candidate = pickCandidateImage()
      if (candidate) {
        const avg = await sampleImageBrightness(candidate, dRect.height, dRect.top)
        if (avg == null) {
          setAutoTextMode('dark')
        } else {
          const isBackgroundDark = avg < 170
          setAutoTextMode(isBackgroundDark ? 'dark' : 'light')
        }
      } else {
        setAutoTextMode('dark')
      }
    }

    const onRoute = () => compute()
    const onResize = () => compute()
    const onScroll = () => compute()
    const onImage = () => compute()
    compute()

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    router.events.on('routeChangeComplete', onRoute)
    const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
    imgs.forEach((img) => {
      img.addEventListener('load', onImage)
      img.addEventListener('transitionend', onImage)
    })

    const bannerEl = document.querySelector('[data-banner-visual="true"]') || undefined
    const observer = new MutationObserver(() => compute())
    if (bannerEl instanceof HTMLElement) {
      observer.observe(bannerEl, { attributes: true, childList: true, subtree: true, attributeFilter: ['src', 'style', 'class'] })
    }

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      router.events.off('routeChangeComplete', onRoute)
      imgs.forEach((img) => {
        img.removeEventListener('load', onImage)
        img.removeEventListener('transitionend', onImage)
      })
      observer.disconnect()
    }
  }, [isOpen, router])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay unique */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom drawer */}
          <motion.div
            ref={drawerRef}
            className={`fixed bottom-0 left-0 right-0 z-[999] bg-transparent rounded-t-2xl p-6 flex flex-col items-start gap-4 ${autoTextMode === 'dark' ? 'text-white' : 'text-black'}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 100) {
                onClose()
              }
            }}
            >
            <nav className={`flex flex-col items-start gap-4 text-[24px] md:text-3xl tracking-wide font-light w-full ${autoTextMode === 'dark' ? 'text-white' : 'text-black'}`}>
              <Link href="/creation" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clashgrotesk font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">01/</span>
                  <span>Créations</span>
                </a>
              </Link>

              <Link href="/collaboration" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clashgrotesk font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">02/</span>
                  <span>Collaborations</span>
                </a>
              </Link>

              <Link href="/exposition" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clashgrotesk font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">03/</span>
                  <span>Expositions</span>
                </a>
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
