import { Arrow } from '../components/Arrow'

const SERVICES = [
  { title: 'Sites', text: 'Sites pensados para transformar interesse em orçamento.' },
  { title: 'Landing Pages', text: 'Páginas focadas em campanhas, lançamentos e geração de leads.' },
  { title: 'Marketing', text: 'Estratégia para colocar sua empresa na frente das pessoas certas.' },
  { title: 'Experiências 3D', text: 'Mostre seus projetos e produtos de uma forma que seus concorrentes ainda não mostram.' },
  { title: 'Posicionamento digital', text: 'Uma presença que transmite o mesmo padrão dos seus projetos.' },
]

export function Services() {
  return (
    <section id="servicos" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="kicker reveal">02 — Serviços</p>
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Tudo que sua marca <br className="hide-sm" />
            precisa para crescer.
          </h2>
        </div>

        <ol className="services">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="service reveal" style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-text">{s.text}</p>
              <Arrow className="service-arrow" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
