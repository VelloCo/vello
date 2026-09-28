# Módulo — landing page

Landing page da Módulo (marketing, sites e presença digital para empresas de
móveis planejados). Projeto independente do Vello: tem o próprio
`package.json` e não entra no build da raiz.

React 19 + TypeScript + Vite + Tailwind v4, 3D com Google `<model-viewer>`.

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
| Modelo 3D do hero | `public/models/hero.glb` (ou `HERO_MODEL`) |
| Modelos da seção 3D | `public/models/{cozinha,closet,sala,escritorio}.glb` (lista em `SHOWCASE_MODELS`) |
| Modelo reserva da seção 3D | `public/models/showcase.glb` (usado se algum acima falhar) |
| Projetos do portfólio | `src/config/site.ts` → `PROJECTS` (campo `image` para prints reais) |

Para trocar um modelo, basta sobrescrever o `.glb` com o mesmo nome. Os
arquivos atuais são provisórios, gerados por
`scripts/generate-placeholder-models.mjs` (`npm run models`). Rodar o script
de novo sobrescreve os `.glb` — não rode depois de colocar os definitivos.

Dicas para os modelos: `.glb` com texturas embutidas, origem no chão, até
~5–10 MB (comprimir com Draco/Meshopt ajuda: `npx gltf-transform optimize`).

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

Outras props: `cameraOrbit`, `exposure`, `shadowIntensity`, `rotationSpeed`,
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
