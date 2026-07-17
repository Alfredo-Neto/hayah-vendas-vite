import { useMutation } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

type EmailPasswordInput = {
  email: string;
  password: string;
};

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: EmailPasswordInput) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    },
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: async ({ email, password }: EmailPasswordInput) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    },
  });
}
