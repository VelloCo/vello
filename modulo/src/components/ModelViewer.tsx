import { useEffect, useRef, useState, type CSSProperties } from 'react'

/*
 * <ModelViewer /> — visualizador 3D reutilizável (Google <model-viewer>).
 *
 *   <ModelViewer src="/models/cozinha.glb" autoRotate cameraControls />
 *
 * Para trocar o modelo, basta mudar `src` (arquivos em public/models/).
 *
 * Interação: arrastar gira, pinça (touch/trackpad) ou Ctrl + roda aproxima.
 * A roda do mouse sozinha continua rolando a página — sem "prender" o scroll.
 */

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string
  fieldOfView: string
  zoom: (steps: number) => void
  jumpCameraToGoal: () => void
  resetTurntableRotation: (theta?: number) => void
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.HTMLAttributes<HTMLElement> & {
        ref?: React.Ref<HTMLElement>
        [attr: string]: unknown
      }
    }
  }
}

// Carrega o web component uma única vez, só quando o primeiro viewer aparece.
let loader: Promise<unknown> | null = null
const loadModelViewer = () => (loader ??= import('@google/model-viewer'))

export type ModelViewerProps = {
  /** Caminho do .glb/.gltf, ex.: "/models/hero.glb". */
  src: string
  /** Imagem mostrada enquanto o modelo carrega (opcional). */
  poster?: string
  alt?: string
  autoRotate?: boolean
  /** Permite girar/aproximar com mouse e touch. */
  cameraControls?: boolean
  /** Escala uniforme do modelo (1 = tamanho original). */
  scale?: number
  /** "neutral" (padrão), "legacy" ou URL de um HDR. */
  environment?: string
  exposure?: number
  shadowIntensity?: number
  /** Ângulo inicial: "theta phi raio", ex.: "-30deg 75deg auto". */
  cameraOrbit?: string
  /** Velocidade do giro automático, ex.: "10deg". */
  rotationSpeed?: string
  /** Modelo alternativo se `src` falhar. */
  fallbackSrc?: string
  /** Mostra os botões minimalistas de zoom e recentralizar. */
  controls?: boolean
  tone?: 'light' | 'dark'
  className?: string
  style?: CSSProperties
  onLoad?: () => void
}

export function ModelViewer({
  src,
  poster,
  alt = 'Modelo 3D interativo',
  autoRotate = false,
  cameraControls = true,
  scale = 1,
  environment = 'neutral',
  exposure = 1,
  shadowIntensity = 0.55,
  cameraOrbit = '-30deg 75deg auto',
  rotationSpeed = '12deg',
  fallbackSrc,
  controls = false,
  tone = 'light',
  className = '',
  style,
  onLoad,
}: ModelViewerProps) {
  const ref = useRef<ModelViewerElement | null>(null)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(src)
  const [requested, setRequested] = useState(src)
  const onLoadRef = useRef(onLoad)

  // Novo `src` vindo de fora: recomeça o carregamento.
  if (requested !== src) {
    setRequested(src)
    setCurrent(src)
    setLoaded(false)
    setProgress(0)
  }

  useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])

  useEffect(() => {
    let alive = true
    loadModelViewer().then(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    const handleProgress = (e: Event) => setProgress((e as CustomEvent<{ totalProgress: number }>).detail.totalProgress)
    const handleLoad = () => {
      // Cada modelo novo começa de frente, no ângulo definido.
      el.resetTurntableRotation?.(0)
      el.jumpCameraToGoal?.()
      setLoaded(true)
      onLoadRef.current?.()
    }
    const handleError = () => {
      if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc)
    }
    // Deixa a roda do mouse rolar a página; zoom só com Ctrl/⌘ ou pinça.
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation()
    }
    el.addEventListener('progress', handleProgress)
    el.addEventListener('load', handleLoad)
    el.addEventListener('error', handleError)
    el.addEventListener('wheel', handleWheel, { capture: true })
    return () => {
      el.removeEventListener('progress', handleProgress)
      el.removeEventListener('load', handleLoad)
      el.removeEventListener('error', handleError)
      el.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [ready, current, fallbackSrc])

  const zoom = (steps: number) => ref.current?.zoom(steps)
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.cameraOrbit = cameraOrbit
    el.fieldOfView = 'auto'
    el.resetTurntableRotation?.(0)
  }

  // Com "reduzir movimento" ligado, o modelo não gira sozinho.
  const [reducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const s = String(scale)
  return (
    <div className={`mv-wrap mv-${tone} ${className}`} style={style} data-loaded={loaded || undefined}>
      {ready && (
        <model-viewer
          ref={ref as React.Ref<HTMLElement>}
          src={current}
          poster={poster}
          alt={alt}
          scale={`${s} ${s} ${s}`}
          environment-image={environment}
          exposure={String(exposure)}
          shadow-intensity={String(shadowIntensity)}
          shadow-softness="1"
          tone-mapping="neutral"
          camera-orbit={cameraOrbit}
          min-camera-orbit="auto 20deg auto"
          max-camera-orbit="auto 95deg auto"
          interpolation-decay="140"
          rotation-per-second={rotationSpeed}
          auto-rotate={autoRotate && !reducedMotion ? '' : undefined}
          auto-rotate-delay="2500"
          camera-controls={cameraControls ? '' : undefined}
          touch-action="pan-y"
          interaction-prompt="none"
          loading="eager"
          style={{ width: '100%', height: '100%', background: 'transparent', '--poster-color': 'transparent', '--progress-bar-height': '0px' } as CSSProperties}
        />
      )}

      <div className="mv-progress" aria-hidden style={{ transform: `scaleX(${progress})`, opacity: loaded ? 0 : 1 }} />

      {controls && (
        <div className="mv-controls" role="group" aria-label="Controles do modelo 3D">
          <button type="button" onClick={() => zoom(1)} aria-label="Aproximar">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M8 3v10M3 8h10" />
            </svg>
          </button>
          <button type="button" onClick={() => zoom(-1)} aria-label="Afastar">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M3 8h10" />
            </svg>
          </button>
          <button type="button" onClick={reset} aria-label="Voltar ao ângulo inicial">
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
              <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9" />
              <path d="M2.5 2.5v2.8h2.8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
