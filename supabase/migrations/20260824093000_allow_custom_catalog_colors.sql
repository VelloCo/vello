alter table public.profiles
  drop constraint if exists profiles_catalog_theme_valid;

alter table public.profiles
  add constraint profiles_catalog_theme_valid check (
    jsonb_typeof(catalog_theme) = 'object'
    and catalog_theme->>'palette' in ('warm', 'paper', 'charcoal')
    and catalog_theme->>'property_style' in ('editorial', 'classic', 'compact')
    and catalog_theme->>'profile_band' in ('light', 'contrast', 'dark')
    and (
      not catalog_theme ? 'background_color'
      or catalog_theme->>'background_color' ~ '^#[0-9A-Fa-f]{6}$'
    )
    and (
      not catalog_theme ? 'profile_color'
      or catalog_theme->>'profile_color' ~ '^#[0-9A-Fa-f]{6}$'
    )
  );
