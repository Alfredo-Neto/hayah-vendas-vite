create or replace function public.current_usuario_access()
returns table (
  is_admin boolean,
  is_coordenador_authorized boolean,
  is_coordenador boolean,
  coordenador_igreja_local_id uuid,
  status text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_usuario public.usuarios;
  v_is_admin boolean;
  v_is_coordenador_authorized boolean;
  v_coordenador_igreja_local_id uuid;
begin
  v_usuario := public.current_usuario();
  v_is_admin := public.current_usuario_is_admin();

  select exists (
    select 1
    from public.coordenador_authorizations autorizacao
    where autorizacao.status = 'active'
      and (
        autorizacao.usuario_id = v_usuario.id
        or (
          autorizacao.usuario_id is null
          and lower(autorizacao.email) = lower(v_usuario.email)
        )
      )
  ) into v_is_coordenador_authorized;

  select membro.igreja_local_id into v_coordenador_igreja_local_id
  from public.igreja_local_membros membro
  where membro.usuario_id = v_usuario.id
    and membro.papel = 'coordenador'
  limit 1;

  return query
  select
    v_is_admin,
    v_is_coordenador_authorized,
    v_is_coordenador_authorized and v_coordenador_igreja_local_id is not null,
    case when v_is_coordenador_authorized then v_coordenador_igreja_local_id else null end,
    case
      when v_is_coordenador_authorized and v_coordenador_igreja_local_id is not null then 'coordenador'
      when v_is_coordenador_authorized then 'coordenador_authorized'
      when v_is_admin then 'admin'
      else 'pending_admin_authorization'
    end;
end;
$$;

create or replace function public.current_usuario_can_operate_igreja_local(p_igreja_local_id uuid)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.usuarios usuario
    join public.coordenador_authorizations autorizacao
      on autorizacao.status = 'active'
      and (
        autorizacao.usuario_id = usuario.id
        or (
          autorizacao.usuario_id is null
          and lower(autorizacao.email) = lower(usuario.email)
        )
      )
    join public.igreja_local_membros membro
      on membro.usuario_id = usuario.id
      and membro.papel = 'coordenador'
      and membro.igreja_local_id = p_igreja_local_id
    where p_igreja_local_id is not null
      and usuario.auth_user_id = auth.uid()
  );
$$;

create or replace function public.edicao_belongs_to_igreja_local(p_edicao_id uuid, p_igreja_local_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.edicoes edicao
    where edicao.id = p_edicao_id
      and edicao.igreja_local_id = p_igreja_local_id
  );
$$;

create or replace function public.equipe_belongs_to_edicao_igreja_local(p_equipe_id uuid, p_edicao_id uuid, p_igreja_local_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.equipes equipe
    where equipe.id = p_equipe_id
      and equipe.edicao_id = p_edicao_id
      and equipe.igreja_local_id = p_igreja_local_id
  );
$$;

create or replace function public.convite_context_belongs_to_igreja_local(
  p_edicao_id uuid,
  p_equipe_id uuid,
  p_igreja_local_id uuid
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select (p_edicao_id is null or public.edicao_belongs_to_igreja_local(p_edicao_id, p_igreja_local_id))
    and (
      p_equipe_id is null
      or exists (
        select 1
        from public.equipes equipe
        where equipe.id = p_equipe_id
          and equipe.igreja_local_id = p_igreja_local_id
          and (p_edicao_id is null or equipe.edicao_id = p_edicao_id)
      )
    );
$$;

alter table public.edicoes enable row level security;
alter table public.equipes enable row level security;
alter table public.convites enable row level security;
alter table public.edicao_assignments enable row level security;
alter table public.fechamentos_equipe enable row level security;

create policy edicoes_operate_coordenador_authorized on public.edicoes
  for all to authenticated
  using (public.current_usuario_can_operate_igreja_local(igreja_local_id))
  with check (public.current_usuario_can_operate_igreja_local(igreja_local_id));

create policy equipes_operate_coordenador_authorized on public.equipes
  for all to authenticated
  using (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.edicao_belongs_to_igreja_local(edicao_id, igreja_local_id)
  )
  with check (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.edicao_belongs_to_igreja_local(edicao_id, igreja_local_id)
  );

create policy convites_operate_coordenador_authorized on public.convites
  for all to authenticated
  using (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.convite_context_belongs_to_igreja_local(edicao_id, equipe_id, igreja_local_id)
  )
  with check (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.convite_context_belongs_to_igreja_local(edicao_id, equipe_id, igreja_local_id)
  );

create policy edicao_assignments_operate_coordenador_authorized on public.edicao_assignments
  for all to authenticated
  using (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.equipe_belongs_to_edicao_igreja_local(equipe_id, edicao_id, igreja_local_id)
  )
  with check (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.equipe_belongs_to_edicao_igreja_local(equipe_id, edicao_id, igreja_local_id)
  );

create policy fechamentos_equipe_operate_coordenador_authorized on public.fechamentos_equipe
  for all to authenticated
  using (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.equipe_belongs_to_edicao_igreja_local(equipe_id, edicao_id, igreja_local_id)
  )
  with check (
    public.current_usuario_can_operate_igreja_local(igreja_local_id)
    and public.equipe_belongs_to_edicao_igreja_local(equipe_id, edicao_id, igreja_local_id)
  );

revoke all on function public.current_usuario_access() from public;
revoke all on function public.current_usuario_can_operate_igreja_local(uuid) from public;
revoke all on function public.edicao_belongs_to_igreja_local(uuid, uuid) from public;
revoke all on function public.equipe_belongs_to_edicao_igreja_local(uuid, uuid, uuid) from public;
revoke all on function public.convite_context_belongs_to_igreja_local(uuid, uuid, uuid) from public;
grant execute on function public.current_usuario_access() to authenticated;
grant execute on function public.current_usuario_can_operate_igreja_local(uuid) to authenticated;
grant execute on function public.edicao_belongs_to_igreja_local(uuid, uuid) to authenticated;
grant execute on function public.equipe_belongs_to_edicao_igreja_local(uuid, uuid, uuid) to authenticated;
grant execute on function public.convite_context_belongs_to_igreja_local(uuid, uuid, uuid) to authenticated;
