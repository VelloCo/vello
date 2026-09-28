import { useEffect, useRef } from 'react'

/**
 * Parallax muito sutil: desloca o elemento `strength` px por 1000 px rolados,
 * relativo ao centro da tela. Desligado com prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement>(strength = 40) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect()
      const delta = r.top + r.height / 2 - window.innerHeight / 2
      el.style.transform = `translate3d(0, ${((-delta * strength) / 1000).toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [strength])

  return ref
}
