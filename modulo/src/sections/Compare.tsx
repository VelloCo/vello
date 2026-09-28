const BEFORE = ['Site genérico', 'Instagram dependente', 'WhatsApp desorganizado', 'Baixo posicionamento']
const AFTER = ['Site profissional', 'Posicionamento premium', 'Captação estruturada', 'Experiência digital']

// Deslocamentos "fora de esquadro" do lado sem planejamento (px, graus).
const DRIFT = [
  [10, -6, -1.2],
  [-14, 8, 0.8],
  [18, 4, -0.6],
  [-6, -4, 1.4],
]

export function Compare() {
  return (
    <section id="sobre" className="section">
      <div className="container">
        <div className="section-head">
          <p className="kicker reveal">05 — Antes / depois</p>
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Ter presença digital <br className="hide-sm" />
            <span className="dim">não é o mesmo que planejá-la.</span>
          </h2>
        </div>

        <div className="compare">
          <div className="compare-side compare-before reveal">
            <p className="compare-label">Ter presença digital</p>
            <ul>
              {BEFORE.map((item, i) => {
                const [x, y, r] = DRIFT[i]
                return (
                  <li key={item} style={{ '--x': `${x}px`, '--y': `${y}px`, '--r': `${r}deg` } as React.CSSProperties}>
                    <span className="compare-x" aria-hidden />
                    {item}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="compare-vs" aria-hidden>
            <span>vs</span>
          </div>

          <div className="compare-side compare-after reveal" style={{ '--d': '160ms' } as React.CSSProperties}>
            <p className="compare-label">Ter uma presença digital planejada</p>
            <ul>
              {AFTER.map((item, i) => (
                <li key={item} style={{ '--d': `${300 + i * 90}ms` } as React.CSSProperties}>
                  <span className="compare-num">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                  <span className="compare-check" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
