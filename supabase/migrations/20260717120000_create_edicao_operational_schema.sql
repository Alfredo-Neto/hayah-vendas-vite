create type public.edicao_status as enum ('draft', 'active', 'review', 'finalized');
create type public.convite_papel as enum ('lider');
create type public.convite_status as enum ('pending', 'accepted', 'revoked');
create type public.edicao_papel as enum ('lider');
create type public.fechamento_status as enum ('enviado', 'validado', 'rejeitado');

create table public.edicoes (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  nome text not null,
  status public.edicao_status not null default 'draft',
  data_inicio date,
  data_fim date,
  criado_por_usuario_id uuid not null references public.usuarios(id) on delete restrict,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint edicoes_nome_nao_vazio check (length(trim(nome)) > 0),
  constraint edicoes_periodo_valido check (data_fim is null or data_inicio is null or data_fim >= data_inicio)
);

create unique index edicoes_uma_ativa_por_igreja_local_idx
  on public.edicoes (igreja_local_id)
  where status = 'active';

create table public.equipes (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  edicao_id uuid not null references public.edicoes(id) on delete cascade,
  nome text not null,
  lider_usuario_id uuid references public.usuarios(id) on delete set null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint equipes_nome_nao_vazio check (length(trim(nome)) > 0),
  unique (edicao_id, nome)
);

create unique index equipes_um_lider_por_edicao_idx
  on public.equipes (edicao_id, lider_usuario_id)
  where lider_usuario_id is not null;

create table public.convites (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  edicao_id uuid references public.edicoes(id) on delete cascade,
  equipe_id uuid references public.equipes(id) on delete cascade,
  papel public.convite_papel not null default 'lider',
  code text not null unique,
  invited_email text not null,
  status public.convite_status not null default 'pending',
  expires_at timestamptz not null,
  created_by_usuario_id uuid not null references public.usuarios(id) on delete restrict,
  accepted_by_usuario_id uuid references public.usuarios(id) on delete restrict,
  accepted_at timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint convites_email_nao_vazio check (length(trim(invited_email)) > 0),
  constraint convites_code_nao_vazio check (length(trim(code)) > 0),
  constraint convites_lider_tem_equipe check (papel <> 'lider' or (edicao_id is not null and equipe_id is not null)),
  constraint convites_aceito_tem_usuario_e_data check (
    status <> 'accepted' or (accepted_by_usuario_id is not null and accepted_at is not null)
  )
);

create unique index convites_um_pendente_por_equipe_idx
  on public.convites (equipe_id)
  where status = 'pending';

create table public.edicao_assignments (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  edicao_id uuid not null references public.edicoes(id) on delete cascade,
  equipe_id uuid not null references public.equipes(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  papel public.edicao_papel not null default 'lider',
  criado_em timestamptz not null default now(),
  unique (edicao_id, usuario_id),
  unique (edicao_id, equipe_id, papel)
);

create table public.fechamentos_equipe (
  id uuid primary key default gen_random_uuid(),
  igreja_local_id uuid not null references public.igrejas_locais(id) on delete cascade,
  edicao_id uuid not null references public.edicoes(id) on delete cascade,
  equipe_id uuid not null references public.equipes(id) on delete cascade,
  enviado_por_usuario_id uuid not null references public.usuarios(id) on delete restrict,
  valor_repassado numeric(12, 2) not null,
  comprovante_transferencia_path text not null,
  observacao text,
  status public.fechamento_status not null default 'enviado',
  validado_por_usuario_id uuid references public.usuarios(id) on delete restrict,
  validado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint fechamentos_valor_repassado_positivo check (valor_repassado > 0),
  constraint fechamentos_comprovante_obrigatorio check (length(trim(comprovante_transferencia_path)) > 0),
  constraint fechamentos_validado_tem_usuario_e_data check (
    status <> 'validado' or (validado_por_usuario_id is not null and validado_em is not null)
  ),
  constraint fechamentos_nao_validado_sem_validacao check (
    status = 'validado' or (validado_por_usuario_id is null and validado_em is null)
  )
);

create index fechamentos_equipe_ranking_idx
  on public.fechamentos_equipe (edicao_id, status, valor_repassado desc);
