import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { authSessionQueryKey } from './authQueries';

type EmailPasswordInput = {
  email: string;
  password: string;
};

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: EmailPasswordInput) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data.session;
    },
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    },
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: EmailPasswordInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data.session;
    },
    onSuccess: (session) => {
      queryClient.setQueryData(authSessionQueryKey, session);
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
    },
    onSettled: () => {
      queryClient.setQueryData(authSessionQueryKey, null);
      void queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
    },
  });
}
