import { FormEvent, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageCard } from '@/components/PageCard';
import { useAuthorizeCoordenadorMutation } from '@/features/admin/adminMutations';
import { useUserAccessQuery } from '@/features/access/userAccess';

export function AdminPage() {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const authorizeCoordenador = useAuthorizeCoordenadorMutation();
  const access = useUserAccessQuery();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authorizeCoordenador.mutate({ email, nome });
  }

  if (access.isLoading) {
    return <PageCard eyebrow="Admin" title="Verificando acesso" description="Confirmando se você tem autorização de Admin..." />;
  }

  if (access.isError) {
    return (
      <PageCard eyebrow="Admin" title="Não foi possível verificar seu acesso" description="Tente sair e entrar novamente.">
        <CardContent>
          <Alert variant="destructive"><AlertDescription>{access.error.message}</AlertDescription></Alert>
        </CardContent>
      </PageCard>
    );
  }

  if (!access.data?.is_admin) {
    return (
      <PageCard
        eyebrow="Admin"
        title="Acesso não autorizado"
        description="Apenas Admin pode autorizar Coordenadores. Seu cadastro não tem permissão para esta área."
      />
    );
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
