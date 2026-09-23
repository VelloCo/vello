-- Conta criada por convite antigo pode ter entrado uma vez sem nunca definir
-- senha. Nesse caso ela ainda é "pendente": pode receber um convite novo e
-- terminar o cadastro escolhendo a senha.
create or replace function public.beta_user_status(p_email text)
returns text
language sql
stable
security definer
set search_path to ''
as $function$
  select case
    when u.id is null then 'none'
    when coalesce(u.encrypted_password, '') = '' then 'pending'
    when u.last_sign_in_at is null then 'pending'
    else 'active'
  end
  from (select 1) s
  left join auth.users u on lower(u.email) = lower(p_email)
  limit 1;
$function$;

revoke execute on function public.beta_user_status(text) from public, anon, authenticated;
