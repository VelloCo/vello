# Checklist de lançamento da Vello

Atualização de 4 de setembro de 2026: consulte [GUIA-CONTINUIDADE.md](GUIA-CONTINUIDADE.md) para operação, testes, backups e solução de problemas.

## Pronto no código

- Convites individuais de beta no painel administrativo, com link temporário
  do Supabase e definição de senha pela própria profissional.
- Landing page, páginas de Termos, Privacidade, Suporte e 404.
- Metadados para compartilhamento, sitemap, robots e manifest.
- Fluxo de convite, onboarding, serviços, catálogo público e agendamentos.
- Painel administrativo em `/admin`, protegido por papel administrativo no Supabase.
- Integração opcional com Plausible para pageviews.

## Configuração de produção

1. No Supabase Auth, adicione as URLs de redirecionamento:
   - `https://velloesteticas.vercel.app/onboarding`
   - `https://velloesteticas.vercel.app/redefinir-senha`
2. Configure e teste convite, recuperação de senha e confirmação de e-mail.
3. Dê acesso ao administrador pelo Supabase Dashboard, em Authentication > Users > App metadata:
   ```json
   { "vello_role": "admin" }
   ```
   A conta precisa sair e entrar novamente após a alteração.
4. Confira `VITE_SUPPORT_EMAIL` nas variáveis de ambiente da Vercel. O Google Analytics usa o ID `G-X51JZE369J`.
5. Confira se a configuração administrativa já foi aplicada ao Supabase antes de usar `/admin`. Não reexecute migrations por tentativa.
6. Faça um teste completo: gerar convite no admin, aceitar o link, definir
   senha, concluir onboarding, publicar serviço e realizar um agendamento.

## Antes de cobrar

- Definir plano, preço, período de teste e política de cancelamento.
- Integrar um provedor de pagamento e controlar acesso por assinatura.
- Configurar domínio próprio e e-mail transacional com SMTP próprio.
