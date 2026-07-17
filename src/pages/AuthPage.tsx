import { FormEvent, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignInMutation, useSignUpMutation } from '../features/auth/authMutations';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('sign-up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useSignInMutation();
  const signUp = useSignUpMutation();
  const activeMutation = mode === 'sign-up' ? signUp : signIn;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeMutation.mutate({ email, password });
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">Autenticação</p>
        <CardTitle className="text-3xl">{mode === 'sign-up' ? 'Criar acesso' : 'Entrar'}</CardTitle>
        <CardDescription>
          {mode === 'sign-up'
            ? 'Crie seu acesso para cadastrar a Igreja Local e virar Coordenador inicial.'
            : 'Entre com email e senha para continuar.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <Button className="flex-1" type="button" variant={mode === 'sign-up' ? 'default' : 'ghost'} onClick={() => setMode('sign-up')}>
            Criar acesso
          </Button>
          <Button className="flex-1" type="button" variant={mode === 'sign-in' ? 'default' : 'ghost'} onClick={() => setMode('sign-in')}>
            Entrar
          </Button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} />
          </div>
          <Button type="submit" disabled={activeMutation.isPending}>
            {activeMutation.isPending ? 'Salvando...' : mode === 'sign-up' ? 'Criar acesso' : 'Entrar'}
          </Button>
        </form>
        {activeMutation.isSuccess ? (
          <Alert>
            <AlertDescription>
              {mode === 'sign-up'
                ? 'Acesso criado. Se o Supabase pedir confirmação, confira seu email antes de entrar.'
                : 'Entrada realizada. Agora crie ou continue sua Igreja Local.'}
            </AlertDescription>
          </Alert>
        ) : null}
        {activeMutation.isError ? <Alert variant="destructive"><AlertDescription>{activeMutation.error.message}</AlertDescription></Alert> : null}
      </CardContent>
    </Card>
  );
}
