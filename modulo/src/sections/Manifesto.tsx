import { useScrollProgress } from '../hooks/useScrollProgress'

const LINES = [['Não', 'criamos', 'apenas', 'sites.'], ['Criamos', 'a', 'estrutura', 'digital'], ['onde', 'sua', 'marca', 'vai', 'crescer.']]

export function Manifesto() {
  const [ref, progress] = useScrollProgress<HTMLDivElement>(0.75, 0.9)
  const total = LINES.flat().length
  let n = 0

  return (
    <section className="manifesto section-dark">
      <div ref={ref} className="manifesto-inner container">
        <p className="manifesto-text">
          {LINES.map((line, li) => (
            <span key={li} className={`m-line ${li === 0 ? 'm-first' : ''}`}>
              {line.map((word) => {
                const i = n++
                const t = Math.min(1, Math.max(0, progress * (total + 2) - i))
                return (
                  <span key={i} className="m-word" style={{ opacity: 0.14 + t * 0.86 }}>
                    {word}{' '}
                  </span>
                )
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
