import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import MobileMenu from '@/components/MobileMenu' // ✅ IMPORT MANQUANT

export default function Header({ dark = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const textColor = dark ? 'text-white' : 'text-black'
  const bgColor = dark ? 'bg-transparent' : 'bg-white'
  const logoColor = dark ? 'fill-transparent' : 'fill-black'
  const iconStroke = dark ? '#ffffff' : '#000000'

  return (
    <header className={`fixed top-0 w-full z-50 ${bgColor} ${textColor} px-6 py-4`}>
      <div className="flex justify-between items-center">
        {/* Logo responsive */}
        <Logo className={`w-auto h-3 sm:h-3 lg:h-3 xl:h-3 ${logoColor}`} />

        {/* Desktop menu */}
        <nav className="hidden xl:flex gap-6 text-sm font-medium">
          <Link href="/creation" className="hover:underline">Créations</Link>
          <Link href="/collaborations" className="hover:underline">Collaborations</Link>
          <Link href="/expositions" className="hover:underline">Expositions</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden focus:outline-none"
        >
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"  // 👈 hérite de text-black ou text-white
            strokeWidth="1.5"
          >
            <path d="M3 5h8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 12h13" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 19h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>


        </button>
      </div>

      {/* Menu mobile plein écran */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  )
}
