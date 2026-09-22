-- Restaura o payload administrativo sem dados pessoais das clientes finais.
-- Esta migration corrige a definição aplicada durante a auditoria de
-- atomicidade e mantém a política da migration administrativa original.
create or replace function public.get_admin_dashboard()
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

  return jsonb_build_object(
    'metrics', jsonb_build_object(
      'users', (select count(*) from public.profiles),
      'onboarded_users', (select count(*) from public.profiles where onboarding_completed),
      'new_users_7d', (select count(*) from public.profiles where created_at >= now() - interval '7 days'),
      'services', (select count(*) from public.services),
      'published_services', (select count(*) from public.services where publication_status = 'published'),
      'appointments_30d', (select count(*) from public.appointments where created_at >= now() - interval '30 days'),
      'online_appointments_30d', (select count(*) from public.appointments where source = 'online' and created_at >= now() - interval '30 days')
    ),
    'users', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.user_id,
        'name', coalesce(nullif(p.professional_name, ''), nullif(p.full_name, ''), 'Sem nome'),
        'slug', p.slug,
        'city', p.city,
        'state', p.state,
        'onboarding_completed', p.onboarding_completed,
        'created_at', p.created_at
      ) order by p.created_at desc)
      from (select * from public.profiles order by created_at desc limit 8) p
    ), '[]'::jsonb),
    'services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'title', s.title,
        'category', s.category,
        'publication_status', s.publication_status,
        'owner', coalesce(nullif(p.professional_name, ''), nullif(p.full_name, ''), 'Sem nome'),
        'created_at', s.created_at
      ) order by s.created_at desc)
      from (select * from public.services order by created_at desc limit 8) s
      join public.profiles p on p.user_id = s.user_id
    ), '[]'::jsonb),
    'appointments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'service_title', a.service_title,
        'status', a.status,
        'source', a.source,
        'owner', coalesce(nullif(p.professional_name, ''), nullif(p.full_name, ''), 'Sem nome'),
        'starts_at', a.starts_at,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.appointments order by created_at desc limit 8) a
      join public.profiles p on p.user_id = a.user_id
    ), '[]'::jsonb)
  );
end;
$function$;

revoke execute on function public.get_admin_dashboard() from public, anon;
grant execute on function public.get_admin_dashboard() to authenticated;
