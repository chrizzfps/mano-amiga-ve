-- ManoAmiga VE — Migración 001: tablas principales
-- Corre este SQL en el editor SQL de tu proyecto Supabase.
-- Para activar el adaptador: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local

-- ── Tipos ENUM ─────────────────────────────────────────────────────────────
create type item_type      as enum ('need','offer');
create type item_urgency   as enum ('low','medium','high');
create type item_status    as enum (
  'open','in_progress','fulfilled','closed','reported',  -- necesidades
  'available','unavailable'                              -- ofertas
);
create type contact_method as enum ('whatsapp','telegram','phone','app');
create type category_id    as enum (
  'energia','agua','medicina','higiene','refugio',
  'transporte','mascotas','cuidados','comunicacion','otro'
);
create type report_reason  as enum (
  'fake','resolved','duplicate','wrong_info','inappropriate','other'
);
create type verification_type as enum ('neighbor','volunteer','organization');

-- ── Tabla principal: items ──────────────────────────────────────────────────
create table public.items (
  id              text primary key default gen_random_uuid()::text,
  type            item_type      not null,
  category        category_id    not null,
  title           text           not null check (char_length(title) between 3 and 120),
  description     text           not null check (char_length(description) <= 600),
  zone_text       text           not null check (char_length(zone_text) between 2 and 80),
  state           text           not null,
  city            text           not null,
  -- Coordenadas aproximadas (jitter ~500m aplicado en cliente antes de insertar)
  lat             float8,
  lng             float8,
  urgency         item_urgency   not null default 'medium',
  status          item_status    not null,
  contact_method  contact_method not null,
  -- Valor de contacto SOLO visible en SELECT con row-level-security apropiado
  contact_value   text           not null,
  capacity        int2,
  available_until timestamptz,
  expires_at      timestamptz,
  verified_count  int4           not null default 0,
  report_count    int4           not null default 0,
  -- Moderación: oculta de vistas públicas sin borrar el registro
  hidden          boolean        not null default false,
  created_at      timestamptz    not null default now(),
  updated_at      timestamptz    not null default now()
);

-- Índices de consulta frecuente
create index items_type_status  on public.items (type, status);
create index items_category     on public.items (category);
create index items_urgency      on public.items (urgency desc);
create index items_created_at   on public.items (created_at desc);
create index items_report_count on public.items (report_count desc);

-- Updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

-- ── Tabla: reportes ─────────────────────────────────────────────────────────
create table public.item_reports (
  id          text primary key default gen_random_uuid()::text,
  item_id     text           not null references public.items(id) on delete cascade,
  reason      report_reason  not null,
  description text           not null default '',
  created_at  timestamptz    not null default now()
);

create index item_reports_item_id on public.item_reports (item_id);

-- ── Tabla: verificaciones ────────────────────────────────────────────────────
create table public.item_verifications (
  id                text primary key default gen_random_uuid()::text,
  item_id           text              not null references public.items(id) on delete cascade,
  verification_type verification_type not null default 'neighbor',
  created_at        timestamptz       not null default now()
);

create index item_verifications_item_id on public.item_verifications (item_id);

-- Trigger: incrementar verified_count al insertar verificación
create or replace function public.inc_verified_count()
returns trigger language plpgsql as $$
begin
  update public.items
    set verified_count = verified_count + 1
  where id = new.item_id;
  return new;
end;
$$;

create trigger item_verifications_inc_count
after insert on public.item_verifications
for each row execute function public.inc_verified_count();
