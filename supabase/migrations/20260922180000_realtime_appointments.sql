-- Avisos em tempo real: o painel recebe novos agendamentos sem recarregar.
-- O Realtime respeita as políticas da tabela, então cada profissional só
-- recebe os próprios agendamentos.
alter publication supabase_realtime add table public.appointments;
