create index if not exists selection_properties_property_idx
  on public.selection_properties(property_id);

revoke all on function public.is_slug_available(text) from public;
revoke all on function public.is_slug_available(text) from anon;
grant execute on function public.is_slug_available(text) to authenticated;
