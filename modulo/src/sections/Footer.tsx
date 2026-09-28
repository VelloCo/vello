import { CONTACT } from '../config/site'
import { Logo } from '../components/Logo'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo className="footer-logo" />
          <p className="footer-tagline">Digital para empresas de móveis planejados.</p>
        </div>
        <nav className="footer-links" aria-label="Contato">
          <a href={CONTACT.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${CONTACT.email}`}>E-mail</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Módulo.</span>
        <a href="#top">Voltar ao topo ↑</a>
      </div>
    </footer>
  )
}
