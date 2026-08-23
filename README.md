# Vello — Landing Page

Landing page premium para a Vello, SaaS de catálogo digital para corretores de imóveis.

## Rodando localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

Os arquivos finais ficam em `dist/`.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- lucide-react (ícones)

## Pendências antes de publicar

1. **Logo/mascote oficial**: ainda não foi anexada ao pedido. O projeto usa
   um wordmark tipográfico "Vello" como placeholder no header, footer e CTA final,
   e um bloco de cor sólida marcado como placeholder na seção "Personalidade da marca".
   Procure por `MASCOTE` e `PLACEHOLDER` nos comentários em:
   - `src/components/Logo.tsx`
   - `src/components/BrandPersonality.tsx`
   - `src/components/FinalCTA.tsx`
2. **Preço**: o card de preços está com "R$ —" propositalmente, pronto para
   edição em `src/components/Pricing.tsx`.
3. **Imagens de imóveis**: usam fotos do Unsplash (arquitetura/interiores de
   alto padrão) como placeholders realistas. Troque por fotos reais dos
   imóveis quando disponíveis, em `src/data/properties.ts`.
4. **Rotas**: os CTAs apontam para `/cadastro` e `/login`, que ainda não
   existem — troque pelos links reais quando o produto estiver no ar.
