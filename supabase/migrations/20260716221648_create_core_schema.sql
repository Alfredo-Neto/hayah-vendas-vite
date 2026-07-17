create type public.igreja_local_papel as enum ('coordenador', 'usuario');

create table public.usuarios (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null,
  nome text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.igrejas_locais (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_por_usuario_id uuid not null references public.usuarios(id) on delete restrict,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.igreja_local_membros (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  papel public.igreja_local_papel not null default 'usuario',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (igreja_local_id, usuario_id)
);

create unique index igreja_local_membros_um_coordenador_por_usuario_idx
  on public.igreja_local_membros (usuario_id)
  where papel = 'coordenador';
