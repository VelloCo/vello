import { useScrollProgress } from '../hooks/useScrollProgress'

const STEPS = [
  { title: 'Diagnóstico', text: 'Entendemos sua empresa, seu público e onde as vendas se perdem hoje.' },
  { title: 'Estratégia', text: 'Definimos posicionamento, canais e o caminho do visitante até o orçamento.' },
  { title: 'Design', text: 'Uma identidade digital no mesmo padrão dos seus ambientes.' },
  { title: 'Desenvolvimento', text: 'Sites rápidos, 3D interativo e captação integrada ao seu atendimento.' },
  { title: 'Publicação', text: 'Lançamento com medição configurada desde o primeiro dia.' },
  { title: 'Crescimento', text: 'Campanhas, ajustes e novos conteúdos a partir dos números.' },
]

export function Process() {
  const [ref, progress] = useScrollProgress<HTMLOListElement>(0.8, 0.5)

  return (
    <section className="section section-tint">
      <div className="container">
        <div className="section-head">
          <p className="kicker reveal">06 — Processo</p>
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Do projeto ao digital.
          </h2>
        </div>

        <ol ref={ref} className="timeline" style={{ '--p': progress } as React.CSSProperties}>
          <span className="timeline-track" aria-hidden>
            <span className="timeline-fill" />
          </span>
          {STEPS.map((s, i) => {
            const reached = progress >= i / STEPS.length
            return (
              <li key={s.title} className={`step ${reached ? 'is-reached' : ''}`}>
                <span className="step-node" aria-hidden />
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
