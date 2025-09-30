import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface PageContentProps {
  children: ReactNode
  className?: string
}

export default function PageContent({ children, className = '' }: PageContentProps) {
  const [showContent, setShowContent] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShowContent(true)
      setContentVisible(true)
      return
    }

    const w = window as any
    const morph = w.__posterTransition || w.__imageMorph
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!morph || prefersReduced) {
      setShowContent(true)
      setContentVisible(true)
      return
    }

    const onDone = () => {
      setShowContent(true)
      setTimeout(() => setContentVisible(true), 50)
    }
    window.addEventListener('imageMorph:done', onDone, { once: true })

    // Sécurité: fallback si aucun événement reçu
    const fallback = setTimeout(onDone, (morph?.durationMs ?? 1400) + 300)

    return () => {
      window.removeEventListener('imageMorph:done', onDone)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: contentVisible ? 1 : 0, y: contentVisible ? 0 : 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}
