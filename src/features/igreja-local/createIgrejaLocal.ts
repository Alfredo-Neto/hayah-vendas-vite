import { supabase } from '../../lib/supabase';

type CreateIgrejaLocalInput = {
  nome: string;
};

export async function createIgrejaLocal(input: CreateIgrejaLocalInput) {
  const nome = input.nome.trim();

  if (!nome) {
    throw new Error('Informe o nome da Igreja Local.');
  }

  const { data: igrejaLocal, error } = await supabase
    .rpc('criar_igreja_local', { p_nome: nome })
    .single();

  if (error) {
    throw error;
  }

  return igrejaLocal;
}
