import { useEffect, useRef, useState } from 'react'
import { SHOWCASE_FALLBACK, SHOWCASE_MODELS } from '../config/site'
import { ModelViewer } from '../components/ModelViewer'
import { Ambiente3D, type AmbienteId } from '../components/Ambiente3D'
import { ESTUDIO_ESCURO } from '../three/estudio'

const AMBIENTES_3D: readonly string[] = ['cozinha', 'closet', 'sala']

export function Showcase() {
  const [active, setActive] = useState(0)
  const [switching, setSwitching] = useState(false)
  const [shown, setShown] = useState(0)
  const model = SHOWCASE_MODELS[shown]
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  // Transição: esmaece o modelo atual, troca o arquivo e revela o novo
  // quando ele terminar de carregar (onLoad). Um clique novo no meio da
  // troca cancela a anterior — a última escolha sempre vence.
  const select = (i: number) => {
    if (i === active) return
    clearTimers()
    setActive(i)
    if (i === shown) {
      setSwitching(false)
      return
    }
    if (AMBIENTES_3D.includes(SHOWCASE_MODELS[i].id)) {
      setShown(i)
      setSwitching(false)
      return
    }
    setSwitching(true)
    timers.current.push(
      window.setTimeout(() => setShown(i), 380),
      window.setTimeout(() => setSwitching(false), 3000), // segurança se o load não disparar
    )
  }

  return (
    <section id="3d" className="section section-dark showcase">
      <div className="container">
        <div className="showcase-head">
          <h2 className="display h2 reveal" style={{ '--d': '80ms' } as React.CSSProperties}>
            Seu projeto.
            <br />
            <span className="dim">De todos os ângulos.</span>
          </h2>
          <p className="showcase-lead reveal" style={{ '--d': '160ms' } as React.CSSProperties}>
            Transformamos produtos e ambientes em experiências digitais interativas.
          </p>
        </div>

        {/* Contêiner fixo com a entrada animada; o palco dentro troca com a aba. */}
        <div className="reveal reveal-fade" style={{ '--d': '200ms' } as React.CSSProperties}>
        {AMBIENTES_3D.includes(model.id) ? (
          /* Cozinha, closet e sala: motor próprio com pontos de informação,
             portas/gavetas animadas e luz de estúdio (src/components/Ambiente3D.tsx). */
          <div className={`showcase-a3d ${switching ? 'is-switching' : ''}`}>
            <Ambiente3D
              key={model.id}
              ambiente={model.id as AmbienteId}
              poster={{
                paisagem: `${import.meta.env.BASE_URL}models/posters/${model.id}.webp`,
                retrato: `${import.meta.env.BASE_URL}models/posters/${model.id}-retrato.webp`,
              }}
              estudio={ESTUDIO_ESCURO}
              tone="dark"
              tamanho={model.tamanho}
            />
          </div>
        ) : (
          <div className="showcase-stage">
            <div className="stage-floor" aria-hidden />
            <div className={`showcase-model ${switching ? 'is-switching' : ''}`}>
              <ModelViewer
                key="showcase"
                src={model.src}
                fallbackSrc={SHOWCASE_FALLBACK}
                alt={`${model.label} em 3D — arraste para girar`}
                cameraOrbit={model.orbit}
                minCameraOrbit={model.min}
                maxCameraOrbit={model.max}
                autoRotate={model.autoRotate}
                sway={model.autoRotate ? undefined : [10, 70]}
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
              <span>Arraste · Pinça · Ctrl + roda</span>
            </div>
          </div>
        )}

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
