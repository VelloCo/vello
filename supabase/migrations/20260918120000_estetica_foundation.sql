-- Vello para estéticas: serviços, antes/depois, horários de atendimento e agendamentos.
-- Migration aditiva: as tabelas de imóveis e seleções continuam intactas até a
-- troca da interface terminar; a remoção delas fica numa migration de limpeza.

create extension if not exists btree_gist with schema extensions;

-- Perfil ----------------------------------------------------------------------

alter table public.profiles
  add column if not exists business_type text not null default 'autonoma'
    check (business_type in ('autonoma', 'clinica')),
  add column if not exists neighborhood text,
  add column if not exists address text,
  add column if not exists show_address boolean not null default false,
  add column if not exists timezone text not null default 'America/Sao_Paulo',
  add column if not exists booking_enabled boolean not null default true,
  add column if not exists booking_auto_confirm boolean not null default true,
  add column if not exists booking_slot_minutes smallint not null default 30
    check (booking_slot_minutes between 5 and 120),
  add column if not exists booking_min_notice_minutes integer not null default 120
    check (booking_min_notice_minutes between 0 and 10080),
  add column if not exists booking_max_days_ahead smallint not null default 60
    check (booking_max_days_ahead between 1 and 365),
  add column if not exists before_after_terms_accepted_at timestamptz;

-- Serviços ----------------------------------------------------------------------

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text not null default '' check (char_length(description) <= 4000),
  category text not null check (category in (
    'facial', 'corporal', 'depilacao', 'sobrancelhas_cilios', 'unhas',
    'cabelo', 'massagem', 'harmonizacao', 'outros'
  )),
  price_type text not null default 'fixed' check (price_type in ('fixed', 'from', 'on_request')),
  price numeric(10,2) check (price is null or price >= 0),
  duration_minutes smallint not null check (duration_minutes between 5 and 600),
  publication_status text not null default 'published' check (publication_status in ('draft', 'published')),
  bookable boolean not null default true,
  position smallint not null default 0 check (position >= 0),
  slug text check (slug is null or slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint services_price_required check (price_type = 'on_request' or price is not null),
  constraint services_user_slug_unique unique (user_id, slug)
);

create table if not exists public.service_images (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  image_url text not null,
  position smallint not null default 0 check (position >= 0),
  is_cover boolean not null default false,
  created_at timestamptz not null default now(),
  unique (service_id, position)
);

-- Antes e depois: só liberado depois que o perfil aceita o termo de responsabilidade.
create table if not exists public.service_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  before_url text not null,
  after_url text not null,
  caption text not null default '' check (char_length(caption) <= 300),
  position smallint not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

-- Agenda ------------------------------------------------------------------------

-- weekday segue extract(dow): 0 = domingo ... 6 = sábado. Vários intervalos por dia
-- permitem pausa para almoço.
create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  constraint business_hours_valid_range check (end_time > start_time),
  constraint business_hours_unique_start unique (user_id, weekday, start_time)
);

create table if not exists public.schedule_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default '' check (char_length(reason) <= 200),
  created_at timestamptz not null default now(),
  constraint schedule_blocks_valid_range check (ends_at > starts_at)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  service_title text not null,
  client_name text not null check (char_length(btrim(client_name)) between 2 and 120),
  client_whatsapp text not null check (client_whatsapp ~ '^[0-9]{10,13}$'),
  client_notes text not null default '' check (char_length(client_notes) <= 500),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  source text not null default 'online' check (source in ('online', 'manual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointments_valid_range check (ends_at > starts_at),
  -- Uma agenda por conta: dois horários ativos nunca se sobrepõem.
  constraint appointments_no_overlap exclude using gist (
    user_id with =,
    tstzrange(starts_at, ends_at) with &&
  ) where (status in ('pending', 'confirmed'))
);

create index if not exists services_user_id_idx on public.services(user_id);
create index if not exists service_images_service_id_idx on public.service_images(service_id);
create index if not exists service_results_user_id_idx on public.service_results(user_id);
create index if not exists service_results_service_id_idx on public.service_results(service_id);
create index if not exists business_hours_user_weekday_idx on public.business_hours(user_id, weekday);
create index if not exists schedule_blocks_user_starts_idx on public.schedule_blocks(user_id, starts_at);
create index if not exists appointments_user_starts_idx on public.appointments(user_id, starts_at);
create index if not exists appointments_service_id_idx on public.appointments(service_id);

create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments
  for each row execute function public.set_updated_at();

-- RLS: o dono gerencia tudo; o público só lê pelas funções abaixo. ---------------

alter table public.services enable row level security;
alter table public.service_images enable row level security;
alter table public.service_results enable row level security;
alter table public.business_hours enable row level security;
alter table public.schedule_blocks enable row level security;
alter table public.appointments enable row level security;

create policy "services_owner_all" on public.services for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "service_images_owner_all" on public.service_images for all to authenticated
  using (exists (select 1 from public.services s where s.id = service_id and s.user_id = (select auth.uid())))
  with check (exists (select 1 from public.services s where s.id = service_id and s.user_id = (select auth.uid())));

create policy "service_results_owner_select" on public.service_results for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "service_results_owner_delete" on public.service_results for delete to authenticated
  using ((select auth.uid()) = user_id);
create policy "service_results_owner_insert" on public.service_results for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.profiles p where p.user_id = (select auth.uid()) and p.before_after_terms_accepted_at is not null)
    and (service_id is null or exists (select 1 from public.services s where s.id = service_id and s.user_id = (select auth.uid())))
  );
