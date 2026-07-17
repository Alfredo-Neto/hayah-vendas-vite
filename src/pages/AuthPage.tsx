import { FormEvent, useState } from 'react';
import { useSignInWithEmailMutation } from '../features/auth/authMutations';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const signIn = useSignInWithEmailMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn.mutate(email);
  }

  return (
    <section className="page-card">
      <p className="eyebrow">Autenticação</p>
      <h1>Entrar</h1>
      <p>Digite seu email para receber um link de acesso.</p>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Enviando...' : 'Enviar link de acesso'}
        </button>
      </form>
      {signIn.isSuccess ? <p className="success">Confira seu email para continuar.</p> : null}
      {signIn.isError ? <p className="error">{signIn.error.message}</p> : null}
    </section>
  );
}
