import { FormEvent, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageCard } from '@/components/PageCard';
import { useAuthorizeCoordenadorMutation } from '@/features/admin/adminMutations';

export function AdminPage() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const authorizeCoordenador = useAuthorizeCoordenadorMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authorizeCoordenador.mutate({ email, nome });
  }

  return (
    <PageCard
      eyebrow="Admin"
      title="Autorizar Coordenador"
      description="Crie ou autorize o acesso de um Coordenador antes que ele administre uma Igreja Local. Esta ação não cria Igreja Local."
    >
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="coordenador-email">Email do Coordenador</Label>
            <Input
              id="coordenador-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordenador-nome">Nome do Coordenador (opcional)</Label>
            <Input
              id="coordenador-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={authorizeCoordenador.isPending}>
            {authorizeCoordenador.isPending ? 'Autorizando...' : 'Autorizar Coordenador'}
          </Button>
        </form>

        {authorizeCoordenador.isSuccess ? (
          <Alert>
            <AlertDescription>
              Coordenador autorizado: {authorizeCoordenador.data.email}
            </AlertDescription>
          </Alert>
        ) : null}
        {authorizeCoordenador.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{authorizeCoordenador.error.message}</AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </PageCard>
  );
}