create policy "service_results_owner_update" on public.service_results for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (service_id is null or exists (select 1 from public.services s where s.id = service_id and s.user_id = (select auth.uid())))
  );

create policy "business_hours_owner_all" on public.business_hours for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "schedule_blocks_owner_all" on public.schedule_blocks for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "appointments_owner_all" on public.appointments for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (service_id is null or exists (select 1 from public.services s where s.id = service_id and s.user_id = (select auth.uid())))
  );

-- Página pública ----------------------------------------------------------------

create or replace function public.get_public_page(p_slug text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'professional_name', p.professional_name, 'avatar_url', p.avatar_url,
      'business_type', p.business_type, 'whatsapp', p.whatsapp,
      'city', p.city, 'state', p.state, 'neighborhood', p.neighborhood,
      'address', case when p.show_address then p.address else null end,
      'instagram', case when p.show_instagram then p.instagram else null end,
      'slug', p.slug, 'bio', p.bio, 'catalog_theme', p.catalog_theme,
      'booking_enabled', p.booking_enabled,
      'booking_max_days_ahead', p.booking_max_days_ahead,
      'timezone', p.timezone
    ),
    'services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'slug', coalesce(s.slug, s.id::text), 'title', s.title,
        'description', s.description, 'category', s.category,
        'price_type', s.price_type, 'price', s.price,
        'duration_minutes', s.duration_minutes,
        'bookable', s.bookable and p.booking_enabled,
        'images', coalesce((
          select jsonb_agg(jsonb_build_object('image_url', si.image_url, 'position', si.position) order by si.position)
          from public.service_images si where si.service_id = s.id
        ), '[]'::jsonb)
      ) order by s.position, s.created_at)
      from public.services s
      where s.user_id = p.user_id and s.publication_status = 'published'
    ), '[]'::jsonb),
    'results', case when p.before_after_terms_accepted_at is null then '[]'::jsonb else coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'service_id', r.service_id, 'before_url', r.before_url,
        'after_url', r.after_url, 'caption', r.caption
      ) order by r.position, r.created_at)
      from public.service_results r
      left join public.services s on s.id = r.service_id
      where r.user_id = p.user_id and (s.id is null or s.publication_status = 'published')
    ), '[]'::jsonb) end
  )
  from public.profiles p
  where p.slug = lower(p_slug) and p.onboarding_completed
  limit 1;
$$;

-- Horários livres de um dia (no fuso do perfil) para um serviço.
create or replace function public.get_available_slots(p_slug text, p_service_id uuid, p_day date)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  prof public.profiles%rowtype;
  svc public.services%rowtype;
  local_today date;
  svc_length interval;
  result jsonb;
begin
  select * into prof from public.profiles p
  where p.slug = lower(p_slug) and p.onboarding_completed and p.booking_enabled
  limit 1;
  if not found then return '[]'::jsonb; end if;

  select * into svc from public.services s
  where s.id = p_service_id and s.user_id = prof.user_id
    and s.publication_status = 'published' and s.bookable;
  if not found then return '[]'::jsonb; end if;

  local_today := (now() at time zone prof.timezone)::date;
  if p_day is null or p_day < local_today or p_day > local_today + prof.booking_max_days_ahead then
    return '[]'::jsonb;
  end if;

  svc_length := make_interval(mins => svc.duration_minutes);

  select coalesce(jsonb_agg(x.slot order by x.slot), '[]'::jsonb) into result
  from (
    select distinct g.slot
    from public.business_hours bh
    cross join lateral generate_series(
      (p_day + bh.start_time) at time zone prof.timezone,
      ((p_day + bh.end_time) at time zone prof.timezone) - svc_length,
      make_interval(mins => prof.booking_slot_minutes)
    ) as g(slot)
    where bh.user_id = prof.user_id
      and bh.weekday = extract(dow from p_day)::smallint
      and g.slot >= now() + make_interval(mins => prof.booking_min_notice_minutes)
      and not exists (
        select 1 from public.appointments a
        where a.user_id = prof.user_id and a.status in ('pending', 'confirmed')
          and tstzrange(a.starts_at, a.ends_at) && tstzrange(g.slot, g.slot + svc_length)
      )
      and not exists (
        select 1 from public.schedule_blocks b
        where b.user_id = prof.user_id
          and tstzrange(b.starts_at, b.ends_at) && tstzrange(g.slot, g.slot + svc_length)
      )
  ) x;

  return result;
