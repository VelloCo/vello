-- Admin access is intentionally based on immutable app_metadata, never user_metadata.
-- Set { "vello_role": "admin" } for the chosen user from the Supabase dashboard
-- or a trusted server using the Auth Admin API, then ask that user to sign in again.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() -> 'app_metadata' ->> 'vello_role'), '') = 'admin';
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.get_admin_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'metrics', jsonb_build_object(
      'users', (select count(*) from public.profiles),
      'onboarded_users', (select count(*) from public.profiles where onboarding_completed),
      'properties', (select count(*) from public.properties),
      'published_properties', (select count(*) from public.properties where publication_status = 'published'),
      'active_selections', (select count(*) from public.selections where status = 'active'),
      'new_users_7d', (select count(*) from public.profiles where created_at >= now() - interval '7 days')
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
    'properties', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pr.id,
        'title', pr.title,
        'status', pr.status,
        'publication_status', pr.publication_status,
        'owner', coalesce(nullif(p.professional_name, ''), nullif(p.full_name, ''), 'Sem nome'),
        'created_at', pr.created_at
      ) order by pr.created_at desc)
      from (select * from public.properties order by created_at desc limit 8) pr
      join public.profiles p on p.user_id = pr.user_id
    ), '[]'::jsonb),
    'selections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id,
        'client_name', s.client_name,
        'status', s.status,
        'owner', coalesce(nullif(p.professional_name, ''), nullif(p.full_name, ''), 'Sem nome'),
        'created_at', s.created_at
      ) order by s.created_at desc)
      from (select * from public.selections order by created_at desc limit 8) s
      join public.profiles p on p.user_id = s.user_id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_admin_dashboard() from public;
grant execute on function public.get_admin_dashboard() to authenticated;
