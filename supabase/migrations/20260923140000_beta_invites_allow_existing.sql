-- O convite antigo do Supabase já criava a conta com uma senha aleatória, e
-- não dá para saber se a profissional chegou a escolher uma. Quando o e-mail
-- já tem conta, o admin pode gerar o convite assim mesmo: ao aceitar, a
-- profissional define a senha da conta existente.
alter table public.beta_invites
  add column if not exists allow_existing boolean not null default false;
