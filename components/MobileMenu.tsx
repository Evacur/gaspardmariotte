import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-start gap-8 bg-cover bg-center text-black font-medium px-0 pt-32"
          style={{ backgroundImage: "url('/fondmenu.png')" }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Bouton de fermeture */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-black text-3xl"
            aria-label="Fermer le menu"
          >
            <svg
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              color="#000000"
            >
              <path
                d="M9.172 14.828L12 12m2.828-2.828L12 12m0 0L9.172 9.172M12 12l2.828 2.828"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Liens */}
          <nav className="flex flex-col items-start gap-10 text-3xl sm:text-5xl md:text-7xl tracking-wide font-light w-full">
            <Link href="/creation" passHref legacyBehavior>
              <a
                onClick={onClose}
                className="flex w-full font-clash font-medium items-baseline gap-3 border-b-2 border-black pb-4 px-6"
              >
                <span className="text-sm sm:text-base font-mono opacity-70">01/</span>
                <span>Créations</span>
              </a>
            </Link>

            <Link href="/collaboration" passHref legacyBehavior>
              <a
                onClick={onClose}
                className="flex w-full font-clash font-medium items-baseline gap-3 border-b-2 border-black pb-4 px-6"
              >
                <span className="text-sm sm:text-base font-mono opacity-70">02/</span>
                <span>Collaborations</span>
              </a>
            </Link>

            <Link href="/exposition" passHref legacyBehavior>
              <a
                onClick={onClose}
                className="flex w-full font-clash font-medium items-baseline gap-3 border-b-2 border-black pb-4 px-6"
              >
                <span className="text-sm sm:text-base font-mono opacity-70">03/</span>
                <span>Expositions</span>
              </a>
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
