import { useEffect } from 'react'

/**
 * Marca com `is-in` todo elemento `.reveal` que entra na tela.
 * Uma única observação para a página toda; cada elemento anima uma vez.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
