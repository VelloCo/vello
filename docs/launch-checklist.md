# Checklist de lançamento da Vello

## Pronto no código

- Landing page, páginas de Termos, Privacidade, Suporte e 404.
- Metadados para compartilhamento, sitemap, robots e manifest.
- Fluxo de cadastro, onboarding, imóveis, catálogo público e seleções.
- Painel administrativo em `/admin`, protegido por papel administrativo no Supabase.
- Integração opcional com Plausible para pageviews.

## Configuração de produção

1. No Supabase Auth, adicione as URLs de redirecionamento:
   - `https://velloco.github.io/vello/onboarding`
   - a futura URL do domínio próprio, com `/onboarding`.
2. Configure e teste confirmação de e-mail, recuperação de senha e Google OAuth.
3. Dê acesso ao administrador pelo Supabase Dashboard, em Authentication > Users > App metadata:
   ```json
   { "vello_role": "admin" }
   ```
   A conta precisa sair e entrar novamente após a alteração.
4. Defina `VITE_SUPPORT_EMAIL` e, se desejar métricas, `VITE_PLAUSIBLE_DOMAIN` nos segredos do GitHub Pages.
5. Execute a migration `20260831035701_admin_launch_foundation.sql` no projeto Supabase antes de acessar `/admin`.
6. Faça um teste completo: cadastro, e-mail, onboarding, upload, publicação, catálogo público, WhatsApp e seleção.

## Antes de cobrar

- Definir plano, preço, período de teste e política de cancelamento.
- Integrar um provedor de pagamento e controlar acesso por assinatura.
- Configurar domínio próprio e e-mail transacional com SMTP próprio.
