create type public.coordenador_authorization_status as enum ('active', 'revoked');

create table public.admin_authorizations (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text not null unique,
  status public.coordenador_authorization_status not null default 'active',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint admin_authorizations_email_nao_vazio check (length(trim(email)) > 0),
  constraint admin_authorizations_identidade_presente check (auth_user_id is not null or email is not null)
);

create table public.coordenador_authorizations (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid unique references public.usuarios(id) on delete cascade,
  email text not null unique,
  nome text,
  authorized_by_admin_usuario_id uuid not null references public.usuarios(id) on delete restrict,
  status public.coordenador_authorization_status not null default 'active',
  activated_at timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint coordenador_authorizations_email_nao_vazio check (length(trim(email)) > 0)
);

alter table public.usuarios enable row level security;
alter table public.igrejas_locais enable row level security;
alter table public.igreja_local_membros enable row level security;
alter table public.admin_authorizations enable row level security;
alter table public.coordenador_authorizations enable row level security;

create policy usuarios_select_self on public.usuarios
  for select to authenticated
  using (auth_user_id = auth.uid());

create policy usuarios_update_self on public.usuarios
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

create policy igrejas_locais_select_membro on public.igrejas_locais
  for select to authenticated
  using (
    exists (
      select 1
      from public.igreja_local_membros membro
      join public.usuarios usuario on usuario.id = membro.usuario_id
      where membro.igreja_local_id = igrejas_locais.id
        and usuario.auth_user_id = auth.uid()
    )
  );

create policy igreja_local_membros_select_self on public.igreja_local_membros
  for select to authenticated
  using (
    exists (
      select 1
      from public.usuarios usuario
      where usuario.id = igreja_local_membros.usuario_id
        and usuario.auth_user_id = auth.uid()
    )
  );

create policy admin_authorizations_select_self on public.admin_authorizations
  for select to authenticated
  using (auth_user_id = auth.uid() or lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy coordenador_authorizations_select_self on public.coordenador_authorizations
  for select to authenticated
  using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    or exists (
      select 1
      from public.usuarios usuario
      where usuario.id = coordenador_authorizations.usuario_id
        and usuario.auth_user_id = auth.uid()
    )
  );

create or replace function public.current_usuario()
returns public.usuarios
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_auth_user_id uuid := auth.uid();
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_nome text := nullif(auth.jwt() #>> '{user_metadata,name}', '');
  v_usuario public.usuarios;
begin
  if v_auth_user_id is null or v_email = '' then
    raise exception 'Usuario autenticado com email é obrigatório.' using errcode = '28000';
  end if;

  insert into public.usuarios (auth_user_id, email, nome)
  values (v_auth_user_id, v_email, v_nome)
  on conflict (auth_user_id) do update
    set email = excluded.email,
        nome = coalesce(excluded.nome, public.usuarios.nome),
        atualizado_em = now()
  returning * into v_usuario;

  return v_usuario;
end;
$$;

create or replace function public.current_usuario_is_admin()
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists (
    select 1
    from public.admin_authorizations admin_auth
    where admin_auth.status = 'active'
      and (
        admin_auth.auth_user_id = auth.uid()
        or lower(admin_auth.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

create or replace function public.autorizar_coordenador(p_email text, p_nome text default null)
returns table (id uuid, email text, nome text, status public.coordenador_authorization_status)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_admin public.usuarios;
begin
  if v_email = '' then
    raise exception 'Informe o email do Coordenador.' using errcode = '22023';
  end if;

  v_admin := public.current_usuario();

  if not public.current_usuario_is_admin() then
    raise exception 'Apenas Admin pode autorizar Coordenador.' using errcode = '42501';
  end if;

  return query
  insert into public.coordenador_authorizations as autorizacao (
    email,
    nome,
    authorized_by_admin_usuario_id,
    status,
    atualizado_em
  )
  values (
    v_email,
    nullif(trim(coalesce(p_nome, '')), ''),
    v_admin.id,
    'active',
    now()
  )
  on conflict (email) do update
    set nome = coalesce(excluded.nome, autorizacao.nome),
        authorized_by_admin_usuario_id = excluded.authorized_by_admin_usuario_id,
        status = 'active',
        atualizado_em = now()
  returning autorizacao.id, autorizacao.email, autorizacao.nome, autorizacao.status;
end;
$$;

create or replace function public.criar_igreja_local(p_nome text)
returns table (id uuid, nome text)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_nome text := trim(coalesce(p_nome, ''));
  v_usuario public.usuarios;
  v_autorizacao public.coordenador_authorizations;
  v_igreja public.igrejas_locais;
begin
  if v_nome = '' then
    raise exception 'Informe o nome da Igreja Local.' using errcode = '22023';
  end if;

  v_usuario := public.current_usuario();

  select * into v_autorizacao
  from public.coordenador_authorizations autorizacao
  where autorizacao.status = 'active'
    and (
      autorizacao.usuario_id = v_usuario.id
      or lower(autorizacao.email) = lower(v_usuario.email)
    )
  limit 1;

  if v_autorizacao.id is null then
    raise exception 'Admin precisa autorizar este Usuario como Coordenador antes de criar uma Igreja Local.' using errcode = '42501';
  end if;

  if v_autorizacao.usuario_id is null then
    update public.coordenador_authorizations
    set usuario_id = v_usuario.id,
        activated_at = coalesce(activated_at, now()),
        atualizado_em = now()
    where id = v_autorizacao.id;
  end if;

  if exists (
    select 1
    from public.igreja_local_membros membro
    where membro.usuario_id = v_usuario.id
      and membro.papel = 'coordenador'
  ) then
    raise exception 'Você já coordena uma Igreja Local.' using errcode = '23505';
  end if;

  insert into public.igrejas_locais (nome, criado_por_usuario_id)
  values (v_nome, v_usuario.id)
  returning * into v_igreja;

  insert into public.igreja_local_membros (igreja_local_id, usuario_id, papel)
  values (v_igreja.id, v_usuario.id, 'coordenador');

  return query select v_igreja.id, v_igreja.nome;
end;
$$;

revoke all on function public.current_usuario() from public;
revoke all on function public.current_usuario_is_admin() from public;
revoke all on function public.autorizar_coordenador(text, text) from public;
revoke all on function public.criar_igreja_local(text) from public;

grant execute on function public.current_usuario() to authenticated;
grant execute on function public.current_usuario_is_admin() to authenticated;
grant execute on function public.autorizar_coordenador(text, text) to authenticated;
grant execute on function public.criar_igreja_local(text) to authenticated;
