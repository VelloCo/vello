// Gera os modelos 3D PROVISÓRIOS em public/models/*.glb.
//
// São móveis simples feitos só de caixas (sem dependências), para a página
// funcionar enquanto os modelos definitivos não chegam. Para usar os seus,
// basta sobrescrever o arquivo .glb com o mesmo nome em public/models/ —
// não é preciso rodar este script de novo.
//
// Uso: npm run models

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'models')

// ---------------------------------------------------------------- materiais

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const hex = (h) => [1, 3, 5].map((i) => srgbToLinear(parseInt(h.slice(i, i + 2), 16) / 255))

const MATERIALS = {
  white: { color: '#ECEBE7', roughness: 0.55 },
  graphite: { color: '#2B2B2A', roughness: 0.62 },
  oak: { color: '#B9A387', roughness: 0.7 },
  stone: { color: '#D9D9D6', roughness: 0.28 },
  black: { color: '#0E0E0E', roughness: 0.35, metallic: 0.4 },
  metal: { color: '#8A8A88', roughness: 0.3, metallic: 0.9 },
  fabricA: { color: '#C9C8C3', roughness: 0.9 },
  fabricB: { color: '#6E6D69', roughness: 0.9 },
  fabricC: { color: '#3C3B39', roughness: 0.9 },
  led: { color: '#FFFFFF', roughness: 1, emissive: [1, 0.96, 0.9] },
}

// ------------------------------------------------------------------- caixas

function createScene() {
  const groups = new Map()

  // Caixa pelo canto mínimo (x, y, z) e tamanho (w, h, d). Metros, Y para cima.
  function box(mat, x, y, z, w, h, d) {
    if (!MATERIALS[mat]) throw new Error(`material desconhecido: ${mat}`)
    if (!groups.has(mat)) groups.set(mat, { pos: [], nor: [], idx: [] })
    const g = groups.get(mat)
    const [x0, y0, z0, x1, y1, z1] = [x, y, z, x + w, y + h, z + d]
    const faces = [
      [[1, 0, 0], [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]]],
      [[-1, 0, 0], [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]],
      [[0, 1, 0], [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]]],
      [[0, -1, 0], [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]],
      [[0, 0, 1], [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]],
      [[0, 0, -1], [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]]],
    ]
    for (const [n, verts] of faces) {
      const base = g.pos.length / 3
      for (const v of verts) {
        g.pos.push(...v)
        g.nor.push(...n)
      }
      g.idx.push(base, base + 1, base + 2, base, base + 2, base + 3)
    }
  }

  return { box, groups }
}

// ---------------------------------------------------------------------- GLB

function writeGlb(name, build) {
  const scene = createScene()
  build(scene.box)

  // Centraliza em X/Z e apoia no chão (Y = 0).
  const all = [...scene.groups.values()].flatMap((g) => g.pos)
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < all.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      min[a] = Math.min(min[a], all[i + a])
      max[a] = Math.max(max[a], all[i + a])
    }
  }
  const offset = [-(min[0] + max[0]) / 2, -min[1], -(min[2] + max[2]) / 2]

  const chunks = []
  const bufferViews = []
  const accessors = []
  const materials = []
  const primitives = []
  let byteLength = 0

  function addView(typed, target) {
    const bytes = Buffer.from(typed.buffer)
    const pad = (4 - (bytes.length % 4)) % 4
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target })
    chunks.push(bytes, Buffer.alloc(pad))
    byteLength += bytes.length + pad
    return bufferViews.length - 1
  }

  for (const [matName, g] of scene.groups) {
    const m = MATERIALS[matName]
    materials.push({
      name: matName,
      pbrMetallicRoughness: {
        baseColorFactor: [...hex(m.color), 1],
        metallicFactor: m.metallic ?? 0,
        roughnessFactor: m.roughness,
      },
      ...(m.emissive ? { emissiveFactor: m.emissive } : {}),
    })

    const pos = new Float32Array(g.pos.length)
    const pMin = [Infinity, Infinity, Infinity]
    const pMax = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < g.pos.length; i++) {
      const a = i % 3
      pos[i] = g.pos[i] + offset[a]
      pMin[a] = Math.min(pMin[a], pos[i])
      pMax[a] = Math.max(pMax[a], pos[i])
    }
    const count = g.pos.length / 3
    accessors.push({ bufferView: addView(pos, 34962), componentType: 5126, count, type: 'VEC3', min: pMin, max: pMax })
    accessors.push({ bufferView: addView(new Float32Array(g.nor), 34962), componentType: 5126, count, type: 'VEC3' })
    accessors.push({ bufferView: addView(new Uint32Array(g.idx), 34963), componentType: 5125, count: g.idx.length, type: 'SCALAR' })
    const a = accessors.length
    primitives.push({ attributes: { POSITION: a - 3, NORMAL: a - 2 }, indices: a - 1, material: materials.length - 1 })
  }

  const gltf = {
    asset: { version: '2.0', generator: 'Módulo — placeholder' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [{ name, primitives }],
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength }],
  }

  let json = Buffer.from(JSON.stringify(gltf))
  json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)])
  const bin = Buffer.concat(chunks)
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8)
  const chunkHeader = (len, type) => {
    const b = Buffer.alloc(8)
    b.writeUInt32LE(len, 0)
    b.writeUInt32LE(type, 4)
    return b
  }
  const file = Buffer.concat([header, chunkHeader(json.length, 0x4e4f534a), json, chunkHeader(bin.length, 0x004e4942), bin])
  writeFileSync(join(OUT, `${name}.glb`), file)
  console.log(`${name}.glb  ${(file.length / 1024).toFixed(1)} KB`)
}

