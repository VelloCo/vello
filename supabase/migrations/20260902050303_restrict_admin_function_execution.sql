-- Keep administrative RPCs unavailable to anonymous visitors.
revoke execute on function public.is_admin() from anon;
revoke execute on function public.get_admin_dashboard() from anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.get_admin_dashboard() to authenticated;
