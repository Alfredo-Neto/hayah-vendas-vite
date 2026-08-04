import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const authSessionQueryKey = ['auth', 'session'] as const;

export function useSessionQuery() {
  return useQuery({
    queryKey: authSessionQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!data.session) {
        return null;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        return null;
      }

      return {
        ...data.session,
        user: userData.user,
      };
    },
  });
}

export function useAuthSessionSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.setQueryData(authSessionQueryKey, null);
        return;
      }

      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [queryClient]);
}
