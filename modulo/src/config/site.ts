// Conteúdo editável da página. Troque aqui contatos, modelos 3D e projetos
// sem precisar mexer nos componentes.

// ------------------------------------------------------------------ contatos
// TODO: substituir pelos contatos reais da Módulo.
export const CONTACT = {
  whatsapp: 'https://wa.me/5500000000000?text=Ol%C3%A1%2C%20quero%20falar%20com%20a%20M%C3%B3dulo.',
  instagram: 'https://instagram.com/modulo',
  email: 'contato@modulo.com.br',
}

// --------------------------------------------------------------- modelos 3D
// Os arquivos ficam em public/models/. Para trocar um modelo, sobrescreva o
// .glb com o mesmo nome ou aponte o caminho abaixo para o seu arquivo.
// Formatos aceitos: .glb (recomendado) ou .gltf.

/** Prefixa o caminho com a base do deploy (funciona fora da raiz do domínio). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

// Ambientes (cozinha, closet, sala) têm paredes no fundo e à esquerda: o giro
// fica limitado para ninguém ver o móvel por trás da parede.
const ROOM = { orbit: '35deg 65deg auto', min: '-5deg 25deg auto', max: '95deg 85deg auto' }

/** Reserva do <model-viewer> (aba Casa): o próprio arquivo. */
export const SHOWCASE_FALLBACK = asset('/models/casa.glb')

/** Botões da seção "Seu projeto. De todos os ângulos." — um por modelo. */
export const SHOWCASE_MODELS = [
  // Cozinha, closet e sala usam o motor próprio (Ambiente3D): pontos de
  // informação, portas/gavetas animadas. Casa segue no <model-viewer>.
  { id: 'cozinha', label: 'Cozinha', tamanho: '3 MB', src: asset('/models/cozinha.glb'), ...ROOM, autoRotate: false },
  { id: 'closet', label: 'Closet', tamanho: '3,6 MB', src: asset('/models/closet.glb'), ...ROOM, autoRotate: false },
  { id: 'sala', label: 'Sala', tamanho: '3 MB', src: asset('/models/sala.glb'), ...ROOM, autoRotate: false },
  { id: 'casa', label: 'Casa', tamanho: '11 MB', src: asset('/models/casa.glb'), orbit: '35deg 62deg auto', min: 'auto 15deg auto', max: 'auto 85deg auto', autoRotate: true },
] as const

// ---------------------------------------------------------------- portfólio
// `layout` escolhe a ilustração provisória do site. Quando houver prints
// reais, preencha `image` (ex.: '/projetos/pap.jpg' em public/projetos/) e a
// imagem substitui a ilustração.
export type Project = {
  client: string
  category: string
  year: string
  href: string
  layout: 'split' | 'fullbleed' | 'gallery' | 'editorial'
  image?: string
}

// TODO: substituir pelos projetos reais (os nomes abaixo são exemplos).
export const PROJECTS: Project[] = [
  { client: 'Planejados PAP', category: 'Website', year: '2026', href: '#', layout: 'fullbleed' },
  { client: 'Atelier Marcenaria', category: 'Landing Page', year: '2026', href: '#', layout: 'split' },
  { client: 'Linea Planejados', category: 'Experiência 3D', year: '2026', href: '#', layout: 'gallery' },
  { client: 'Casa Nord Móveis', category: 'Posicionamento digital', year: '2025', href: '#', layout: 'editorial' },
]

export const NAV = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Projetos', href: '#projetos' },
  { label: '3D', href: '#3d' },
  { label: 'Sobre', href: '#sobre' },
]
