import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Progresso (0 → 1) do elemento atravessando a tela.
 * `start`/`end` são frações da altura da janela onde o topo/fim do elemento
 * precisam estar para contar 0 e 1.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.85, end = 0.35): [RefObject<T | null>, number] {
  const ref = useRef<T | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = r.top - vh * start
      const to = r.bottom - vh * end
      const p = Math.min(1, Math.max(0, -from / (to - from)))
      setProgress((prev) => (Math.abs(prev - p) > 0.001 ? p : prev))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [start, end])

  return [ref, progress]
}
