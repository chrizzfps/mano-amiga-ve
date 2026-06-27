-- ManoAmiga VE — Migración 002: Row Level Security
-- Corre DESPUÉS de 001_items.sql

-- ── Habilitar RLS ────────────────────────────────────────────────────────────
alter table public.items             enable row level security;
alter table public.item_reports      enable row level security;
alter table public.item_verifications enable row level security;

-- ── items: lectura pública (excluye ocultas y contacto) ─────────────────────
-- Cualquiera puede leer items no ocultos.
-- La columna contact_value se filtra en la app (nunca en cards, solo en detalle
-- si el usuario navega a /item/:id). Para mayor seguridad puedes crear una VIEW
-- que omita contact_value para anon:

create policy "items_public_read"
  on public.items for select
  using (hidden = false);

-- Anon puede insertar (sin login obligatorio en MVP).
-- La app aplica jitter a lat/lng antes de llamar a insert.
create policy "items_anon_insert"
  on public.items for insert
  to anon, authenticated
  with check (true);

-- Solo admin puede actualizar status / hidden.
-- "admin" = rol authenticated con email en allowlist (verificado en función).
create policy "items_admin_update"
  on public.items for update
  to authenticated
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(current_setting('app.admin_emails', true), ',')
    )
  );

-- ── item_reports: cualquiera puede insertar ──────────────────────────────────
create policy "reports_anon_insert"
  on public.item_reports for insert
  to anon, authenticated
  with check (true);

-- Solo admin puede leer reportes
create policy "reports_admin_read"
  on public.item_reports for select
  to authenticated
  using (
    auth.jwt() ->> 'email' = any(
      string_to_array(current_setting('app.admin_emails', true), ',')
    )
  );

-- ── item_verifications: cualquiera puede insertar (1 click = 1 verificación) ─
create policy "verifications_anon_insert"
  on public.item_verifications for insert
  to anon, authenticated
  with check (true);

-- ── Configuración del allowlist de admin ────────────────────────────────────
-- Ejecutar esto UNA VEZ con el SQL editor de Supabase (reemplaza los correos):
--
--   alter database postgres
--     set "app.admin_emails" = 'admin@ejemplo.com,otro@ejemplo.com';
--
-- O hazlo dinámico desde Edge Functions si lo prefieres.