// ------------------------------------------------------------------ móveis

const T = 0.018 // espessura de chapa
const GAP = 0.003 // folga entre portas

// Fileira de portas/gavetas na face frontal (z) de um vão.
function fronts(box, mat, x, y, z, w, h, cols, rows = 1) {
  const cw = w / cols
  const rh = h / rows
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      box(mat, x + c * cw + GAP, y + r * rh + GAP, z, cw - 2 * GAP, rh - 2 * GAP, T)
    }
  }
}

function kitchen(box) {
  // Balcão inferior
  box('graphite', 0, 0, 0, 2.4, 0.1, 0.5)
  box('white', 0, 0.1, 0, 2.4, 0.72, 0.56)
  fronts(box, 'white', 0, 0.1, 0.56, 1.2, 0.7, 2)
  fronts(box, 'white', 1.2, 0.1, 0.56, 0.6, 0.7, 1, 3)
  fronts(box, 'white', 1.8, 0.1, 0.56, 0.6, 0.7, 1)
  box('black', 0, 0.8, 0.53, 2.4, 0.02, 0.05) // perfil gola
  box('stone', 0, 0.82, -0.01, 2.42, 0.04, 0.63)
  // Torneira
  box('black', 0.58, 0.86, 0.06, 0.025, 0.34, 0.025)
  box('black', 0.58, 1.18, 0.06, 0.025, 0.025, 0.2)
  // Aéreo
  box('white', 0, 1.45, 0, 2.4, 0.7, 0.35)
  fronts(box, 'oak', 0, 1.45, 0.35, 2.4, 0.7, 4)
  box('led', 0.02, 1.444, 0.2, 2.36, 0.006, 0.03)
  // Torre quente
  box('graphite', 2.4, 0, 0, 0.62, 0.1, 0.52)
  box('graphite', 2.42, 0.1, 0, 0.6, 2.05, 0.58)
  fronts(box, 'graphite', 2.42, 0.1, 0.58, 0.6, 0.8, 1, 2)
  box('black', 2.44, 0.95, 0.58, 0.56, 0.55, T) // forno
  box('metal', 2.5, 1.43, 0.6, 0.4, 0.015, 0.02)
  fronts(box, 'graphite', 2.42, 1.55, 0.58, 0.6, 0.6, 1)
  // Ilha com tampo em cascata
  box('graphite', 0.45, 0, 1.5, 1.7, 0.1, 0.7)
  box('white', 0.4, 0.1, 1.45, 1.8, 0.78, 0.82)
  fronts(box, 'white', 0.4, 0.1, 2.27, 1.8, 0.76, 3)
  box('stone', 0.34, 0.88, 1.4, 1.92, 0.04, 0.92)
  box('stone', 0.34, 0, 1.4, 0.04, 0.88, 0.92)
  box('stone', 2.22, 0, 1.4, 0.04, 0.88, 0.92)
}

