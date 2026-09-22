-- Corrige duas corridas de dados encontradas na auditoria de 2026-09-22:
-- 1. serializa reservas públicas por agenda antes de contar limites e conferir
--    o horário, impedindo chamadas simultâneas de ultrapassarem os freios;
-- 2. troca a disponibilidade semanal dentro de uma única transação.

create or replace function public.book_appointment(
  p_slug text,
  p_service_id uuid,
  p_starts_at timestamp with time zone,
  p_client_name text,
  p_client_whatsapp text,
  p_client_notes text default ''::text
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
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

  -- Uma reserva por vez para cada agenda. A trava é liberada automaticamente
  -- no fim da transação e torna atômicos os limites + a ocupação do horário.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(prof.user_id::text, 0)
  );

  select * into svc from public.services s
  where s.id = p_service_id and s.user_id = prof.user_id
    and s.publication_status = 'published' and s.bookable;
  if not found then
    raise exception 'Este serviço não está disponível para agendamento.' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.appointments a
    where a.user_id = prof.user_id and a.source = 'online'
      and a.created_at > now() - interval '1 hour'
  ) >= 20 then
    raise exception 'Muitas reservas agora. Tente novamente em alguns minutos.' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.appointments a
    where a.user_id = prof.user_id and a.client_whatsapp = phone
      and a.created_at > now() - interval '1 day'
  ) >= 5 then
    raise exception 'Você já fez vários pedidos hoje. Fale com a profissional pelo WhatsApp.' using errcode = 'P0001';
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
$function$;

revoke all on function public.book_appointment(text, uuid, timestamptz, text, text, text) from public;
grant execute on function public.book_appointment(text, uuid, timestamptz, text, text, text) to anon, authenticated;

create or replace function public.replace_business_hours(p_hours jsonb)
returns void
language plpgsql
security invoker
set search_path to ''
as $function$
declare
  owner_id uuid := (select auth.uid());
begin
  if owner_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_hours is null or jsonb_typeof(p_hours) <> 'array' then
    raise exception 'Horários inválidos.' using errcode = '22023';
  end if;
  if jsonb_array_length(p_hours) > 28 then
    raise exception 'Muitos intervalos de atendimento.' using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_to_recordset(p_hours) as h(weekday smallint, start_time time, end_time time)
    where h.weekday is null or h.weekday not between 0 and 6
      or h.start_time is null or h.end_time is null or h.end_time <= h.start_time
  ) then
    raise exception 'Há um intervalo de atendimento inválido.' using errcode = '22023';
  end if;
  if exists (
    select 1
    from jsonb_to_recordset(p_hours) as h(weekday smallint, start_time time, end_time time)
    group by h.weekday, h.start_time
    having count(*) > 1
  ) then
    raise exception 'Há horários duplicados.' using errcode = '22023';
  end if;

  delete from public.business_hours where user_id = owner_id;
  insert into public.business_hours (user_id, weekday, start_time, end_time)
  select owner_id, h.weekday, h.start_time, h.end_time
  from jsonb_to_recordset(p_hours) as h(weekday smallint, start_time time, end_time time);
end;
$function$;

revoke all on function public.replace_business_hours(jsonb) from public, anon;
grant execute on function public.replace_business_hours(jsonb) to authenticated;
