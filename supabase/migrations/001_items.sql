-- ManoAmiga VE — Migración 001: tablas principales
-- Corre este SQL en el editor SQL de tu proyecto Supabase.
-- Para activar el adaptador: define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY en .env.local

-- ── Limpieza de Esquema Existente (Idempotencia) ──────────────────────────────
drop table if exists public.item_verifications cascade;
drop table if exists public.item_reports cascade;
drop table if exists public.items cascade;

drop table if exists public.location_suggestions cascade;
drop table if exists public.locations_places cascade;
drop table if exists public.locations_admin cascade;

drop type if exists item_type cascade;
drop type if exists item_urgency cascade;
drop type if exists item_status cascade;
drop type if exists contact_method cascade;
drop type if exists category_id cascade;
drop type if exists report_reason cascade;
drop type if exists verification_type cascade;

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
  id                          text primary key default gen_random_uuid()::text,
  type                        item_type      not null,
  category                    category_id    not null,
  title                       text           not null check (char_length(title) between 3 and 120),
  description                 text           not null check (char_length(description) <= 600),
  state_name                  text           not null,
  municipality_name           text,
  city_name                   text,
  parish_name                 text,
  zone_text                   text           not null check (char_length(zone_text) between 2 and 80),
  reference_text              text,
  approximate_location_label  text           not null,
  -- Coordenadas aproximadas (jitter ~500m aplicado en cliente antes de insertar)
  lat                         float8,
  lng                         float8,
  urgency                     item_urgency   not null default 'medium',
  status                      item_status    not null,
  contact_method              contact_method not null,
  -- Valor de contacto SOLO visible en SELECT con row-level-security apropiado
  contact_value               text           not null,
  capacity                    int2,
  available_until             timestamptz,
  expires_at                  timestamptz,
  verified_count              int4           not null default 0,
  report_count                int4           not null default 0,
  -- Moderación: oculta de vistas públicas sin borrar el registro
  hidden                      boolean        not null default false,
  created_at                  timestamptz    not null default now(),
  updated_at                  timestamptz    not null default now()
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

-- ── Tabla: locations_admin ──────────────────────────────────────────────────
create table public.locations_admin (
  id                 uuid primary key default gen_random_uuid(),
  state_name         text not null,
  municipality_name  text,
  parish_name        text,
  source             text default 'manual_seed',
  created_at         timestamptz default now()
);

create index loc_admin_state on public.locations_admin (state_name);

-- ── Tabla: locations_places ─────────────────────────────────────────────────
create table public.locations_places (
  id                 uuid primary key default gen_random_uuid(),
  state_name         text not null,
  municipality_name  text,
  parish_name        text,
  city_name          text,
  place_name         text not null,
  place_type         text,
  lat                double precision,
  lng                double precision,
  source             text default 'manual_seed',
  created_at         timestamptz default now(),
  unique (state_name, place_name)
);

create index loc_places_state_name on public.locations_places (state_name);
create index loc_places_place_name on public.locations_places (place_name);

-- ── Tabla: location_suggestions ─────────────────────────────────────────────
create table public.location_suggestions (
  id                 uuid primary key default gen_random_uuid(),
  state_name         text not null,
  municipality_name  text,
  city_name          text,
  place_name         text not null,
  reference_text     text,
  status             text default 'pending',
  created_at         timestamptz default now()
);

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

-- ── Seed inicial SQL para ubicaciones prioritarias ───────────────────────────
insert into public.locations_admin (state_name) values
  ('La Guaira'),
  ('Distrito Capital'),
  ('Miranda'),
  ('Carabobo'),
  ('Aragua');

-- La Guaira
insert into public.locations_places (state_name, place_name, city_name) values
  ('La Guaira', 'La Guaira', 'La Guaira'),
  ('La Guaira', 'Maiquetía', 'Maiquetía'),
  ('La Guaira', 'Catia La Mar', 'Catia La Mar'),
  ('La Guaira', 'Macuto', 'Macuto'),
  ('La Guaira', 'Caraballeda', 'Caraballeda'),
  ('La Guaira', 'Naiguatá', 'Naiguatá'),
  ('La Guaira', 'Carayaca', 'Carayaca'),
  ('La Guaira', 'Pariata', 'Pariata'),
  ('La Guaira', 'Caribe', 'Caribe'),
  ('La Guaira', 'Tanaguarena', 'Tanaguarena'),
  ('La Guaira', 'Camurí Chico', 'Camurí Chico'),
  ('La Guaira', 'Punta de Mulatos', 'Punta de Mulatos'),
  ('La Guaira', 'El Rincón', 'El Rincón'),
  ('La Guaira', 'La Soublette', 'La Soublette');

