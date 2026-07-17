import { supabase } from '../../lib/supabase';

type CreateIgrejaLocalInput = {
  nome: string;
};

export async function createIgrejaLocal(input: CreateIgrejaLocalInput) {
  const nome = input.nome.trim();

  if (!nome) {
    throw new Error('Informe o nome da Igreja Local.');
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const authUser = sessionData.session?.user;

  if (!authUser?.email) {
    throw new Error('Entre com seu email antes de criar uma Igreja Local.');
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .upsert({
      auth_user_id: authUser.id,
      email: authUser.email,
      nome: authUser.user_metadata.name ?? authUser.user_metadata.full_name ?? null,
    }, { onConflict: 'auth_user_id' })
    .select('id')
    .single();

  if (usuarioError) {
    throw usuarioError;
  }

  const { data: coordenadorExistente, error: coordenadorError } = await supabase
    .from('igreja_local_membros')
    .select('id')
    .eq('usuario_id', usuario.id)
    .eq('papel', 'coordenador')
    .maybeSingle();

  if (coordenadorError) {
    throw coordenadorError;
  }

  if (coordenadorExistente) {
    throw new Error('Você já coordena uma Igreja Local.');
  }

  const { data: igrejaLocal, error: igrejaError } = await supabase
    .from('igrejas_locais')
    .insert({
      nome,
      criado_por_usuario_id: usuario.id,
    })
    .select('id, nome')
    .single();

  if (igrejaError) {
    throw igrejaError;
  }

  const { error: membroError } = await supabase
    .from('igreja_local_membros')
    .insert({
      igreja_local_id: igrejaLocal.id,
      usuario_id: usuario.id,
      papel: 'coordenador',
    });

  if (membroError) {
    throw membroError;
  }

  return igrejaLocal;
}
