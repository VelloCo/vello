# Handoff — Vello

Atualize este arquivo ao fim de cada sessão (Codex ou Claude).

## Última atualização

2026-09-18 — Claude Code. Início da mudança da Vello de corretores para
estéticas (branch `feat/vello-estetica`, etapa 1 de 5 feita). Antes disso,
pendências locais organizadas no PR #1 (`chore/organizar-pendencias-locais`).

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
- Migration de admin `20260902050303` confirmada em produção em 2026-09-18
  (`anon` sem EXECUTE em `is_admin`/`get_admin_dashboard`).
- Workflow `deploy-pages.yml` (GitHub Pages) falha a cada push em `main`
  desde antes de 2026-09-18. O site real é a Vercel; avaliar remover o workflow.
- Supabase pausa sozinho no plano gratuito após ~7 dias sem uso. Em
  2026-09-18 o projeto `vello` (scqlyropbykktnzlsdwh) estava INACTIVE (site
  sem login/catálogo); foi reativado pelo conector do Supabase e voltou em
  ~4 min. Plano gratuito: máx. 2 projetos ativos (o outro é "Lembrancinha").
- Conector Supabase do claude.ai está autorizado (2026-09-18). A tabela
  `supabase_migrations.schema_migrations` está vazia: as migrations antigas
  foram aplicadas por fora do histórico; conferir o banco, não a lista.

## Em andamento

### Mudança para estéticas (decidida em 2026-09-18)

A Vello deixa de ser para corretores e passa a ser para **estéticas**
(autônomas e clínicas). Marca continua **Vello**; Instagram `@velloestetica`;
logo e cores vão mudar (usuário vai enviar). Contas atuais em produção são só
de teste: podem ser descartadas.

Marca (recebida em 2026-09-18, aplicada no commit de marca da branch):
- Logo: símbolo "V" em folhas azuis. Original em
  `design/brand/vello-logo-original.png`; `scripts/build-brand-assets.py`
  gera `public/vello-logo.png`, `favicon.png`, `apple-touch-icon.png`,
  `icon-512.png` (remove só o branco externo, preserva vincos internos).
- Paleta do usuário: **#7EAFD0** e **#FFFFFF** (ele escreveu "#7EAFDO";
  interpretado como D0). Tokens em `src/index.css`: `sky` #7EAFD0,
  `sky-deep` #3A739C (links, contraste 5,1), `sky-soft` #E8F1F8; neutros
  quentes trocados por azulados (`ink` #12283A para texto e botões, pois o
  azul claro sobre branco tem só 2,35:1).

Produto:
- Catálogo público de **serviços** (categoria, preço fixo / "a partir de" /
  sob consulta, duração, fotos) no lugar de imóveis.
- **Agendamento pelo próprio site**: a cliente escolhe serviço, dia e horário
  livre, informa nome e WhatsApp, sem login. A profissional vê e gerencia os
  horários no painel dela (`/dashboard`). Confirmação automática ou manual
  (configurável).
- **Antes e depois** opcional, liberado só após aceitar termo de
  responsabilidade (`profiles.before_after_terms_accepted_at`).
- Sem registro profissional (CRECI sai, nada entra no lugar).
- **Seleções saem** (o agendamento substitui).
- Primeira versão: **uma agenda por conta**. Várias profissionais por clínica
  fica para depois.

Etapas (trabalho direto na `main` desde 2026-09-18; a branch
`feat/vello-estetica` foi incorporada):
1. [x] Banco: `supabase/migrations/20260918120000_estetica_foundation.sql`
   (aditiva; não toca imóveis/seleções). Tabelas `services`, `service_images`,
   `service_results`, `business_hours`, `schedule_blocks`, `appointments`
   (exclusion constraint impede sobreposição); funções públicas
   `get_public_page`, `get_available_slots`, `book_appointment`; bucket
   `service-images`. Testada num Postgres local (Docker) com 20 cenários.
   **Aplicada em produção em 2026-09-18** pelo conector Supabase
   (`apply_migration`, nome `estetica_foundation`), após o usuário liberar a
   permissão. Conferido: tabelas com RLS, funções públicas, constraint
   anti-sobreposição, bucket; chamadas anônimas pela API respondem como
   esperado e `appointments` não vaza para anon.
   Advisor de segurança: avisos "SECURITY DEFINER executável por anon" em
   `get_public_page`, `get_available_slots`, `book_appointment` são
   intencionais (página pública e agendamento sem login; mesmo padrão de
   `get_catalog`). Pendente: "Leaked password protection" desligado no Auth.
2. [ ] Tipos em `src/lib/vello.ts` + painel: serviços, horários de
   atendimento, bloqueios e agenda de agendamentos.
3. [ ] Onboarding (tipo de negócio, endereço, primeiro serviço, horários) e
   página pública com fluxo de agendamento.
4. [ ] Landing, SEO, textos, Termos/Privacidade, imagem de compartilhamento
   (og) e uso do azul da marca em destaques. (Logo e tokens de cor: feito.)
5. [ ] Migration de limpeza (remover imóveis/seleções e colunas CRECI),
   ajustar `get_admin_dashboard` e painel `/admin`.

Testar migrations localmente: script em scratchpad do Claude (não versionado)
sobe `postgres:17` com stubs de `auth`/`storage`/roles e aplica
`supabase/migrations/*.sql` em ordem. Docker Desktop precisa estar aberto.

## Próximo passo

1. Etapa 2 da mudança para estéticas (tipos + painel). O banco já está
   pronto em produção.
4. Aplicar a migration de estética em produção só junto com o deploy da
   interface nova, com o usuário.

## Decisões

| Data | Decisão | Por quê |
|---|---|---|
| 2026-09-18 | Agentes commitam e fazem push direto na `main`, sem pedir | Usuário quer ver e testar cada etapa no site publicado |
| 2026-09-18 | Playwright roda só Chromium e contra produção | Foi o usado na revisão de 4/set; 3 navegadores triplicava o CI sem ganho |
| 2026-09-18 | `artifacts/` fora do git | ~794 MB de material de marketing |
| 2026-09-18 | Vello muda de corretores para estéticas | Decisão de produto do usuário |
| 2026-09-18 | Tabelas novas (`services` etc.) em vez de renomear `properties` | Produção continua funcionando até a troca; limpeza no fim |
| 2026-09-18 | Seleções removidas; uma agenda por conta na v1 | Agendamento substitui seleções; multiprofissional aumenta muito o escopo |
