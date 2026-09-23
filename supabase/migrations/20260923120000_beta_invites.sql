-- Convites próprios do beta fechado.
-- O convite do Supabase criava a conta na hora (impedindo reconvidar o mesmo
-- e-mail), expirava em 1 hora e era consumido pela pré-visualização de links
-- do WhatsApp. Aqui o convite é só um código com validade; a conta nasce
-- quando a profissional escolhe a senha.
create table if not exists public.beta_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null default '',
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  attempts smallint not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  constraint beta_invites_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

create index if not exists beta_invites_email_idx on public.beta_invites (lower(email));
create index if not exists beta_invites_created_idx on public.beta_invites (created_at desc);

-- Sem políticas: nem anon nem authenticated acessam a tabela direto.
-- As funções de borda usam a service_role e o admin lê pelas RPCs abaixo.
alter table public.beta_invites enable row level security;

-- Situação do e-mail antes de convidar: sem conta, conta criada mas nunca
-- usada, ou conta ativa.
create or replace function public.beta_user_status(p_email text)
returns text
language sql
stable
security definer
set search_path to ''
as $function$
  select case
    when u.id is null then 'none'
    when u.last_sign_in_at is null then 'pending'
    else 'active'
  end
  from (select 1) s
  left join auth.users u on lower(u.email) = lower(p_email)
  limit 1;
$function$;

create or replace function public.list_beta_invites()
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $function$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id,
      'email', i.email,
      'name', i.name,
      'created_at', i.created_at,
      'expires_at', i.expires_at,
      'used_at', i.used_at,
      'revoked_at', i.revoked_at,
      'status', case
        when i.used_at is not null then 'aceito'
        when i.revoked_at is not null then 'cancelado'
        when i.expires_at < now() then 'expirado'
        else 'pendente'
      end
    ) order by i.created_at desc)
    from (select * from public.beta_invites order by created_at desc limit 50) i
  ), '[]'::jsonb);
end;
$function$;

create or replace function public.revoke_beta_invite(p_id uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  update public.beta_invites
  set revoked_at = now()
  where id = p_id and used_at is null and revoked_at is null;
end;
$function$;

revoke execute on function public.beta_user_status(text) from public, anon, authenticated;
revoke execute on function public.list_beta_invites() from public, anon;
revoke execute on function public.revoke_beta_invite(uuid) from public, anon;
grant execute on function public.list_beta_invites() to authenticated;
grant execute on function public.revoke_beta_invite(uuid) to authenticated;
