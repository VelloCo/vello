# Vello — instruções para agentes (Codex e Claude Code)

Este projeto é trabalhado alternadamente pelo Codex e pelo Claude Code.
Nenhum dos dois vê a conversa do outro: o que não estiver escrito aqui ou no
`HANDOFF.md` se perde.

## Ao começar uma sessão

1. Leia `HANDOFF.md` (estado atual, em andamento, próximos passos).
2. Leia `docs/GUIA-CONTINUIDADE.md` (produção, URLs, configurações a preservar).
3. Rode `git status` e `git log --oneline -10` para ver o que mudou desde o
   último registro.

## Ao terminar uma sessão

Atualize `HANDOFF.md`: o que foi feito, o que ficou pela metade, decisões
tomadas e o próximo passo concreto. Datas absolutas (ex.: 2026-09-18), não
"ontem".

## Projeto

- SaaS de catálogo digital para corretores de imóveis.
- React 19 + TypeScript + Vite + Tailwind v4, Supabase (auth, banco, storage),
  hospedado na Vercel. Repositório: VelloCo/vello (branch `main`).
- Produção: https://vellocorretores.vercel.app — merge em `main` publica.

## Regras

- Validar com `npm run build` e `npm run lint` antes de dizer que terminou.
- Há alterações locais antigas não commitadas (ver `git status`). Não fazer
  `git add -A` nem commitar tudo de uma vez; commitar só o que a tarefa tocou.
- Fluxo autorizado pelo usuário (2026-09-18): alterar localmente, commitar
  **direto na `main`** e fazer push sem pedir confirmação. Ele quer ver e
  testar cada etapa em produção. Cada push em `main` publica na Vercel, então
  só enviar o que passou em `npm run build` e `npm run lint`, e nunca deixar a
  produção quebrada entre commits (ex.: interface que depende de migration
  ainda não aplicada deve funcionar sem ela ou esperar a migration).
- O Supabase NÃO está ligado ao GitHub: migrations commitadas não são
  aplicadas sozinhas.
- Não reexecutar migrations do Supabase por tentativa; arquivo local não prova
  que foi aplicado em produção.
- Nunca colocar service_role key, senhas ou dados de clientes/leads no repo.
- Não atualizar dependências em massa nem usar `--force` sem revisar.
- Responder ao usuário em português.
