/* Centralise la logique d'overlay de morphing entre la card et la bannière */

type PosterTransitionState = {
  overlay: HTMLDivElement
  targetId: string
  durationMs: number
  easing: string
  done: boolean
}

const W = () => (typeof window !== 'undefined' ? (window as any) : undefined)

export function startPosterTransition(params: {
  sourceEl: HTMLElement
  imageUrl: string | null
  durationMs?: number
  easing?: string
  addGradient?: boolean
  targetId: string
}) {
  const win = W()
  if (!win) return
  const { sourceEl, imageUrl, durationMs = 1400, easing = 'cubic-bezier(0.65, 0, 0.35, 1)', addGradient = true, targetId } = params
  const srcRect = sourceEl.getBoundingClientRect()

  const overlay = document.createElement('div')
  Object.assign(overlay.style, {
    position: 'fixed',
    left: `${srcRect.left}px`,
    top: `${srcRect.top}px`,
    width: `${srcRect.width}px`,
    height: `${srcRect.height}px`,
    zIndex: '999999',
    overflow: 'hidden',
    borderRadius: getComputedStyle(sourceEl).borderRadius || '0px',
    willChange: 'left, top, width, height, border-radius, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    pointerEvents: 'none',
  } as CSSStyleDeclaration)
  if (imageUrl) {
    const img = document.createElement('img')
    img.src = imageUrl
    img.alt = ''
    Object.assign(img.style, {
      position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'
    } as CSSStyleDeclaration)
    overlay.appendChild(img)
  } else {
    // Fallback: clone visuel de la card
    const clone = sourceEl.cloneNode(true) as HTMLElement
    Object.assign(clone.style, { position: 'absolute', inset: '0' } as any)
    overlay.appendChild(clone)
  }
  if (addGradient) {
    const grad = document.createElement('div')
    Object.assign(grad.style, { position: 'absolute', inset: '0', background: 'rgba(0,0,0,0.5)' } as any)
    overlay.appendChild(grad)
  }
  document.body.appendChild(overlay)

  const state: PosterTransitionState = { overlay, targetId, durationMs, easing, done: false }
  win.__posterTransition = state

  // Watchdog pour éviter tout blocage si la page ne finalise pas
  setTimeout(() => {
    const s: PosterTransitionState | undefined = win.__posterTransition
    if (s && !s.done) {
      try { s.overlay.remove() } catch {}
      win.__posterTransition = undefined
      win.dispatchEvent(new Event('imageMorph:done'))
    }
  }, durationMs + 600)
}

export function finishPosterTransition(targetEl: HTMLElement) {
  const win = W(); if (!win) return
  const s: PosterTransitionState | undefined = win.__posterTransition
  if (!s) { win.dispatchEvent(new Event('imageMorph:done')); return }

  // Attendre 2 frames pour garantir le layout définitif
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const tr = targetEl.getBoundingClientRect()
      const targetRect = new DOMRect(tr.left - 1, tr.top - 1, tr.width + 2, tr.height + 2)
      const fromRect = s.overlay.getBoundingClientRect()
      const keyframes: any[] = [
        { left: `${fromRect.left}px`, top: `${fromRect.top}px`, width: `${fromRect.width}px`, height: `${fromRect.height}px`, borderRadius: getComputedStyle(s.overlay).borderRadius || '0px' },
        { left: `${targetRect.left}px`, top: `${targetRect.top}px`, width: `${targetRect.width}px`, height: `${targetRect.height}px`, borderRadius: '0px' }
      ]
      const anim = s.overlay.animate(keyframes, { duration: s.durationMs, easing: s.easing, fill: 'forwards', composite: 'replace' })
      const end = () => {
        s.done = true
        // Signaler que l'overlay est arrivé à destination
        try { win.dispatchEvent(new Event('imageMorph:reached')) } catch {}
        
        // Déclencher l'apparition du contenu immédiatement
        try { win.dispatchEvent(new Event('imageMorph:done')) } catch {}
        
        // Supprimer l'overlay immédiatement (pas de fade-out)
        setTimeout(() => {
          try { s.overlay.remove() } catch {}
          win.__posterTransition = undefined
        }, 100)
      }
      anim.onfinish = end
      anim.oncancel = end
    })
  })
}


