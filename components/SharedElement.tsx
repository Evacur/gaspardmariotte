import { useEffect, useRef, ReactNode } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface SharedElementProps {
  id: string
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  layoutId?: string
}

export default function SharedElement({ 
  id, 
  children, 
  className = '', 
  style = {},
  layoutId,
  ...rest
}: SharedElementProps & Record<string, any>) {
  const elementRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  // Animation de morphing
  useEffect(() => {
    // Assurer l'affichage par défaut si aucune transition n'est en cours
    controls.start({ opacity: 1, scale: 1 })
  }, [controls])

  return (
    <motion.div
      ref={elementRef}
      className={className}
      style={style}
      layoutId={layoutId || id}
      animate={controls}
      initial={{ scale: 0.8, opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
