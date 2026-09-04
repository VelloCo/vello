# Vello: guia para continuar sozinho

Atualizado em 4 de setembro de 2026. Este guia substitui as instruções antigas de hospedagem do checklist.

A Vello continua na Vercel com dados e contas no Supabase. Sua assinatura do assistente não é necessária para o site continuar funcionando; mantenha acesso às contas e acompanhe os limites desses serviços.

## Links para guardar

- Site: https://vellocorretores.vercel.app/
- Cadastro: https://vellocorretores.vercel.app/cadastro
- Painel: https://vellocorretores.vercel.app/dashboard
- Suporte: https://vellocorretores.vercel.app/suporte
- Administração: https://vellocorretores.vercel.app/admin (exige papel administrativo)
- Código: https://github.com/VelloCo/vello
- Hospedagem: https://vercel.com/dashboard
- Contas, banco e imagens: https://supabase.com/dashboard
- Busca: https://search.google.com/search-console
- Visitas: https://analytics.google.com/

## Seus próximos sete dias

1. Convide de três a cinco corretores para um teste acompanhado.
2. Ajude cada um a cadastrar três imóveis reais, com autorização para divulgar as fotos.
3. Peça para abrir o catálogo no celular e compartilhar com um cliente.
4. No segundo dia, pergunte onde travou e se conseguiu compartilhar.
5. No quinto dia, pergunte o que usou e o que faltou.
6. No sétimo dia, converse sobre continuidade. Registre o combinado antes de cobrar.

Convite sugerido:

> Oi, [nome]! Estou abrindo um teste acompanhado da Vello para organizar seus imóveis e compartilhar um catálogo com sua identidade. Você pode testar gratuitamente por sete dias. Posso te ajudar a cadastrar os primeiros imóveis e ouvir seu feedback?

Use uma planilha privada com: nome, contato, início e fim do teste, primeiro imóvel publicado, catálogo compartilhado, problema e próximo contato. Não registre senhas. O preço anunciado é R$ 65,90/mês com a primeira semana gratuita. A oferta na página não ativa cobrança nem bloqueio automático: pagamentos e assinaturas ainda precisam de validação e implementação próprias.

## Antes de convidar a turma

- [ ] Testar cadastro com um e-mail que você controla e confirmar o e-mail.
- [ ] Completar onboarding, WhatsApp e CRECI.
- [ ] Publicar um imóvel de teste com foto, preço e localização corretos.
- [ ] Abrir o catálogo sem login em outro navegador; conferir fotos e contato.
- [ ] Criar e abrir uma seleção compartilhada.
- [ ] Editar e excluir somente o imóvel de teste; conferir no catálogo.
- [ ] Testar recuperação de senha e Google login.
- [ ] Confirmar que recebe e-mails do canal indicado em /suporte.

## Configurações a preservar

- Supabase Site URL: https://vellocorretores.vercel.app
- Redirect URLs: https://vellocorretores.vercel.app/onboarding e https://vellocorretores.vercel.app/redefinir-senha
- Google OAuth: conservar o callback copiado do provedor Google no Supabase.
- Search Console: manter public/googleab7018c5a6040950.html. Sitemap: https://vellocorretores.vercel.app/sitemap.xml
- Google Analytics: G-X51JZE369J. Conferir recebimento em Tempo real.
- Suporte: VITE_SUPPORT_EMAIL na Vercel; o fallback do código é vellocorretores@gmail.com. Confirme que você controla essa caixa.

## Rotina diária de quinze minutos

Leia suporte, abra site e catálogo no celular, acompanhe os convidados e confira alertas de consumo da Vercel e Supabase. Registre cada erro com página, horário, dispositivo, passos e resultado esperado. Peça prints sem senhas ou códigos de login.

## Resolver os problemas mais comuns

| Problema | O que fazer |
| --- | --- |
| Site falhou após atualização | Abra projeto → Deployments na Vercel e leia o log. Use Rollback para um deploy que funcionava se necessário. Isso não desfaz alterações no banco. |
| Login não funciona | Confira o erro, e-mail e recuperação de senha; confira status e URLs do Supabase. Não apague contas por tentativa. |
| E-mail não chega | Confira spam e endereço digitado. Verifique limites de envio no Supabase e evite reenvios repetidos. |
| Foto não aparece | Teste um JPG pequeno, confira término do upload e abra o catálogo sem login. Não libere tabelas ou buckets por tentativa. |
| Analytics vazio | Navegue sem bloqueador e confira Tempo real. Use https://tagassistant.google.com/ para diagnóstico. |
| Google não encontra | Veja Sitemaps e Inspeção de URL no Search Console. A indexação não é imediata nem garantida. |
| Tela de erro na Vello | Recarregue uma vez. Se persistir, registre URL e horário; confira se começou após um deploy. |

## Alterar e publicar com cuidado

Pasta usada nesta revisão: VELLO/deploy-staging-20260822. Há alterações locais antigas não publicadas; não envie todos os arquivos de uma vez.

1. Crie uma branch no GitHub e edite somente o necessário.
2. Abra um pull request e espere o preview da Vercel.
3. Teste no celular e computador antes de fazer merge.
4. O merge em main aciona a publicação pela integração atual.
5. Aguarde Ready na Vercel e confira o endereço principal.

Validação local, dentro da pasta do projeto:

```powershell
npm run build
npm run lint
```

Não atualize todas as dependências apenas por um aviso de versão nova. Não use correções automáticas com --force sem revisar as mudanças.

## Cópias e recuperação

- Guarde acesso e recuperação de GitHub, Vercel, Supabase e Google num gerenciador de senhas.
- Confira quais backups sua conta Supabase possui e como restaurar. Guarde imagens e informações importantes separadamente: GitHub não é backup do banco ou das fotos.
- Não coloque dados de clientes, backups, senhas ou Secret/service_role keys no repositório.
- Não execute migrations antigas novamente por tentativa. Arquivo local não comprova aplicação no banco de produção.
- Antes de ampliar convites, confira entregabilidade e limites dos e-mails transacionais.

## Quando retomar ajuda técnica

Envie este guia, URL, erro exato e último deploy que funcionou. A arquitetura é React + Vite, Vercel e Supabase; repositório VelloCo/vello. Peça para preservar alterações locais e verificar produção antes de afirmar que algo está resolvido.

Esta revisão não certifica cobrança, isolamento entre contas no banco, recuperação de backups ou todos os fluxos autenticados. Faça o teste completo acima antes de ampliar o grupo.

## Resultado da revisão de 4 de setembro

- Commit de código: 63bbb88; tela de recuperação e correção da fila do Analytics confirmadas no JavaScript servido pela produção.
- Build aprovado; lint sem erros, com oito avisos existentes. Há aviso de bundle maior que 500 kB.
- Cinco testes Chromium passaram em produção: landing, links de autenticação, redirecionamento das rotas privadas sem sessão, catálogo inexistente e largura móvel de 390 px.
- npm audit --omit=dev: nenhuma vulnerabilidade conhecida encontrada nas dependências de produção instaladas. Isso não equivale a auditoria completa de segurança.
- Analytics: script carregou, fila no formato oficial e solicitação /g/collect observada. A solicitação terminou com net::ERR_ABORTED no navegador de teste; recebimento nos relatórios ainda precisa ser confirmado no Google Analytics → Tempo real. Não considere essa pendência resolvida somente porque a tag aparece.
- Ajustes de Analytics também evitam pageviews consecutivos duplicados e removem query/hash do page_location enviado manualmente.
