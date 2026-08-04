import { supabase } from '@/lib/supabase';

type AuthorizeCoordenadorInput = {
  email: string;
  nome?: string;
};

export async function authorizeCoordenador(input: AuthorizeCoordenadorInput) {
  const email = input.email.trim().toLowerCase();
  const nome = input.nome?.trim() || null;

  if (!email) {
    throw new Error('Informe o email do Coordenador.');
  }

  const { data, error } = await supabase
    .rpc('autorizar_coordenador', {
      p_email: email,
      p_nome: nome,
    })
    .single();

  if (error) {
    throw error;
  }

  return data;
}
