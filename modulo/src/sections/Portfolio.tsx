import { PROJECTS } from '../config/site'
import { SiteMockup } from '../components/SiteMockup'
import { Arrow } from '../components/Arrow'

export function Portfolio() {
  return (
    <section id="projetos" className="section">
      <div className="container">
        <div className="section-head section-head-row">
          <div>
            <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
              Projetos que não <br className="hide-sm" />
              parecem templates.
            </h2>
          </div>
        </div>

        <div className="projects">
          {PROJECTS.map((p, i) => (
            <a
              key={p.client}
              href={p.href}
              className={`project reveal ${i % 3 === 0 ? 'project-wide' : ''}`}
              style={{ '--d': `${(i % 2) * 120}ms` } as React.CSSProperties}
              {...(p.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <div className="project-media">
                {p.image ? <img src={p.image} alt={`Site ${p.client}`} loading="lazy" /> : <SiteMockup layout={p.layout} name={p.client} />}
              </div>
              <div className="project-meta">
                <h3>{p.client}</h3>
                <span>{p.category}</span>
                <span>{p.year}</span>
                <Arrow className="project-arrow" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
