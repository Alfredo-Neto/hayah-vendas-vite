import { FormEvent, useState } from 'react';
import { Link } from 'react-router';
import { useSessionQuery } from '../features/auth/authQueries';
import { useCreateIgrejaLocalMutation } from '../features/igreja-local/igrejaLocalMutations';

export function IgrejaLocalPage() {
  const [nome, setNome] = useState('');
  const session = useSessionQuery();
  const createIgreja = useCreateIgrejaLocalMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createIgreja.mutate({ nome });
  }

  if (session.isLoading) {
    return <section className="page-card">Carregando sessão...</section>;
  }

  if (!session.data) {
    return (
      <section className="page-card">
        <p className="eyebrow">Coordenador</p>
        <h1>Igreja Local</h1>
        <p>Entre com seu email antes de criar uma Igreja Local.</p>
        <Link className="button-link" to="/auth">Entrar</Link>
      </section>
    );
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Coordenador</p>
      <h1>Igreja Local</h1>
      <p>Crie a Igreja Local que vai organizar Edições, Equipes, Convites e Vendas.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome da Igreja Local</span>
          <input value={nome} onChange={(event) => setNome(event.target.value)} required minLength={3} />
        </label>
        <button type="submit" disabled={createIgreja.isPending}>
          {createIgreja.isPending ? 'Criando...' : 'Criar Igreja Local'}
        </button>
      </form>
      {createIgreja.isSuccess ? (
        <p className="success">Igreja Local criada: {createIgreja.data.nome}</p>
      ) : null}
      {createIgreja.isError ? <p className="error">{createIgreja.error.message}</p> : null}
    </section>
  );
}
