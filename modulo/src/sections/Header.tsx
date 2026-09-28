import { useEffect, useState } from 'react'
import { CONTACT, NAV } from '../config/site'
import { Logo } from '../components/Logo'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      // Sobre seções pretas o header inverte as cores.
      const y = 36
      setOnDark(
        [...document.querySelectorAll('.section-dark')].some((el) => {
          const r = el.getBoundingClientRect()
          return r.top <= y && r.bottom >= y
        }),
      )
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''} ${onDark && !open ? 'is-dark' : ''}`}>
      <div className="container header-row">
        <a href="#top" className="header-logo" aria-label="Módulo — início" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="header-nav" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm header-cta">
          Falar com a Módulo
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" inert={!open}>
        <nav className="container" aria-label="Menu">
          {NAV.map((item, i) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} style={{ '--i': i } as React.CSSProperties}>
              <span className="mobile-index">0{i + 1}</span>
              {item.label}
            </a>
          ))}
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-dark mobile-cta" onClick={() => setOpen(false)}>
            Falar com a Módulo
          </a>
        </nav>
      </div>
    </header>
  )
}
