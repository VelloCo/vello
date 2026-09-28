import { useState } from 'react'
import { SHOWCASE_FALLBACK, SHOWCASE_MODELS } from '../config/site'
import { ModelViewer } from '../components/ModelViewer'

export function Showcase() {
  const [active, setActive] = useState(0)
  const [switching, setSwitching] = useState(false)
  const [shown, setShown] = useState(0)
  const model = SHOWCASE_MODELS[shown]

  // Transição: esmaece o modelo atual, troca o arquivo e revela o novo
  // quando ele terminar de carregar (onLoad).
  const select = (i: number) => {
    if (i === active) return
    setActive(i)
    setSwitching(true)
    window.setTimeout(() => setShown(i), 380)
    window.setTimeout(() => setSwitching(false), 3000) // segurança se o load não disparar
  }

  return (
    <section id="3d" className="section section-dark showcase">
      <div className="container">
        <div className="showcase-head">
          <p className="kicker kicker-dark reveal">03 — Experiências 3D</p>
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Seu projeto.
            <br />
            <span className="dim">De todos os ângulos.</span>
          </h2>
          <p className="showcase-lead reveal" style={{ '--d': '160ms' } as React.CSSProperties}>
            Transformamos produtos e ambientes em experiências digitais interativas.
          </p>
        </div>

        <div className="showcase-stage reveal reveal-fade" style={{ '--d': '200ms' } as React.CSSProperties}>
          <div className="stage-floor" aria-hidden />
          <div className={`showcase-model ${switching ? 'is-switching' : ''}`}>
            {/* Modelos da seção: public/models/{cozinha,closet,sala,escritorio}.glb
                (lista editável em SHOWCASE_MODELS, src/config/site.ts). */}
            <ModelViewer
              key="showcase"
              src={model.src}
              fallbackSrc={SHOWCASE_FALLBACK}
              alt={`${model.label} planejada em 3D — arraste para girar`}
              cameraOrbit={model.orbit}
              autoRotate
              rotationSpeed="8deg"
              environment="neutral"
              exposure={1.05}
              shadowIntensity={0.9}
              tone="dark"
              controls
              onLoad={() => setSwitching(false)}
            />
          </div>
          <div className="stage-meta" aria-hidden>
            <span>{String(shown + 1).padStart(2, '0')} / {String(SHOWCASE_MODELS.length).padStart(2, '0')}</span>
            <span>Arraste · Pinça · Ctrl + roda</span>
          </div>
        </div>

        <div className="model-tabs reveal" role="tablist" aria-label="Escolha o ambiente">
          {SHOWCASE_MODELS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`model-tab ${active === i ? 'is-active' : ''}`}
              onClick={() => select(i)}
            >
              <span className="tab-num">{String(i + 1).padStart(2, '0')}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
