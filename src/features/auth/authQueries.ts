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

      return data.session;
    },
  });
}

export function useAuthSessionSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [queryClient]);
}
