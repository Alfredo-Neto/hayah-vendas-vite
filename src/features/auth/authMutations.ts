import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export function useSignInWithEmailMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    },
  });
}
