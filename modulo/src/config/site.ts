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

/** Modelo grande do hero (lado direito, logo na abertura). */
export const HERO_MODEL = '/models/hero.glb'

/** Usado na seção 3D quando um dos modelos abaixo não carrega. */
export const SHOWCASE_FALLBACK = '/models/showcase.glb'

/** Botões da seção "Seu projeto. De todos os ângulos." — um por modelo. */
export const SHOWCASE_MODELS = [
  { id: 'cozinha', label: 'Cozinha', src: '/models/cozinha.glb', orbit: '-28deg 72deg auto' },
  { id: 'closet', label: 'Closet', src: '/models/closet.glb', orbit: '-22deg 80deg auto' },
  { id: 'sala', label: 'Sala', src: '/models/sala.glb', orbit: '-30deg 70deg auto' },
  { id: 'escritorio', label: 'Escritório', src: '/models/escritorio.glb', orbit: '-35deg 72deg auto' },
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
