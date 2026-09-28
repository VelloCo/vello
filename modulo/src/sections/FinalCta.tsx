import { CONTACT } from '../config/site'
import { Arrow } from '../components/Arrow'

export function FinalCta() {
  return (
    <section id="contato" className="section final-cta">
      <div className="container final-inner">
        <h2 className="display h2 final-title">
          <span className="reveal">Sua empresa já planeja cada detalhe.</span>
          <span className="reveal dim" style={{ '--d': '140ms' } as React.CSSProperties}>
            Está na hora de planejar o digital.
          </span>
        </h2>
        <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-dark btn-xl reveal" style={{ '--d': '260ms' } as React.CSSProperties}>
          Começar um projeto <Arrow />
        </a>
        <p className="final-tags reveal" style={{ '--d': '340ms' } as React.CSSProperties}>
          Sites <i /> Marketing <i /> 3D <i /> Estratégia
        </p>
      </div>
    </section>
  )
}
