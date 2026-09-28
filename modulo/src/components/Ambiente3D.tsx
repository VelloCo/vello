import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import type { Motor, PosicaoMarcador } from '../three/motor'
import type { Qualidade } from '../three/cena'
import type { Estudio } from '../three/estudio'
import { MODELOS } from '../three/modelos'
import { pontos as pontosCozinha } from '../three/conteudo/cozinha'
import { pontos as pontosCloset } from '../three/conteudo/closet'
import { pontos as pontosSala } from '../three/conteudo/sala'

/*
 * <Ambiente3D /> — ambiente planejado em 3D com pontos de informação.
 *
 * Motor próprio em three.js (src/three/): luz de estúdio, sombras, oclusão de
 * ambiente, pontos HOTSPOT_* lidos do GLB, portas/gavetas animadas, câmera
 * que não atravessa móveis, render sob demanda e resolução adaptada ao
 * aparelho. O three.js só é baixado quando o 3D abre.
 *
 * Desktop: carrega sozinho quando aparece na tela. Celular: pôster + botão
 * "Explorar em 3D", que abre em tela cheia (a rolagem da página nunca fica
 * presa no 3D).
 */

export type AmbienteId = 'cozinha' | 'closet' | 'sala'

const CONTEUDO = { cozinha: pontosCozinha, closet: pontosCloset, sala: pontosSala }

type Ponto = {
  no: string
  numero: number
  rotulo: string
  titulo: string
  descricao: string
  detalhes: string[]
  animacao?: string
}

const telaPequena = () => matchMedia('(max-width: 899px), (pointer: coarse)').matches
const reduzirMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function detectarQualidade(): Qualidade {
  const forcada = new URLSearchParams(location.search).get('qualidade')
  if (forcada === 'baixa' || forcada === 'media' || forcada === 'alta') return forcada
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const memoria = nav.deviceMemory ?? 8
  const nucleos = nav.hardwareConcurrency ?? 8
  if (nav.connection?.saveData || memoria <= 3 || nucleos <= 4) return 'baixa'
  if (matchMedia('(pointer: coarse)').matches || memoria <= 4) return 'media'
  return 'alta'
}

