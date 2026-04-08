-- Ejecutar en Supabase → SQL Editor
-- API en Next usa SUPABASE_SERVICE_ROLE_KEY (bypass RLS).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  empresa text not null,
  email text not null,
  tipo_negocio text,
  mensaje text
);

-- Opcional: evitar acceso público directo desde el cliente anon
alter table public.leads enable row level security;
