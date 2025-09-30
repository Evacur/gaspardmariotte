import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getPosterUrl } from '@/lib/poster'

type CarouselProps = {
  images: any[]
  alt?: string
  className?: string
  fixedHeight?: number | string
}

export default function Carousel({ images, alt = 'Image', className = '', fixedHeight = 520 }: CarouselProps) {
  const validImages = useMemo(() => (images || []).filter(Boolean).slice(0, 4), [images])
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const startX = useRef<number | null>(null)
  const deltaX = useRef<number>(0)

  const goTo = useCallback((i: number) => {
    if (validImages.length === 0) return
    const len = validImages.length
    const next = ((i % len) + len) % len
    setIndex(next)
  }, [validImages])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [next, prev])

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
    deltaX.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current == null) return
    deltaX.current = e.clientX - startX.current
  }

  const onPointerUp = () => {
    if (startX.current == null) return
    const threshold = 40
    if (deltaX.current > threshold) prev()
    if (deltaX.current < -threshold) next()
    startX.current = null
    deltaX.current = 0
  }

  if (!validImages.length) return null

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none ${className}`}
      tabIndex={0}
      aria-roledescription="carousel"
    >
      <div className="relative w-full overflow-hidden rounded-sm" style={{ height: typeof fixedHeight === 'number' ? `${fixedHeight}px` : fixedHeight }}>
        {validImages.map((img, i) => {
          const url = getPosterUrl(img)
          if (!url) return null
          const isActive = i === index
          return (
            <img
              key={i}
              src={url}
              alt={alt}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            />
          )
        })}
      </div>

      {validImages.length > 1 && (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            {validImages.map((img, i) => {
              const url = getPosterUrl(img)
              if (!url) return null
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Voir l'image ${i + 1}`}
                  className={`relative w-16 h-16 overflow-hidden rounded-sm border ${i === index ? 'border-black' : 'border-black/10'} hover:border-black/40 transition`}
                >
                  <img src={url} alt="miniature" className="w-full h-full object-cover" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


