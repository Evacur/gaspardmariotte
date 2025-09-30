import '@/styles/globals.css'
import 'keen-slider/keen-slider.min.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Contrôle du contenu lors d'un morph visuel (déjà présent ailleurs)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    const onMorphDone = () => setShowContent(true)
    if (typeof window !== 'undefined') {
      window.addEventListener('imageMorph:done', onMorphDone)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('imageMorph:done', onMorphDone)
      }
    }
  }, [])

  // Bandeau noir: uniquement pour navigation depuis l'accueil vers une autre page
  type BannerPhase = 'idle' | 'in' | 'out'
  const [bannerPhase, setBannerPhase] = useState<BannerPhase>('idle')

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const isIndexRoute = (url: string): boolean => {
    const path = (url || '').split('?')[0].split('#')[0]
    return (
      path === '/' ||
      path === '/exposition' ||
      path === '/creation' ||
      path === '/collaboration' ||
      path === '/shop'
    )
  }

  useEffect(() => {
    if (prefersReducedMotion) return

    const handleStart = (url: string) => {
      if (isIndexRoute(url)) setBannerPhase('in')
    }

    const endTransition = () => {
      setBannerPhase((current) => (current === 'in' ? 'out' : current))
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', endTransition)
    router.events.on('routeChangeError', endTransition)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', endTransition)
      router.events.off('routeChangeError', endTransition)
    }
  }, [prefersReducedMotion, router.events, router.pathname])

  return (
    <>
      {showContent && <Component key={router.asPath} {...pageProps} />}

      {bannerPhase !== 'idle' && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: bannerPhase === 'in' ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000',
            zIndex: 999999,
            transformOrigin: 'top',
            pointerEvents: 'none',
          }}
          onAnimationComplete={() => {
            if (bannerPhase === 'out') setBannerPhase('idle')
          }}
        />
      )}
    </>
  )
}
