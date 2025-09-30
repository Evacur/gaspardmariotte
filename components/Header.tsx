import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Logo from '@/components/Logo'
import MobileMenu from '@/components/MobileMenu'
import IconButton from '@/components/Iconbutton'
import { useRouter } from 'next/router'

type HeaderProps = {
  dark?: boolean
  className?: string
  backSlugPath?: string
}

export default function Header({ dark = false, className = "", backSlugPath }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const [autoTextMode, setAutoTextMode] = useState<'light' | 'dark'>(dark ? 'dark' : 'light')
  const [isOverlayingVisual, setIsOverlayingVisual] = useState(false)

  // Enregistre le chemin précédent pour déterminer si l'on vient de la page index
  useEffect(() => {
    const handleRouteChangeStart = () => {
      try {
        sessionStorage.setItem('lastPath', router.asPath)
      } catch {}
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router])

  const isSlugPage = typeof router.pathname === 'string' && router.pathname.includes('/[slug]')
  const basePath = typeof router.pathname === 'string' ? `/${router.pathname.split('/')[1] || ''}` : '/'
  const isHome = router.pathname === '/'

  // Détection luminosité de la zone visuelle derrière le header (bannière/carrousel)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const headerEl = document.querySelector('header') as HTMLElement | null

    const sampleImageBrightness = async (imgEl: HTMLImageElement): Promise<number | null> => {
      try {
        if (!imgEl.complete || imgEl.naturalWidth === 0) {
          await new Promise<void>((resolve, reject) => {
            const onLoad = () => resolve()
            const onError = () => resolve() // en cas d'erreur, fallback
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

        // Dimensions de destination pour échantillonnage
        const w = 160
        const h = 160
        canvas.width = w
        canvas.height = h

        // Reproduit object-fit: cover pour la bannière (par défaut), et gère approx. contain
        const rect = imgEl.getBoundingClientRect()
        const containerW = Math.max(1, Math.round(rect.width))
        const containerH = Math.max(1, Math.round(rect.height))
        const naturalW = image.naturalWidth || 1
        const naturalH = image.naturalHeight || 1

        const isContain = (imgEl.className || '').includes('object-contain')
        const scaleCover = Math.max(containerW / naturalW, containerH / naturalH)
        const scaleContain = Math.min(containerW / naturalW, containerH / naturalH)
        const s = isContain ? scaleContain : scaleCover

        const visibleW = Math.min(containerW, naturalW * s)
        const visibleH = Math.min(containerH, naturalH * s)

        // Source crop centré correspondant à la partie visible
        const sw = Math.min(naturalW, containerW / s)
        const sh = Math.min(naturalH, containerH / s)
        const sx = Math.max(0, (naturalW - sw) / 2)
        const sy = Math.max(0, (naturalH - sh) / 2)

        // Dessine la zone visible dans le canvas de travail
        ctx.drawImage(image, sx, sy, sw, sh, 0, 0, w, h)

        // Détermine la hauteur de la bande sous le header proportionnellement
        const headerRect = headerEl?.getBoundingClientRect()
        const overlapH = headerRect ? Math.max(0, Math.min(containerH, headerRect.height - Math.max(0, rect.top))) : Math.min(containerH, 80)
        const bandH = Math.max(1, Math.round(h * (overlapH / containerH)))

        const data = ctx.getImageData(0, 0, w, Math.min(h, bandH)).data
        const vals: number[] = []
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          // HSP brightness
          const brightness = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b)
          vals.push(brightness)
        }
        if (vals.length === 0) return null

        // Moyenne pondérée vers les pixels les plus sombres (moyenne du 40% inférieur)
        vals.sort((a, b) => a - b)
        const cut = Math.max(1, Math.floor(vals.length * 0.4))
        const darkSlice = vals.slice(0, cut)
        const avg = darkSlice.reduce((s, v) => s + v, 0) / darkSlice.length

        // Si on est dans une bannière avec overlay noir (bg-black/50), abaisse la luminosité perçue
        let adjusted = avg
        const banner = imgEl.closest('[data-banner-visual="true"]')
        if (banner) {
          const overlayAlpha = 0.5 // conforme à MorphablePoster variant banner
          adjusted = adjusted * (1 - overlayAlpha)
        }

        return adjusted
      } catch {
        return null
      }
    }

    const pickCandidateImage = (): HTMLImageElement | null => {
      // Priorité: bannière
      const banner = document.querySelector('[data-banner-visual="true"]') as HTMLElement | null
      const imgs: HTMLImageElement[] = []
      if (banner) {
        imgs.push(...Array.from(banner.querySelectorAll('img')) as HTMLImageElement[])
      }
      // Si aucune image dans la bannière, tente de trouver une image visible proche du haut
      if (imgs.length === 0) {
        const allImgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
        const nearTop = allImgs
          .filter((img) => {
            const rect = img.getBoundingClientRect()
            return rect.bottom > 0 && rect.top < (headerEl?.offsetHeight || 80) * 2
          })
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
        if (nearTop.length > 0) imgs.push(nearTop[0])
      }
      if (imgs.length === 0) return null
      // Choisit l'image la plus visible (opacité haute)
      const visible = imgs.find((img) => {
        const style = window.getComputedStyle(img)
        return parseFloat(style.opacity || '1') > 0.5
      })
      return visible || imgs[0]
    }

    const compute = async () => {
      const candidate = pickCandidateImage()
      let overlay = false
      if (candidate && headerEl) {
        const rect = candidate.getBoundingClientRect()
        const headerRect = headerEl.getBoundingClientRect()
        overlay = rect.top < headerRect.bottom && rect.bottom > 0
      }
      setIsOverlayingVisual(!!overlay)

      if (candidate) {
        const avg = await sampleImageBrightness(candidate)
        if (avg == null) {
          setAutoTextMode(dark ? 'dark' : 'light')
        } else {
          // Seuil plus sensible pour mieux détecter les fonds clairs
          const isBackgroundDark = avg < 170
          setAutoTextMode(isBackgroundDark ? 'dark' : 'light')
        }
      } else {
        setAutoTextMode(dark ? 'dark' : 'light')
      }
    }

    const onRoute = () => compute()
    const onResize = () => compute()
    const onScroll = () => compute()
    const onImageEvent = () => compute()
    compute()

    // Recalcule sur resize/scroll/route
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    router.events.on('routeChangeComplete', onRoute)

    // Recalcule quand les images se chargent/changent (carrousel, bannières)
    const imgs = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
    imgs.forEach((img) => {
      img.addEventListener('load', onImageEvent)
      img.addEventListener('transitionend', onImageEvent)
    })

    // Observe les mutations sur la bannière si présente
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
        img.removeEventListener('load', onImageEvent)
        img.removeEventListener('transitionend', onImageEvent)
      })
      observer.disconnect()
    }
  }, [router, dark])

  const handleBack = () => {
    // 1) Si l'on vient de l'index (via sessionStorage ou referrer), aller à l'index
    let lastPath: string | null = null
    try {
      lastPath = sessionStorage.getItem('lastPath')
    } catch {}

    if (!lastPath && typeof document !== 'undefined') {
      try {
        const ref = document.referrer
        const url = new URL(ref)
        if (url.origin === window.location.origin) {
          lastPath = url.pathname
        }
      } catch {}
    }

    if (lastPath === basePath) {
      router.push(basePath)
      return
    }

    // 2) Sinon, aller au slug précédent si fourni, à défaut à l'index
    if (backSlugPath) {
      router.push(backSlugPath)
    } else {
      router.push(basePath)
    }
  }

  const useLightText = isHome ? true : (isOverlayingVisual ? (autoTextMode === 'dark') : false)

  return (
    <header
      className={clsx(
        "fixed top-0 w-full z-50 px-6 h-14",
        "bg-transparent",
        useLightText ? "text-white" : "text-black",
        className
      )}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center gap-2">
          {isSlugPage && (
            <IconButton onClick={handleBack} ariaLabel="Retour" variant="default">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke={useLightText ? "#ffffff" : "#000000"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </IconButton>
          )}
          <Link href="/" className="inline-block">
            <Logo className={clsx("w-auto h-3 sm:h-3 lg:h-3 xl:h-3", useLightText ? "fill-white" : "fill-black")} />
          </Link>
        </div>

        <nav className="hidden lg:flex gap-6 text-sm font-medium justify-end">
          <Link href="/creation">Créations</Link>
          <Link href="/collaboration">Collaborations</Link>
          <Link href="/exposition">Expositions</Link>
          <Link href="/shop">Shop</Link>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden focus:outline-none p-4"
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke={useLightText ? "#ffffff" : "#000000"}
            strokeWidth="1.5"
          >
            <path d="M3 5h8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12h13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 19h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="lg:hidden">
        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </header>
  )
}