-- Distrito Capital
insert into public.locations_places (state_name, place_name, city_name) values
  ('Distrito Capital', 'Caracas', 'Caracas'),
  ('Distrito Capital', 'Catia', 'Caracas'),
  ('Distrito Capital', '23 de Enero', 'Caracas'),
  ('Distrito Capital', 'La Pastora', 'Caracas'),
  ('Distrito Capital', 'San Bernardino', 'Caracas'),
  ('Distrito Capital', 'La Candelaria', 'Caracas'),
  ('Distrito Capital', 'San Agustín', 'Caracas'),
  ('Distrito Capital', 'El Recreo', 'Caracas'),
  ('Distrito Capital', 'Sabana Grande', 'Caracas'),
  ('Distrito Capital', 'Plaza Venezuela', 'Caracas'),
  ('Distrito Capital', 'El Paraíso', 'Caracas'),
  ('Distrito Capital', 'La Vega', 'Caracas'),
  ('Distrito Capital', 'Antímano', 'Caracas'),
  ('Distrito Capital', 'Caricuao', 'Caracas'),
  ('Distrito Capital', 'El Valle', 'Caracas'),
  ('Distrito Capital', 'Coche', 'Caracas'),
  ('Distrito Capital', 'San Martín', 'Caracas'),
  ('Distrito Capital', 'Quinta Crespo', 'Caracas'),
  ('Distrito Capital', 'Propatria', 'Caracas'),
  ('Distrito Capital', 'Lídice', 'Caracas');

-- Miranda
insert into public.locations_places (state_name, place_name, city_name) values
  ('Miranda', 'Chacao', 'Chacao'),
  ('Miranda', 'Baruta', 'Baruta'),
  ('Miranda', 'El Hatillo', 'El Hatillo'),
  ('Miranda', 'Petare', 'Petare'),
  ('Miranda', 'Los Teques', 'Los Teques'),
  ('Miranda', 'Guarenas', 'Guarenas'),
  ('Miranda', 'Guatire', 'Guatire'),
  ('Miranda', 'Charallave', 'Charallave'),
  ('Miranda', 'Cúa', 'Cúa'),
  ('Miranda', 'Santa Teresa del Tuy', 'Santa Teresa del Tuy'),
  ('Miranda', 'Ocumare del Tuy', 'Ocumare del Tuy'),
  ('Miranda', 'Caucagua', 'Caucagua'),
  ('Miranda', 'Higuerote', 'Higuerote'),
  ('Miranda', 'Río Chico', 'Río Chico'),
  ('Miranda', 'Carrizal', 'Carrizal'),
  ('Miranda', 'San Antonio de los Altos', 'San Antonio de los Altos'),
  ('Miranda', 'La California', 'Caracas'),
  ('Miranda', 'Los Ruices', 'Caracas'),
  ('Miranda', 'La Urbina', 'Caracas'),
  ('Miranda', 'El Cafetal', 'Caracas'),
  ('Miranda', 'Las Mercedes', 'Caracas'),
  ('Miranda', 'Colinas de Bello Monte', 'Caracas'),
  ('Miranda', 'Santa Fe', 'Caracas'),
  ('Miranda', 'Prados del Este', 'Caracas'),
  ('Miranda', 'La Trinidad', 'Caracas');

-- Carabobo
insert into public.locations_places (state_name, place_name, city_name) values
  ('Carabobo', 'Valencia', 'Valencia'),
  ('Carabobo', 'Naguanagua', 'Naguanagua'),
  ('Carabobo', 'San Diego', 'San Diego'),
  ('Carabobo', 'Guacara', 'Guacara'),
  ('Carabobo', 'Los Guayos', 'Los Guayos'),
  ('Carabobo', 'Puerto Cabello', 'Puerto Cabello'),
  ('Carabobo', 'Tocuyito', 'Tocuyito'),
  ('Carabobo', 'Bejuma', 'Bejuma'),
  ('Carabobo', 'Mariara', 'Mariara'),
  ('Carabobo', 'Morón', 'Morón'),
  ('Carabobo', 'La Isabelica', 'Valencia'),
  ('Carabobo', 'Flor Amarillo', 'Valencia'),
  ('Carabobo', 'Prebo', 'Valencia'),
  ('Carabobo', 'El Viñedo', 'Valencia'),
  ('Carabobo', 'San Blas', 'Valencia'),
  ('Carabobo', 'Candelaria', 'Valencia'),
  ('Carabobo', 'Miguel Peña', 'Valencia'),
  ('Carabobo', 'El Trigal', 'Valencia'),
  ('Carabobo', 'Mañongo', 'Naguanagua');

-- Aragua
insert into public.locations_places (state_name, place_name, city_name) values
  ('Aragua', 'Maracay', 'Maracay'),
  ('Aragua', 'Turmero', 'Turmero'),
  ('Aragua', 'La Victoria', 'La Victoria'),
  ('Aragua', 'Cagua', 'Cagua'),
  ('Aragua', 'Villa de Cura', 'Villa de Cura'),
  ('Aragua', 'El Limón', 'El Limón'),
  ('Aragua', 'Palo Negro', 'Palo Negro'),
  ('Aragua', 'Santa Rita', 'Santa Rita'),
  ('Aragua', 'San Mateo', 'San Mateo'),
  ('Aragua', 'Las Tejerías', 'Las Tejerías'),
  ('Aragua', 'La Encrucijada', 'Turmero'),
  ('Aragua', 'Caña de Azúcar', 'El Limón'),
  ('Aragua', 'Base Aragua', 'Maracay'),
  ('Aragua', 'San Jacinto', 'Maracay'),
  ('Aragua', 'Los Samanes', 'Maracay'),
  ('Aragua', 'La Morita', 'Turmero'),
  ('Aragua', 'Santa Cruz', 'Santa Cruz'),
  ('Aragua', 'Choroní', 'Choroní'),
  ('Aragua', 'Ocumare de la Costa', 'Ocumare de la Costa');
