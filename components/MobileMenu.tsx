import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
            className="fixed bottom-0 left-0 right-0 z-[999] bg-white rounded-t-2xl p-6 flex flex-col items-start gap-4"
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
            <nav className="flex flex-col items-start gap-4 text-[24px] md:text-3xl tracking-wide font-light w-full text-black">
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
