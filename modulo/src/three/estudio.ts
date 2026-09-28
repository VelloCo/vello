// Cores do estúdio 3D. Sem three.js: pode ser importado pela página sem
// puxar o motor para o bundle principal.
export interface Estudio {
  /** Cor de fundo e da névoa do horizonte. */
  fundo: number;
  /** Cor do piso infinito. */
  chao: number;
  /** Fundo transparente: a página aparece atrás do modelo (o piso some na névoa). */
  transparente?: boolean;
}
/** Estúdio claro (padrão) e escuro (seções pretas da página). */
export const ESTUDIO_CLARO: Estudio = { fundo: 0xf4f4f2, chao: 0xc9c8c4 };
/** Estúdio branco: some no fundo da página (hero). */
export const ESTUDIO_BRANCO: Estudio = { fundo: 0xffffff, chao: 0xe2e1de, transparente: true };
export const ESTUDIO_ESCURO: Estudio = { fundo: 0x0b0b0b, chao: 0x1d1d1c };
