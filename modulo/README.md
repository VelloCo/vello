# Módulo — landing page

Landing page da Módulo (marketing, sites e presença digital para empresas de
móveis planejados). Projeto independente do Vello: tem o próprio
`package.json` e não entra no build da raiz.

React 19 + TypeScript + Vite + Tailwind v4. 3D: motor próprio em three.js
para cozinha, closet e sala (`src/three/`, `src/components/Ambiente3D.tsx`) e
Google `<model-viewer>` para a casa.

### Motor 3D próprio (cozinha, closet, sala, hero)

- Pontos de informação: nós `HOTSPOT_*` do GLB (título/descrição) + texto
  complementar e enquadramento em `src/three/conteudo/{cozinha,closet,sala}.ts`.
- Câmera, limites, volumes que a câmera não atravessa e luzes de LED por
  ambiente: `src/three/modelos.ts`.
- Pontos com `animation` no GLB abrem a porta/gaveta ao serem selecionados.
- Estúdio: `src/three/estudio.ts` (escuro na seção 3D, branco transparente no hero).
- Pôsteres em `public/models/posters/` (capturados do próprio motor; refaça
  se mudar modelo ou câmera).
- O three.js só é baixado quando o 3D abre (chunk `motor-*.js`).
- Os GLBs destes três vêm do repositório da Talhe (versões refeitas no
  Blender e otimizadas com meshopt), não do pacote abaixo.

```bash
cd modulo
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
```

## Onde trocar as coisas

| O quê | Onde |
| --- | --- |
| Contatos (WhatsApp, Instagram, e-mail) | `src/config/site.ts` → `CONTACT` |
| Modelo 3D do hero | `HERO_MODEL` (hoje a sala) |
| Modelos da seção 3D | `public/models/{cozinha,closet,sala,casa}.glb` (lista em `SHOWCASE_MODELS`) |
| Modelo reserva da seção 3D | `SHOWCASE_FALLBACK` (usado se algum acima falhar) |
| Projetos do portfólio | `src/config/site.ts` → `PROJECTS` (campo `image` para prints reais) |

### Modelos

Vêm do release `modelos-3d-2026-09-28` do repositório
(`modelos_site_para_codex.zip`), otimizados para a web com
`@gltf-transform/cli`: texturas até 1024 px em WebP e malha com Draco.

```bash
npx @gltf-transform/cli resize entrada.glb t1.glb --width 1024 --height 1024
npx @gltf-transform/cli webp t1.glb t2.glb --quality 82
npx @gltf-transform/cli draco t2.glb public/models/nome.glb
```

| Arquivo | Origem | Tamanho |
| --- | --- | --- |
| `cozinha.glb` | `cozinha_planejada.glb` (12,7 MB) | 1,2 MB |
| `closet.glb` | `closet_nogueira_web.glb` (6,6 MB) | 3,7 MB |
| `sala.glb` | `sala_carvalho_web.glb` (4,5 MB) | 1,7 MB |
| `casa.glb` | `casa_alameda_web.glb` (17,9 MB) | 11 MB |

O decodificador Draco fica em `public/draco/` (copiado de
`three/examples/jsm/libs/draco/gltf/`), sem depender do CDN do Google.

Cozinha, closet e sala são ambientes com paredes no fundo e à esquerda: o
giro fica limitado (`min`/`max` em `site.ts`) e, em vez de girar 360°, a
câmera balança devagar entre dois ângulos até a pessoa mexer. A casa gira
livre. As animações (abrir porta/gaveta) e os pontos `HOTSPOT_` dos modelos
ainda não são usados na página.

## Componente `<ModelViewer />`

```tsx
<ModelViewer
  src="/models/cozinha.glb"
  poster="/models/cozinha.webp" // opcional
  autoRotate
  cameraControls
  scale={1}
  environment="neutral"          // ou URL de um .hdr
/>
```

Outras props: `cameraOrbit`, `minCameraOrbit`, `maxCameraOrbit`, `sway`,
`exposure`, `shadowIntensity`, `rotationSpeed`,
`fallbackSrc`, `controls` (botões de zoom/recentralizar), `tone`
(`light`/`dark`), `onLoad`.

Interação: arrastar gira; pinça (touch/trackpad) ou Ctrl + roda aproxima. A
roda do mouse sozinha rola a página, para o 3D não "prender" o scroll.

O `<model-viewer>` vem do npm (`@google/model-viewer`) e é carregado sob
demanda, em vez do script do unpkg — funciona mesmo se o CDN estiver fora e
com Content-Security-Policy restritiva.

## Publicar

Na Vercel, criar um projeto apontando para este repositório com
**Root Directory = `modulo`** (framework Vite). Não afeta o deploy do Vello.
