# Handoff — Vello

Atualize este arquivo ao fim de cada sessão (Codex ou Claude).

## Última atualização

2026-09-18 — Claude Code. Pendências locais organizadas na branch
`chore/organizar-pendencias-locais` (PR aberto, aguardando merge).

## Estado atual

- Produção no ar em https://vellocorretores.vercel.app. Último commit: `6c76738`
  (verificação de produção documentada). Detalhes em `docs/GUIA-CONTINUIDADE.md`.
- Pronto: landing, cadastro, onboarding, imóveis, catálogo público, seleções,
  painel admin, Termos/Privacidade/Suporte/404, SEO, Google Analytics.
- Em 2026-09-18 foram commitados na branch `chore/organizar-pendencias-locais`:
  Playwright (só Chromium, testes contra produção, workflow no CI), a migration
  `20260902050303_restrict_admin_function_execution.sql`, estes arquivos de
  handoff e o `.gitignore` (ignora `artifacts/` e `supabase/.temp/`).
- Ainda locais e sem commit, aguardando decisão do usuário:
  `public/favicon.png` (novo, 138 kB — reduzir antes de commitar),
  `public/landing/vello-feature-phones-real-pages-cutout.png` (não referenciada
  no código) e `scripts/render-instagram-launch-kit*.mjs`.
- `artifacts/` (~794 MB de material do Instagram) fica só local, ignorada.

## Fora do repositório

Em `VELLO/` (pasta pai, sem git) há o trabalho de prospecção: scripts
`build_corretor_leads.mjs`, `build_leads_workbook.mjs`, checkpoints `.tsv` e
`outreach_progress.json` (93 contatos enviados até 2026-09-07). Contém dados
pessoais de leads: não copiar para o repositório.

## Pendências conhecidas

- Confirmar recebimento do Analytics em Tempo real (GA4 `G-X51JZE369J`).
- Teste completo dos fluxos autenticados (checklist em GUIA-CONTINUIDADE).
- Cobrança/assinatura não implementada (preço anunciado R$ 65,90/mês, 7 dias grátis).
- Domínio próprio e SMTP próprio.
- Aviso de bundle > 500 kB; 8 avisos de lint.
- Conferir no Supabase (produção) se a migration `20260902050303` já foi
  aplicada: `anon` não deve ter EXECUTE em `is_admin()` e
  `get_admin_dashboard()`. Não reaplicar por tentativa.

## Em andamento

PR da branch `chore/organizar-pendencias-locais` → `main`. Falta o usuário
aprovar o merge (merge publica em produção). Não há mudança de código do app.

## Próximo passo

1. Usuário aprovar o merge do PR.
2. Conferir a migration de admin em produção (ver pendências).
3. Descobrir em que o Codex estava trabalhando por último (não registrado).

## Decisões

| Data | Decisão | Por quê |
|---|---|---|
| 2026-09-18 | Agentes trabalham local, commitam em branch, fazem push e abrem PR sem pedir; merge em `main` só com ok do usuário | Usuário não quer autorizar cada push; merge publica em produção |
| 2026-09-18 | Playwright roda só Chromium e contra produção | Foi o usado na revisão de 4/set; 3 navegadores triplicava o CI sem ganho |
| 2026-09-18 | `artifacts/` fora do git | ~794 MB de material de marketing |
