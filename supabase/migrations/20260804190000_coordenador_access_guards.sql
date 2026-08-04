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

revoke all on function public.current_usuario_access() from public;
grant execute on function public.current_usuario_access() to authenticated;
