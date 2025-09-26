import { ReactNode } from 'react'

type Props = {
  imageUrl: string | null
  alt?: string
  variant?: 'card' | 'banner'
  className?: string
  children?: ReactNode
  gradient?: boolean
}

export default function MorphablePoster({
  imageUrl,
  alt = 'Image',
  variant = 'card',
  className = '',
  children,
  gradient = true,
  ...rest
}: Props & Record<string, any>) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      {...rest}
      data-banner-visual="true"
    >
      {imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        </>
      )}
      {gradient && (
        <div
          className={
            variant === 'banner'
              ? 'absolute inset-0 bg-black/50 z-10'
              : 'absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 z-10'
          }
        />
      )}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  )
}


