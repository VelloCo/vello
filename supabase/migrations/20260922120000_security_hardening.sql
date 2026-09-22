-- Endurecimento de segurança (2026-09-22).
-- 1. book_appointment: freios contra reservas falsas em massa (antes só havia
--    limite por WhatsApp, fácil de contornar trocando o número).
-- 2. RPCs públicas da versão de corretores deixam de ser executáveis por
--    visitantes (get_selection expunha nomes de clientes).
-- 3. set_updated_at é só gatilho: não precisa estar exposta na API.

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

  select * into svc from public.services s
  where s.id = p_service_id and s.user_id = prof.user_id
    and s.publication_status = 'published' and s.bookable;
  if not found then
    raise exception 'Este serviço não está disponível para agendamento.' using errcode = 'P0001';
  end if;

  -- Freio por página: no máximo 20 reservas online criadas por hora.
  if (
    select count(*) from public.appointments a
    where a.user_id = prof.user_id and a.source = 'online'
      and a.created_at > now() - interval '1 hour'
  ) >= 20 then
    raise exception 'Muitas reservas agora. Tente novamente em alguns minutos.' using errcode = 'P0001';
  end if;

  -- Freio por WhatsApp: no máximo 5 pedidos por dia na mesma página.
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

  -- No máximo 3 horários futuros em aberto por WhatsApp.
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

create index if not exists appointments_user_created_idx
  on public.appointments (user_id, created_at desc);

revoke execute on function public.get_selection(text) from public, anon, authenticated;
revoke execute on function public.get_catalog(text) from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