function closet(box) {
  const W = 2.4
  const H = 2.5
  const D = 0.6
  box('graphite', 0, 0, 0.02, W, 0.08, D - 0.04)
  box('oak', 0, 0.08, 0, W, H - 0.08, 0.012) // fundo
  box('white', 0, 0.08, 0, T, H - 0.08, D)
  box('white', W - T, 0.08, 0, T, H - 0.08, D)
  box('white', 0, H - T, 0, W, T, D)
  box('white', 0, 0.08, 0, W, T, D)
  const col = W / 4
  for (let i = 1; i < 4; i++) box('white', i * col - T / 2, 0.08, 0, T, H - 0.1, D)

  const hang = (x, yRod, len, n) => {
    box('metal', x + 0.02, yRod, D / 2 - 0.01, col - 0.04, 0.02, 0.02)
    const tones = ['fabricA', 'fabricB', 'fabricC', 'fabricA', 'white', 'fabricB']
    for (let i = 0; i < n; i++) {
      box(tones[i % tones.length], x + 0.05 + i * ((col - 0.1) / n), yRod - len, 0.08, 0.025, len - 0.02, D - 0.16)
    }
  }
  // 1. cabideiro longo
  box('white', 0, 2.12, 0, col, T, D)
  box('led', 0.02, 2.11, 0.4, col - 0.04, 0.006, 0.02)
  hang(0, 2.02, 1.25, 9)
  // 2. prateleiras + gaveteiro
  for (const y of [1.25, 1.55, 1.85, 2.15]) box('oak', col, y, 0, col, T, D)
  fronts(box, 'white', col + T / 2, 0.1, D, col - T, 0.9, 1, 3)
  box('white', col, 1.0, 0, col, T, D)
  for (const y of [1.25, 1.55, 1.85]) {
    box('fabricA', col + 0.08, y + T, 0.12, 0.2, 0.08, 0.3)
    box('fabricC', col + 0.32, y + T, 0.12, 0.2, 0.12, 0.3)
  }
  // 3. cabideiro duplo
  box('white', 2 * col, 1.22, 0, col, T, D)
  hang(2 * col, 2.3, 1.0, 7)
  hang(2 * col, 1.15, 0.9, 6)
  // 4. porta fechada
  fronts(box, 'oak', 3 * col + T / 2, 0.1, D, col - T, H - 0.12, 1)
  box('black', 3 * col + 0.05, 0.9, D + T, 0.015, 0.7, 0.02)
}

function livingRoom(box) {
  // Painel ripado
  box('graphite', -1.4, 0, 0, 2.8, 2.5, 0.02)
  for (let x = -1.38; x < 1.38; x += 0.06) box('oak', x, 0, 0.02, 0.035, 2.5, 0.025)
  // Rack suspenso
  box('graphite', -1.2, 0.28, 0.045, 2.4, 0.34, 0.4)
  fronts(box, 'graphite', -1.2, 0.28, 0.445, 2.4, 0.34, 4)
  box('led', -1.18, 0.275, 0.3, 2.36, 0.006, 0.03)
  // TV
  box('black', -0.72, 1.05, 0.045, 1.44, 0.82, 0.04)
  // Estante lateral
  box('white', 1.5, 0, 0, T, 2.5, 0.35)
  box('white', 2.1 - T, 0, 0, T, 2.5, 0.35)
  for (const y of [0, 0.5, 1.0, 1.5, 2.0, 2.5 - T]) box('white', 1.5, y, 0, 0.6, T, 0.35)
  box('fabricB', 1.56, 0.5 + T, 0.08, 0.1, 0.3, 0.2)
  box('fabricA', 1.68, 0.5 + T, 0.08, 0.04, 0.26, 0.2)
  box('stone', 1.8, 1.0 + T, 0.1, 0.18, 0.28, 0.18)
  box('fabricC', 1.56, 1.5 + T, 0.1, 0.4, 0.06, 0.22)
  box('fabricA', 1.6, 1.56 + T, 0.1, 0.32, 0.05, 0.22)
  // Sofá baixo
  box('fabricA', -1.1, 0, 1.6, 2.2, 0.38, 0.95)
  box('fabricA', -1.1, 0.38, 2.3, 2.2, 0.4, 0.25)
  box('fabricB', -1.05, 0.38, 1.65, 1.05, 0.12, 0.62)
  box('fabricB', 0.0, 0.38, 1.65, 1.05, 0.12, 0.62)
  // Mesa de centro
  box('oak', -0.5, 0, 0.95, 1.0, 0.3, 0.45)
}

