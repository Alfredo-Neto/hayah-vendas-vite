import { useMutation } from '@tanstack/react-query';
import { authorizeCoordenador } from './authorizeCoordenador';

export function useAuthorizeCoordenadorMutation() {
  return useMutation({
    mutationFn: authorizeCoordenador,
  });
}
