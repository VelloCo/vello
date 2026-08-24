alter table public.profiles
  add column if not exists catalog_theme jsonb not null default '{"palette":"warm","property_style":"editorial","profile_band":"light"}'::jsonb;

alter table public.profiles
  drop constraint if exists profiles_catalog_theme_valid;

alter table public.profiles
  add constraint profiles_catalog_theme_valid check (
    jsonb_typeof(catalog_theme) = 'object'
    and catalog_theme->>'palette' in ('warm', 'paper', 'charcoal')
    and catalog_theme->>'property_style' in ('editorial', 'classic', 'compact')
    and catalog_theme->>'profile_band' in ('light', 'contrast', 'dark')
  );

create or replace function public.get_catalog(catalog_slug text)
 returns jsonb
 language sql
 stable
 security definer
 set search_path = ''
as $function$
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'professional_name', p.professional_name, 'avatar_url', p.avatar_url,
      'creci', case when p.show_creci then p.creci else null end,
      'whatsapp', p.whatsapp, 'city', p.city, 'state', p.state,
      'instagram', case when p.show_instagram then p.instagram else null end,
      'slug', p.slug, 'bio', p.bio, 'catalog_theme', p.catalog_theme
    ),
    'properties', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pr.id, 'slug', coalesce(pr.slug, pr.id::text), 'title', pr.title,
        'description', pr.description, 'transaction_type', pr.transaction_type,
        'property_type', pr.property_type, 'price', pr.price, 'city', pr.city,
        'neighborhood', pr.neighborhood, 'address', case when pr.show_full_address then pr.address else null end,
        'bedrooms', pr.bedrooms, 'suites', pr.suites, 'bathrooms', pr.bathrooms,
        'parking_spaces', pr.parking_spaces, 'area', pr.area, 'features', pr.features,
        'status', pr.status,
        'images', coalesce((select jsonb_agg(jsonb_build_object('image_url', pi.image_url, 'position', pi.position) order by pi.position) from public.property_images pi where pi.property_id = pr.id), '[]'::jsonb)
      ) order by pr.created_at desc)
      from public.properties pr
      where pr.user_id = p.user_id and pr.publication_status = 'published'
      and (pr.status = 'available' or p.show_completed_properties)
    ), '[]'::jsonb)
  ) from public.profiles p where p.slug = lower(catalog_slug) limit 1;
$function$;