function office(box) {
  // Estante de parede
  for (const x of [-0.2, 0.4, 1.0, 1.6]) box('white', x, 1.05, -0.32, T, 1.3, 0.32)
  for (const y of [1.05, 1.5, 1.95, 2.35 - T]) box('oak', -0.2, y, -0.32, 1.8 + T, T, 0.32)
  fronts(box, 'white', 0.4 + T, 1.05, 0, 0.6 - T, 0.45, 1)
  fronts(box, 'graphite', 1.0 + T, 1.95, 0, 0.6 - T, 0.4, 1)
  const books = ['fabricC', 'fabricA', 'fabricB', 'white', 'fabricC', 'fabricA']
  books.forEach((m, i) => box(m, -0.15 + i * 0.045, 1.5 + T, -0.28, 0.035, 0.26 + (i % 3) * 0.03, 0.22))
  box('stone', 1.2, 1.05 + T, -0.24, 0.16, 0.22, 0.16)
  books.slice(0, 4).forEach((m, i) => box(m, 0.45 + i * 0.05, 1.95 + T, -0.28, 0.04, 0.28 - (i % 2) * 0.04, 0.22))
  // Mesa
  box('oak', 0, 0.72, 0.1, 1.6, 0.035, 0.7)
  box('graphite', 0, 0, 0.1, 0.03, 0.72, 0.7)
  box('white', 1.12, 0, 0.12, 0.48, 0.72, 0.64)
  fronts(box, 'white', 1.12, 0.02, 0.76, 0.48, 0.7, 1, 3)
  box('graphite', 1.1, 0, 0.12, 0.02, 0.72, 0.64)
  // Monitor e acessórios
  box('black', 0.5, 0.755, 0.2, 0.2, 0.01, 0.16)
  box('black', 0.585, 0.755, 0.24, 0.03, 0.18, 0.02)
  box('black', 0.25, 0.88, 0.22, 0.7, 0.4, 0.02)
  box('fabricB', 0.35, 0.755, 0.5, 0.42, 0.012, 0.14)
  // Cadeira
  box('graphite', 0.45, 0, 1.05, 0.5, 0.45, 0.5)
  box('graphite', 0.45, 0.45, 1.5, 0.5, 0.45, 0.05)
}

function heroModule(box) {
  // Estante modular: 3 colunas, alturas desencontradas, como a marca.
  const S = 0.46
  const layout = [
    // [coluna, linha, tipo]
    [0, 0, 'door-white'], [0, 1, 'open'],
    [1, 0, 'drawers'], [1, 1, 'open-object'], [1, 2, 'door-graphite'],
    [2, 0, 'open'], [2, 1, 'door-oak'], [2, 2, 'open-books'], [2, 3, 'open'],
  ]
  box('graphite', 0.04, 0, 0.04, 3 * S - 0.08, 0.08, S - 0.08)
  for (const [c, r, kind] of layout) {
    const x = c * S
    const y = 0.08 + r * S
    const shell = kind === 'open' ? 'graphite' : 'white'
    box(shell, x, y, 0, S, T, S)
    box(shell, x, y + S - T, 0, S, T, S)
    box(shell, x, y, 0, T, S, S)
    box(shell, x + S - T, y, 0, T, S, S)
    box('oak', x + T, y + T, 0, S - 2 * T, S - 2 * T, 0.01)
    if (kind === 'door-white') fronts(box, 'white', x, y, S, S, S, 1)
    if (kind === 'door-graphite') fronts(box, 'graphite', x, y, S, S, S, 1)
    if (kind === 'door-oak') fronts(box, 'oak', x, y, S, S, S, 1)
    if (kind === 'drawers') fronts(box, 'white', x, y, S, S, S, 1, 2)
    if (kind === 'open-object') {
      box('stone', x + 0.14, y + T, 0.14, 0.12, 0.26, 0.12)
      box('black', x + 0.29, y + T, 0.18, 0.06, 0.14, 0.06)
    }
    if (kind === 'open-books') {
      ;['fabricC', 'fabricA', 'fabricB', 'fabricA'].forEach((m, i) =>
        box(m, x + 0.06 + i * 0.05, y + T, 0.08, 0.04, 0.3 - (i % 2) * 0.05, 0.3),
      )
    }
  }
}

mkdirSync(OUT, { recursive: true })
writeGlb('hero', heroModule)
writeGlb('cozinha', kitchen)
writeGlb('closet', closet)
writeGlb('sala', livingRoom)
writeGlb('escritorio', office)
writeGlb('showcase', kitchen)
