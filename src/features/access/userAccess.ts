import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type UserAccess = {
  is_admin: boolean;
  is_coordenador_authorized: boolean;
  is_coordenador: boolean;
  coordenador_igreja_local_id: string | null;
  status: 'admin' | 'coordenador' | 'coordenador_authorized' | 'pending_admin_authorization';
};

export const userAccessQueryKey = ['auth', 'access'] as const;

export async function getUserAccess(): Promise<UserAccess> {
  const { data, error } = await supabase.rpc('current_usuario_access').single();

  if (error) {
    throw error;
  }

  return data as UserAccess;
}

export function useUserAccessQuery() {
  return useQuery({
    queryKey: userAccessQueryKey,
    queryFn: getUserAccess,
  });
}

export function canOperateAsCoordenador(access: UserAccess | undefined) {
  return Boolean(access?.is_coordenador || access?.is_coordenador_authorized);
}
