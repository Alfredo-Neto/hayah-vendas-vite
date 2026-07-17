import { useMutation } from '@tanstack/react-query';
import { createIgrejaLocal } from './createIgrejaLocal';

export function useCreateIgrejaLocalMutation() {
  return useMutation({
    mutationFn: createIgrejaLocal,
  });
}
