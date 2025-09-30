import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter()
  const drawerRef = useRef<HTMLDivElement | null>(null)

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

  // Menu mobile simplifié: fond blanc et typographie noire fixes
  useEffect(() => {
    // Rien à faire ici pour le moment, on garde l'effet pour cohérence si besoin futur
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
            className={"fixed bottom-0 left-0 right-0 z-[999] bg-white text-black rounded-t-2xl p-6 flex flex-col items-start gap-4"}
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
            <nav className={"flex flex-col items-start gap-4 text-[24px] md:text-3xl tracking-wide font-light w-full text-black"}>
              <Link href="/creation" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clash font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">01/</span>
                  <span>Créations</span>
                </a>
              </Link>

              <Link href="/collaboration" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clash font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">02/</span>
                  <span>Collaborations</span>
                </a>
              </Link>

              <Link href="/exposition" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clash font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">03/</span>
                  <span>Expositions</span>
                </a>
              </Link>
              <Link href="/shop" passHref legacyBehavior>
                <a
                  onClick={onClose}
                  className="flex w-full font-clash font-medium items-baseline gap-1 pb-2"
                >
                  <span className="text-sm md:text-base font-mono opacity-70">04/</span>
                  <span>Shop</span>
                </a>
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
