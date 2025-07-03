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
      <div className="flex justify-start items-start text-sm font-medium">

        
        <div>
          © 2025
        </div>
      </div>
    </footer>
  )
}