import { useParallax } from '../hooks/useParallax'

// Composição abstrata: uma "elevação" de móvel planejado sobre grade modular.
// [x, y, largura, altura, preenchimento] em uma grade de 12 × 12.
const BLOCKS: [number, number, number, number, 'ink' | 'mist' | 'line'][] = [
  [0, 0, 4, 7, 'line'],
  [4, 0, 4, 3, 'mist'],
  [8, 0, 4, 5, 'ink'],
  [4, 3, 4, 4, 'line'],
  [0, 7, 3, 5, 'ink'],
  [3, 7, 5, 2, 'mist'],
  [3, 9, 5, 3, 'line'],
  [8, 5, 4, 7, 'line'],
  [9, 6, 2, 2, 'mist'],
]

export function Positioning() {
  const art = useParallax<HTMLDivElement>(24)
  const unit = 40

  return (
    <section id="posicionamento" className="section">
      <div className="container split">
        <div className="split-copy">
          <p className="kicker reveal">01 — Posicionamento</p>
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Planejado até <br className="hide-sm" />
            no digital.
          </h2>
          <div className="stack-lines">
            <p className="reveal" style={{ '--d': '160ms' } as React.CSSProperties}>Seu showroom pode ser incrível.</p>
            <p className="reveal" style={{ '--d': '240ms' } as React.CSSProperties}>Seu projeto pode ser impecável.</p>
            <p className="reveal muted" style={{ '--d': '320ms' } as React.CSSProperties}>
              Mas se sua presença digital não transmite o mesmo nível de qualidade, você está deixando
              oportunidades na mesa.
            </p>
          </div>
        </div>

        <div className="split-art reveal reveal-fade">
          <div ref={art} className="modular-art">
            <svg viewBox={`0 0 ${12 * unit} ${12 * unit}`} role="img" aria-label="Composição modular abstrata">
              <g className="grid-lines">
                {Array.from({ length: 13 }, (_, i) => (
                  <g key={i}>
                    <line x1={i * unit} y1={0} x2={i * unit} y2={12 * unit} />
                    <line x1={0} y1={i * unit} x2={12 * unit} y2={i * unit} />
                  </g>
                ))}
              </g>
              {BLOCKS.map(([x, y, w, h, fill], i) => (
                <rect
                  key={i}
                  className={`block block-${fill}`}
                  x={x * unit + 3}
                  y={y * unit + 3}
                  width={w * unit - 6}
                  height={h * unit - 6}
                  style={{ '--d': `${300 + i * 110}ms` } as React.CSSProperties}
                />
              ))}
            </svg>
            <div className="art-caption">
              <span>Grade 12 × 12</span>
              <span>Módulo base 40</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
