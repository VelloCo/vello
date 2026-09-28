import { CONTACT, HERO_MODEL } from '../config/site'
import { ModelViewer } from '../components/ModelViewer'
import { Arrow } from '../components/Arrow'
import { useParallax } from '../hooks/useParallax'

export function Hero() {
  const stage = useParallax<HTMLDivElement>(-30)

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow reveal">
            <span className="eyebrow-mark" aria-hidden />
            Marketing + digital para planejados
          </p>

          <h1 className="display hero-title">
            <span className="line-mask reveal" style={{ '--d': '80ms' } as React.CSSProperties}><span className="line">O digital também</span></span>
            <span className="line-mask reveal" style={{ '--d': '180ms' } as React.CSSProperties}><span className="line">precisa ser</span></span>
            <span className="line-mask reveal" style={{ '--d': '280ms' } as React.CSSProperties}><span className="line"><em className="accent">planejado.</em></span></span>
          </h1>

          <p className="hero-lead reveal" style={{ '--d': '420ms' } as React.CSSProperties}>
            Sites, estratégia e experiências digitais desenvolvidas para empresas de móveis planejados que querem
            vender mais e se posicionar melhor.
          </p>

          <div className="hero-ctas reveal" style={{ '--d': '520ms' } as React.CSSProperties}>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-dark">
              Falar com a Módulo <Arrow />
            </a>
            <a href="#projetos" className="btn btn-line">
              Ver projetos
            </a>
          </div>
        </div>

        <div className="hero-stage reveal reveal-fade" style={{ '--d': '300ms' } as React.CSSProperties}>
          {/* Linhas de cota: o modelo "flutua" sobre uma prancha técnica. */}
          <div className="blueprint" aria-hidden>
            <span className="bp-line bp-h" />
            <span className="bp-line bp-v" />
            <span className="bp-dim bp-dim-x">
              <i />
              <b>1380 mm</b>
              <i />
            </span>
            <span className="bp-dim bp-dim-y">
              <i />
              <b>1920 mm</b>
              <i />
            </span>
            <span className="bp-tag bp-tag-tl">MOD—01</span>
            <span className="bp-tag bp-tag-br">Escala 1:20</span>
          </div>

          <div ref={stage} className="hero-model">
            {/* Modelo do hero: troque o arquivo em public/models/hero.glb
                ou altere HERO_MODEL em src/config/site.ts. */}
            <ModelViewer
              src={HERO_MODEL}
              alt="Estante modular planejada em 3D — arraste para girar"
              autoRotate
              cameraControls
              cameraOrbit="-32deg 76deg auto"
              rotationSpeed="9deg"
              exposure={0.92}
              shadowIntensity={0.75}
              controls
            />
          </div>

          <p className="hero-hint">
            <span aria-hidden className="hint-dot" />
            Arraste para girar · pinça ou Ctrl + roda para aproximar
          </p>
        </div>
      </div>

      <div className="container hero-foot reveal" style={{ '--d': '700ms' } as React.CSSProperties}>
        <p>Construímos o digital de quem transforma espaços.</p>
        <a href="#posicionamento" className="scroll-cue">
          Role <span aria-hidden className="scroll-line" />
        </a>
      </div>
    </section>
  )
}
