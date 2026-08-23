create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '', professional_name text not null default '',
  avatar_url text, creci text, whatsapp text, city text, state text, instagram text,
  slug text unique check (slug is null or slug ~ '^[a-z0-9-]+$'),
  onboarding_completed boolean not null default false,
  onboarding_step smallint not null default 1 check (onboarding_step between 1 and 3),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, description text not null default '',
  transaction_type text not null check (transaction_type in ('sale', 'rent')),
  property_type text not null, price numeric(14,2) not null check (price >= 0),
  city text not null, neighborhood text not null, address text,
  show_full_address boolean not null default false,
  bedrooms smallint not null default 0 check (bedrooms >= 0),
  suites smallint not null default 0 check (suites >= 0),
  bathrooms smallint not null default 0 check (bathrooms >= 0),
  parking_spaces smallint not null default 0 check (parking_spaces >= 0),
  area numeric(10,2) not null default 0 check (area >= 0),
  features text[] not null default '{}', status text not null default 'available' check (status in ('available', 'reserved', 'sold', 'rented')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null, position smallint not null default 0 check (position >= 0),
  is_cover boolean not null default false, created_at timestamptz not null default now(), unique (property_id, position)
);

create index if not exists properties_user_id_idx on public.properties(user_id);
create index if not exists property_images_property_id_idx on public.property_images(property_id);
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;

create policy "profiles_owner_select" on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_owner_insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_owner_update" on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "properties_owner_all" on public.properties for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "property_images_owner_all" on public.property_images for all to authenticated using (exists (select 1 from public.properties p where p.id = property_id and p.user_id = (select auth.uid()))) with check (exists (select 1 from public.properties p where p.id = property_id and p.user_id = (select auth.uid())));

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger properties_set_updated_at before update on public.properties for each row execute function public.set_updated_at();

create or replace function public.is_slug_available(candidate text) returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if lower(candidate) !~ '^[a-z0-9-]+$' then return false; end if;
  return not exists (select 1 from public.profiles p where p.slug = lower(candidate) and p.user_id <> auth.uid());
end;
$$;
revoke all on function public.is_slug_available(text) from public;
grant execute on function public.is_slug_available(text) to authenticated;

create or replace function public.get_catalog(catalog_slug text) returns jsonb language sql security definer set search_path = '' stable as $$
  select jsonb_build_object('profile', jsonb_build_object('professional_name', p.professional_name, 'avatar_url', p.avatar_url, 'creci', p.creci, 'city', p.city, 'state', p.state, 'instagram', p.instagram, 'slug', p.slug), 'properties', coalesce((select jsonb_agg(jsonb_build_object('id', pr.id, 'title', pr.title, 'description', pr.description, 'transaction_type', pr.transaction_type, 'property_type', pr.property_type, 'price', pr.price, 'city', pr.city, 'neighborhood', pr.neighborhood, 'bedrooms', pr.bedrooms, 'bathrooms', pr.bathrooms, 'parking_spaces', pr.parking_spaces, 'area', pr.area, 'features', pr.features, 'images', coalesce((select jsonb_agg(jsonb_build_object('image_url', pi.image_url, 'position', pi.position) order by pi.position) from public.property_images pi where pi.property_id = pr.id), '[]'::jsonb)) order by pr.created_at desc) from public.properties pr where pr.user_id = p.user_id and pr.status = 'available'), '[]'::jsonb)) from public.profiles p where p.slug = lower(catalog_slug) limit 1;
$$;
revoke all on function public.get_catalog(text) from public;
grant execute on function public.get_catalog(text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('property-images', 'property-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "avatars_owner_select" on storage.objects for select to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "avatars_owner_insert" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "avatars_owner_update" on storage.objects for update to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text)) with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "avatars_owner_delete" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "property_images_owner_select" on storage.objects for select to authenticated using (bucket_id = 'property-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "property_images_owner_insert" on storage.objects for insert to authenticated with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "property_images_owner_update" on storage.objects for update to authenticated using (bucket_id = 'property-images' and (storage.foldername(name))[1] = (select auth.uid()::text)) with check (bucket_id = 'property-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "property_images_owner_delete" on storage.objects for delete to authenticated using (bucket_id = 'property-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
