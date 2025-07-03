import clsx from 'clsx'

type FooterProps = {
  dark?: boolean
  className?: string
}

export default function Footer({ dark = false, className = "" }: FooterProps) {
  return (
    <footer
      className={clsx(
        "w-full px-6 py-5 sm:py-4",
        dark ? "bg-transparent text-white" : "bg-white text-black",
        className
      )}
    >
      <div className="flex justify-between items-center text-sm font-medium">
        <a 
          href="https://instagram.com/gaspardmariotte" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-70 transition-opacity"
        >
          @gaspardmariotte
        </a>
        
        <a 
          href="mailto:gaspardmariotte@gmail.com"
          className="hover:opacity-70 transition-opacity"
        >
          gaspardmariotte@gmail.com
        </a>
      </div>
    </footer>
  )
}