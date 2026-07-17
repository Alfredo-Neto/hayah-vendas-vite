import { FormEvent, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignInWithEmailMutation } from '../features/auth/authMutations';

export function AuthPage() {
  const [email, setEmail] = useState('');
  const signIn = useSignInWithEmailMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn.mutate(email);
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">Autenticação</p>
        <CardTitle className="text-3xl">Entrar</CardTitle>
        <CardDescription>Digite seu email para receber um link de acesso.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </div>
          <Button type="submit" disabled={signIn.isPending}>
          {signIn.isPending ? 'Enviando...' : 'Enviar link de acesso'}
          </Button>
        </form>
        {signIn.isSuccess ? <Alert><AlertDescription>Confira seu email para continuar.</AlertDescription></Alert> : null}
        {signIn.isError ? <Alert variant="destructive"><AlertDescription>{signIn.error.message}</AlertDescription></Alert> : null}
      </CardContent>
    </Card>
  );
}
