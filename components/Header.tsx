import { useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import Logo from '@/components/Logo'
import MobileMenu from '@/components/MobileMenu'

type HeaderProps = {
  dark?: boolean
  className?: string
}

export default function Header({ dark = false, className = "" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header
      className={clsx(
        "fixed top-0 w-full z-50 px-6 py-4",
        dark ? "bg-transparent text-white" : "bg-white text-black",
        className
      )}
    >
      <div className="flex justify-between items-center">
        <Link href="/" className="inline-block">
          <Logo className={clsx("w-auto h-3 sm:h-3 lg:h-3 xl:h-3", dark ? "fill-white" : "fill-black")} />
        </Link>

        <nav className="hidden lg:flex gap-6 text-sm font-medium justify-end">
          <Link href="/creation">Créations</Link>
          <Link href="/collaboration">Collaborations</Link>
          <Link href="/exposition">Expositions</Link>
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
            stroke={dark ? "#ffffff" : "#000000"}
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