end;
$$;

-- Agendamento feito pela cliente na página pública (sem login).
create or replace function public.book_appointment(
  p_slug text,
  p_service_id uuid,
  p_starts_at timestamptz,
  p_client_name text,
  p_client_whatsapp text,
  p_client_notes text default ''
)
returns jsonb
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  prof public.profiles%rowtype;
  svc public.services%rowtype;
  phone text := regexp_replace(coalesce(p_client_whatsapp, ''), '[^0-9]', '', 'g');
  client text := btrim(coalesce(p_client_name, ''));
  appt public.appointments%rowtype;
begin
  if char_length(client) not between 2 and 120 then
    raise exception 'Informe seu nome.' using errcode = '22023';
  end if;
  if char_length(phone) not between 10 and 13 then
    raise exception 'Informe um WhatsApp válido com DDD.' using errcode = '22023';
  end if;
  if char_length(coalesce(p_client_notes, '')) > 500 then
    raise exception 'A observação pode ter até 500 caracteres.' using errcode = '22023';
  end if;

  select * into prof from public.profiles p
  where p.slug = lower(p_slug) and p.onboarding_completed and p.booking_enabled
  limit 1;
  if not found then
    raise exception 'Agendamento indisponível para esta página.' using errcode = 'P0001';
  end if;

  select * into svc from public.services s
  where s.id = p_service_id and s.user_id = prof.user_id
    and s.publication_status = 'published' and s.bookable;
  if not found then
    raise exception 'Este serviço não está disponível para agendamento.' using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from jsonb_array_elements_text(
      public.get_available_slots(p_slug, p_service_id, (p_starts_at at time zone prof.timezone)::date)
    ) e
    where e.value::timestamptz = p_starts_at
  ) then
    raise exception 'Este horário não está mais disponível. Escolha outro.' using errcode = 'P0001';
  end if;

  -- Freio contra abuso: no máximo 3 horários futuros em aberto por WhatsApp.
  if (
    select count(*) from public.appointments a
    where a.user_id = prof.user_id and a.client_whatsapp = phone
      and a.status in ('pending', 'confirmed') and a.starts_at > now()
  ) >= 3 then
    raise exception 'Você já tem horários marcados. Fale com a profissional pelo WhatsApp.' using errcode = 'P0001';
  end if;

  begin
    insert into public.appointments (
      user_id, service_id, service_title, client_name, client_whatsapp,
      client_notes, starts_at, ends_at, status, source
    ) values (
      prof.user_id, svc.id, svc.title, client, phone,
      coalesce(p_client_notes, ''), p_starts_at,
      p_starts_at + make_interval(mins => svc.duration_minutes),
      case when prof.booking_auto_confirm then 'confirmed' else 'pending' end,
      'online'
    ) returning * into appt;
  exception when exclusion_violation then
    raise exception 'Este horário acabou de ser reservado. Escolha outro.' using errcode = 'P0001';
  end;

  return jsonb_build_object(
    'id', appt.id, 'status', appt.status,
    'starts_at', appt.starts_at, 'ends_at', appt.ends_at,
    'service_title', appt.service_title,
    'professional_name', prof.professional_name,
    'whatsapp', prof.whatsapp
  );
end;
$$;

revoke all on function public.get_public_page(text) from public;
revoke all on function public.get_available_slots(text, uuid, date) from public;
revoke all on function public.book_appointment(text, uuid, timestamptz, text, text, text) from public;
grant execute on function public.get_public_page(text) to anon, authenticated;
grant execute on function public.get_available_slots(text, uuid, date) to anon, authenticated;
grant execute on function public.book_appointment(text, uuid, timestamptz, text, text, text) to anon, authenticated;

-- Storage -----------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('service-images', 'service-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "service_images_storage_owner_select" on storage.objects for select to authenticated
  using (bucket_id = 'service-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "service_images_storage_owner_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'service-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "service_images_storage_owner_update" on storage.objects for update to authenticated
  using (bucket_id = 'service-images' and (storage.foldername(name))[1] = (select auth.uid()::text))
  with check (bucket_id = 'service-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "service_images_storage_owner_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'service-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
