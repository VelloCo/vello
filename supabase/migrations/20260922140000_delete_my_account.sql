-- LGPD (art. 18, VI): a profissional pode excluir a própria conta pelo painel.
-- Apaga apenas o usuário autenticado; perfil, serviços, horários e
-- agendamentos saem em cascata. As fotos no Storage são removidas pelo app
-- antes desta chamada (as políticas de Storage só permitem ao dono).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path to ''
as $function$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Authentication required';
  end if;
  delete from auth.users where id = uid;
end;
$function$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
