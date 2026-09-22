# Handoff — Vello

Atualize este arquivo ao fim de cada sessão (Codex ou Claude).

## Última atualização

2026-09-21 — Claude Code. Landing refeita para estéticas em
`src/components/VelloLandingEstetica.tsx` (rota `/`), inspirada na estrutura e no
visual do abacatepay.com a pedido do usuário: moldura com linhas finas e faixas
hachuradas, hero com degradê azul e mockups (painel + celular), recursos,
“Quanto custa?”, divulgação, suíte, seção escura com calculadora de custo por
atendimento (R$ 65,90/mês), letreiro de categorias com as capas de
`public/service-covers`, suporte, dúvidas e CTA final. Sem depoimentos (não há
clientes reais ainda). Ilustrações da landing trocadas por réplicas fiéis das telas reais (Agenda,
página pública, BookingDialog, disponibilidade) em
`src/components/landing/AppScreens.tsx`, renderizadas em tamanho real e
reduzidas com `zoom` para ficarem nítidas; ao mudar essas telas no app,
atualizar as réplicas. Antes disso, capas de categoria e avatar viraram ícones e
mockups de interface, a pedido do usuário; só o bloco final usa ilustração
(`public/landing/vello-cta-final.webp`). `favicon.ico` real criado (antes caía
no rewrite e devolvia HTML). `VelloLandingMinimal.tsx` e `VelloLanding.tsx` (corretores)
ficaram sem uso. Novo token `sky-strong` (#4A86B3) para títulos grandes.

2026-09-21 — Codex. Início da aplicação dos princípios Apple na Vello:
material translúcido acessível, tipografia com sizing óptico e resposta tátil
mais clara nas ações; onboarding adotou a nova superfície e CTA com profundidade.
O atalho de serviço personalizado virou um cartão de expansão com ícone,
descrição e estado aberto/fechado.
Na identidade do onboarding, uma ilustração editorial simples de uma
profissional de estética virou a imagem-base quando nenhuma foto foi enviada;
ela substitui a mascote antiga e agora aparece em recorte circular. Após
escolher uma imagem, a profissional também pode removê-la e voltar ao estado
padrão sem excluir arquivos do storage. O placeholder usa fundo azul-claro;
fotos reais mantêm fundo neutro para não alterar a aparência da imagem enviada.
Serviços sem foto agora usam nove capas quadradas independentes, em vez de
recortes de um mosaico. Todas foram refeitas como cenas humanas cartunizadas e
minimalistas, seguindo a referência editorial azul da Vello, para facial,
corporal, depilação, sobrancelhas/cílios, unhas, cabelo, massagem,
harmonização e outros. Painel e catálogo público também passaram a reservar
área 1:1 para as imagens, evitando deformação visual.
O topo do catálogo público de serviços foi redesenhado como um cartão azul
compacto: avatar circular com aro claro, tipo da estética em selo, nome com
escala controlada, localização agrupada e bio separada por uma linha sutil.
O cabeçalho superior ficou mais leve e o botão de compartilhar ganhou resposta
tátil no toque.
O onboarding não apresenta mais a opção de desligar agendamentos online:
eles são parte fixa da Vello e são salvos sempre ativos. Permanece apenas a
escolha de confirmação automática ou manual dos pedidos.
O cabeçalho do onboarding não tem mais a saída antecipada “Sair e continuar
depois”. O progresso foi redesenhado como um percurso de quatro etapas com
nomes, etapa atual destacada e checks nas concluídas, preservando leitura boa
em celular.
A etapa de serviços do onboarding foi refinada com
revelação progressiva: sugestões são a escolha principal, mostram contagem
de itens selecionados e o formulário manual só abre por ação explícita.
Onboarding agora permite pré-selecionar vários serviços
sugeridos, que são criados publicados (sob consulta) e podem ser completados
no painel. O catálogo público passou a respeitar os dois estilos existentes:
Editorial (grade) e Lista (foto lateral e leitura rápida). A Agenda foi simplificada para priorizar decisões:
abre em “Para confirmar”, remove contadores redundantes, ordena os filtros
por ação e mostra somente ações permitidas para cada reserva. Serviços sem
foto agora recebem uma capa editorial automática conforme sua categoria,
no painel, na prévia e no catálogo público; fotos enviadas pela profissional
continuam tendo prioridade. A navegação de Perfil e Configurações foi simplificada
em duas telas únicas, sem abas: **Perfil** concentra identidade e todos os
dados visíveis na página pública; **Configurações** concentra disponibilidade,
regras de reserva e segurança. A rota antiga `/dashboard/perfil/pagina`
continua exibindo Perfil para não quebrar links existentes. O conteúdo e os
recursos foram preservados; foram removidas apenas camadas intermediárias de
navegação. A navegação interna da Agenda e do Perfil foi reconstruída
para reduzir densidade: a Agenda agora é exclusivamente operacional
(atendimentos, filtros e ações); Perfil separa identidade, página pública,
disponibilidade e segurança. Horários, regras de reserva e confirmação foram
movidos para Perfil → Disponibilidade. Em seguida, a Vello passou a tratar
agendamentos como sempre online: o editor de serviços não oferece mais essa
opção, e o catálogo público abre escolha de data, horário e reserva dentro da
plataforma, usando as RPCs públicas existentes. Etapa 2 iniciada/concluída parcialmente: tipos e funções
Em 2026-09-21, Perfil foi limitado a identidade e página pública; disponibilidade
e segurança foram movidas para `/dashboard/configuracoes`. A barra móvel agora
tem quatro destinos fixos (Início, Serviços, Agenda e Configurações) e o
botão central de novo serviço; os ícones laterais usam uma grade uniforme.
Catálogo continua acessível em Configurações, evitando sobrecarregar a barra.
O experimento de carrossel com scroll-snap foi removido em 2026-09-21 após
apresentar sobreposição visual. A barra móvel voltou à grade estável de quatro
atalhos alinhados e botão central de novo serviço.
Em seguida, Perfil foi separado em duas páginas simples: dados da estética em
`/dashboard/perfil` e conteúdo visível para clientes em
`/dashboard/perfil/pagina`, sem abas horizontais no celular. A distinção foi
reforçada em 2026-09-21: a barra móvel abre Perfil, que contém somente um
atalho para Configurações; Configurações não mostra mais conteúdo de perfil.
cliente para serviços/agenda, painel principal orientado a estéticas, telas de
serviços e agenda. Também foram ajustadas a tela de carregamento e a aba de
perfil: esta agora reúne identidade da estética, contato, endereço e controles
de visibilidade, sem campos de CRECI/imóveis. A Agenda foi reorganizada para
priorizar atendimentos, com resumo diário, filtros, histórico de 30 dias e
ações de status/WhatsApp. O catálogo do painel e a página pública pelo link
da estética agora exibem serviços, em vez de imóveis. Antes disso, Claude Code
iniciou a mudança da Vello de corretores para estéticas em 2026-09-18.

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
2. [x] Tipos em `src/lib/vello.ts` + painel inicial: serviços, horários de
   atendimento e agenda de agendamentos. Em 2026-09-20 foram adicionados tipos
   e helpers para `services`, `service_images`, `business_hours` e
   `appointments`; o dashboard passou a carregar esses dados; a navegação
   principal passou para Serviços/Agenda; foram criadas telas para listar,
   criar, editar e excluir serviços, salvar horários de atendimento e atualizar
   status de agendamentos. Ainda não há tela para bloqueios manuais de agenda
   (`schedule_blocks`) nem criação manual de agendamento pelo painel.
3. [x] Onboarding de estética: identidade, tipo de negócio, localização/link,
   primeiro serviço e horários/confirmacão de agenda. Em 2026-09-21, o fluxo
   antigo de CRECI/imóvel foi substituído e passou a persistir em `profiles`,
   `services` e `business_hours`. Falta o fluxo de agendamento público: a
   página pública agora oferece escolha de serviço, data/horário e reserva
   pelo próprio site. Falta realizar uma bateria de testes manuais autenticados
   e públicos antes de convidar clientes reais.
4. [ ] Landing, SEO, textos, Termos/Privacidade, imagem de compartilhamento
   (og) e uso do azul da marca em destaques. Em 2026-09-21 foram atualizados
   favicon, títulos/descrições, metadados Open Graph/Twitter e a imagem social
   `public/og-vello-estetica-social.png`; a revisão dos textos da landing e
   páginas legais ainda falta. (Logo e tokens de cor: feito.)
5. [ ] Migration de limpeza (remover imóveis/seleções e colunas CRECI),
   ajustar `get_admin_dashboard` e painel `/admin`.

Testar migrations localmente: script em scratchpad do Claude (não versionado)
sobe `postgres:17` com stubs de `auth`/`storage`/roles e aplica
`supabase/migrations/*.sql` em ordem. Docker Desktop precisa estar aberto.

## Próximo passo

1. Testar ponta a ponta o fluxo de agendamento público: horários, reserva,
   confirmação automática/manual e atualização na Agenda.
2. Etapa 4: landing, SEO, textos, Termos/Privacidade, imagem de
   compartilhamento e revisão dos textos antigos de corretores/imóveis.
3. Etapa 5: migration de limpeza para remover imóveis/seleções/CRECI depois
   que a troca estiver validada.

## Decisões

| Data | Decisão | Por quê |
|---|---|---|
| 2026-09-18 | Agentes commitam e fazem push direto na `main`, sem pedir | Usuário quer ver e testar cada etapa no site publicado |
| 2026-09-18 | Playwright roda só Chromium e contra produção | Foi o usado na revisão de 4/set; 3 navegadores triplicava o CI sem ganho |
| 2026-09-18 | `artifacts/` fora do git | ~794 MB de material de marketing |
| 2026-09-18 | Vello muda de corretores para estéticas | Decisão de produto do usuário |
| 2026-09-18 | Tabelas novas (`services` etc.) em vez de renomear `properties` | Produção continua funcionando até a troca; limpeza no fim |
| 2026-09-18 | Seleções removidas; uma agenda por conta na v1 | Agendamento substitui seleções; multiprofissional aumenta muito o escopo |