const suportaWebGL2 = () => {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export type Ambiente3DProps = {
  ambiente: AmbienteId
  /** Imagens mostradas antes do 3D (e no lugar dele, sem WebGL). */
  poster?: { paisagem: string; retrato: string }
  estudio?: Estudio
  tone?: 'dark' | 'light'
  /** Esconde lista/ficha de pontos (uso decorativo, ex.: hero). */
  semPontos?: boolean
  /** Tamanho do arquivo para o botão do celular, ex.: "3 MB". */
  tamanho?: string
  className?: string
  style?: CSSProperties
}

export function Ambiente3D({ ambiente, poster, estudio, tone = 'dark', semPontos = false, tamanho, className, style }: Ambiente3DProps) {
  const raiz = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const alvoCanvas = useRef<HTMLDivElement>(null)
  const motorRef = useRef<Motor | null>(null)
  const marcadoresRef = useRef(new Map<string, HTMLButtonElement>())

  const [estado, setEstado] = useState<'ocioso' | 'carregando' | 'ativo' | 'erro'>('ocioso')
  const [progresso, setProgresso] = useState(0)
  const [ativo, setAtivo] = useState<string | null>(null)
  const [imersivo, setImersivo] = useState(false)
  const [pedido, setPedido] = useState(false) // o visitante pediu o 3D (ou apareceu na tela no desktop)
  const [dadosGlb, setDadosGlb] = useState<Record<string, { titulo: string; descricao: string; animacao?: string }>>({})

  const cfg = MODELOS[ambiente]
  const pontos: Ponto[] = useMemo(
    () =>
      CONTEUDO[ambiente].map((p, i) => ({
        no: p.no,
        numero: i + 1,
        rotulo: p.rotulo,
        titulo: dadosGlb[p.no]?.titulo ?? p.titulo ?? p.rotulo,
        descricao: dadosGlb[p.no]?.descricao ?? '',
        detalhes: p.detalhes,
        animacao: dadosGlb[p.no]?.animacao,
      })),
    [ambiente, dadosGlb],
  )
  const pontoAtivo = pontos.find((p) => p.no === ativo) ?? null

  // Troca de ambiente: quem usa o componente passa key={ambiente}, que o remonta.

  // Pede o 3D: define o estado já no evento (clique ou palco visível).
  const pedir = useCallback(() => {
    if (!suportaWebGL2()) {
      setEstado('erro')
      return
    }
    setEstado('carregando')
    setProgresso(0)
    setPedido(true)
  }, [])

  // ——— Desktop: pede o 3D quando o palco aparece na tela ———
  useEffect(() => {
    const el = palco.current
    // ?auto3d força a carga automática (usado para gerar os pôsteres)
    if (!el || (telaPequena() && !new URLSearchParams(location.search).has('auto3d'))) return
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
    if (nav.connection?.saveData) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          pedir()
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pedir])

  // ——— Cria/destroi o motor ———
  useEffect(() => {
    if (!pedido) return
    let cancelado = false
    ;(async () => {
      try {
        const { criarMotor } = await import('../three/motor')
        if (cancelado || !alvoCanvas.current) return
        const motor = await criarMotor({
          container: alvoCanvas.current,
          modelo: `${import.meta.env.BASE_URL}models/${ambiente}.glb`,
          config: cfg,
          estudio,
          qualidade: detectarQualidade(),
          reduzirMovimento: reduzirMovimento(),
          vistas: Object.fromEntries(CONTEUDO[ambiente].map((p) => [p.no, { ...p.vista, alvo: [0, 0, 0] as [number, number, number] }])),
          aoProgredir: (f) => setProgresso(f),
          aoMoverMarcadores: (lista: PosicaoMarcador[]) => {
            for (const m of lista) {
              const el = marcadoresRef.current.get(m.no)
              if (!el) continue
              el.style.transform = `translate3d(${m.x.toFixed(1)}px, ${m.y.toFixed(1)}px, 0)`
              el.classList.toggle('is-oculto', !m.visivel)
            }
          },
          aoToqueVazio: () => setAtivo(null),
          aoInteragir: () => {},
          aoPerderContexto: () => {
            motorRef.current?.dispose()
            motorRef.current = null
            setEstado('erro')
          },
        })
        if (cancelado) {
          motor.dispose()
          return
        }
        motorRef.current = motor
        setDadosGlb(Object.fromEntries(motor.hotspots.map((h) => [h.no, { titulo: h.titulo, descricao: h.descricao, animacao: h.animacao }])))
        setEstado('ativo')
      } catch (e) {
        console.error(e)
        if (!cancelado) setEstado('erro')
      }
    })()
    return () => {
      cancelado = true
      motorRef.current?.dispose()
      motorRef.current = null
    }
  }, [pedido, ambiente, cfg, estudio])

  // ——— Ponto ativo: câmera + animação ———
  useEffect(() => {
    const m = motorRef.current
    if (!m || estado !== 'ativo') return
    if (ativo) m.focar(ativo)
    m.animar(pontos.find((p) => p.no === ativo)?.animacao ?? null)
  }, [ativo, estado, pontos])

  // ——— Margens da interface: a câmera centraliza o ambiente na área livre ———
  useEffect(() => {
    const m = motorRef.current
    if (!m || estado !== 'ativo') return
    const desktop = !telaPequena()
    m.definirMargens(desktop ? { direita: 0, topo: 64, base: semPontos ? 24 : 84 } : { direita: 0, topo: imersivo ? 76 : 0, base: imersivo ? 28 : 0 })
    m.permitirRoda(imersivo)
  }, [estado, imersivo, semPontos])

  // ——— Pausa fora da tela e aba oculta ———
  useEffect(() => {
    const el = palco.current
    if (!el || estado !== 'ativo') return
    let naTela = true
    const atualizar = () => motorRef.current?.pausar(!naTela || document.hidden || (telaPequena() && !imersivo))
    const io = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting
      atualizar()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', atualizar)
    atualizar()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', atualizar)
    }
  }, [estado, imersivo])

  // ——— Tela cheia (celular): trava a rolagem, "voltar" do sistema fecha ———
  const sairImersivo = useCallback((doHistorico = false) => {
    setImersivo(false)
    document.documentElement.classList.remove('trava-rolagem')
    if (!doHistorico && history.state?.ambiente3d) history.back()
  }, [])
  const entrarImersivo = () => {
    setImersivo(true)
    document.documentElement.classList.add('trava-rolagem')
    history.pushState({ ambiente3d: true }, '')
  }
  useEffect(() => {
    const aoVoltar = () => {
      if (document.documentElement.classList.contains('trava-rolagem')) sairImersivo(true)
    }
    addEventListener('popstate', aoVoltar)
    return () => removeEventListener('popstate', aoVoltar)
  }, [sairImersivo])

  // ——— Teclado ———
  useEffect(() => {
    const el = raiz.current
    if (!el) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (ativo) setAtivo(null)
        else if (imersivo) sairImersivo()
      }
    }
    el.addEventListener('keydown', tecla)
    return () => el.removeEventListener('keydown', tecla)
  }, [ativo, imersivo, sairImersivo])

  const abrir = () => {
    if (!pedido) pedir()
    if (telaPequena()) entrarImersivo()
  }
  const passo = (d: number) => {
    const i = pontos.findIndex((p) => p.no === ativo)
    setAtivo(pontos[((i < 0 ? 0 : i + d) + pontos.length) % pontos.length].no)
  }

  const mostrarCapa = estado === 'ocioso' || (telaPequena() && !imersivo && estado === 'ativo')

  return (
    <div
      ref={raiz}
      className={`a3d a3d-${tone} ${imersivo ? 'is-imersivo' : ''} ${ativo ? 'tem-ponto' : ''} ${className ?? ''}`}
      data-estado={estado}
      style={style}
    >
      <div
        ref={palco}
        className="a3d-palco"
        tabIndex={0}
        role="group"
        aria-roledescription="visualizador 3D"
        aria-label={`${ambiente} em 3D. Arraste para girar.`}
      >
        {poster && (
          <picture>
            <source media="(max-width: 899px)" srcSet={poster.retrato} />
            <img className="a3d-poster" src={poster.paisagem} alt="" loading="lazy" decoding="async" />
          </picture>
        )}
        <div ref={alvoCanvas} className="a3d-canvas" />

        {!semPontos && (
          <div className="a3d-marcadores" aria-hidden={estado !== 'ativo'}>
            {pontos.map((p) => (
              <button
                key={p.no}
                type="button"
                tabIndex={-1}
                ref={(el) => {
                  if (el) marcadoresRef.current.set(p.no, el)
                  else marcadoresRef.current.delete(p.no)
                }}
                className={`a3d-marcador is-oculto ${ativo === p.no ? 'is-ativo' : ''}`}
                onClick={() => setAtivo(p.no)}
                aria-label={`${p.numero}. ${p.titulo}`}
              >
                {p.numero}
              </button>
            ))}
          </div>
        )}

        {mostrarCapa && (
          <div className="a3d-capa">
            <button type="button" className="a3d-iniciar" onClick={abrir}>
              <svg viewBox="0 0 24 24" aria-hidden width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5" />
              </svg>
              Explorar em 3D{tamanho ? <span className="a3d-tamanho">{tamanho}</span> : null}
            </button>
          </div>
        )}

        {estado === 'carregando' && (
          <div className="a3d-carregando" role="status">
            <span className="a3d-barra" style={{ '--p': progresso } as CSSProperties} />
            <span>Carregando modelo</span>
          </div>
        )}

        {estado === 'erro' && (
          <div className="a3d-erro" role="alert">
            Não foi possível abrir o 3D neste aparelho.
            {pedido && (
              <button type="button" onClick={() => { setPedido(false); setTimeout(pedir, 0) }}>
                Tentar de novo
              </button>
            )}
          </div>
        )}

        {estado === 'ativo' && (!telaPequena() || imersivo) && (
          <div className="a3d-ferramentas" role="toolbar" aria-label="Controles do 3D">
            <button type="button" onClick={() => { setAtivo(null); motorRef.current?.vistaInicial() }} aria-label="Vista inicial" title="Vista inicial">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" /></svg>
            </button>
            <button type="button" onClick={() => motorRef.current?.aproximar(0.75)} aria-label="Aproximar" title="Aproximar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
            </button>
            <button type="button" onClick={() => motorRef.current?.aproximar(1.33)} aria-label="Afastar" title="Afastar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M5 12h14" /></svg>
            </button>
          </div>
        )}

        {imersivo && (
          <button type="button" className="a3d-fechar" onClick={() => sairImersivo()}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            Fechar 3D
          </button>
        )}

        {!semPontos && pontoAtivo && estado === 'ativo' && (
          <article className="a3d-ficha" aria-live="polite">
            <header>
              <span className="a3d-num">{String(pontoAtivo.numero).padStart(2, '0')}</span>
              <h3>{pontoAtivo.titulo}</h3>
            </header>
            {pontoAtivo.descricao && <p className="a3d-resumo">{pontoAtivo.descricao}</p>}
            <ul>
              {pontoAtivo.detalhes.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <nav>
              <button type="button" onClick={() => passo(-1)} aria-label="Ponto anterior">←</button>
              <button type="button" onClick={() => passo(1)} aria-label="Próximo ponto">→</button>
              <button type="button" className="a3d-fechar-ficha" onClick={() => setAtivo(null)}>Fechar</button>
            </nav>
          </article>
        )}
      </div>

      {!semPontos && (
        <div className="a3d-pontos" role="list" aria-label="Pontos do projeto">
          {pontos.map((p) => (
            <button
              key={p.no}
              type="button"
              role="listitem"
              className={`a3d-chip ${ativo === p.no ? 'is-ativo' : ''}`}
              aria-pressed={ativo === p.no}
              onClick={() => {
                if (estado !== 'ativo') abrir()
                setAtivo(ativo === p.no ? null : p.no)
              }}
            >
              <span className="a3d-num">{String(p.numero).padStart(2, '0')}</span>
              {p.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
