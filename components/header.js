export default function Header() {
  return (
    <header className="absolute top-0 w-full z-10 text-black px-6 py-4 flex justify-between items-center">
     <img src="/Cinco.png" alt="Logo Gaspard Mariotte" className="h-10" />
      <nav className="flex gap-6 text-sm font-medium">
        <a href="#creations" className="hover:underline">Créations</a>
        <a href="#collaborations" className="hover:underline">Collaborations</a>
        <a href="#expositions" className="hover:underline">Expositions</a>
      </nav>
    </header>
  )
}

