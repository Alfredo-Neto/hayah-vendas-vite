import { FormEvent, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageCard } from '@/components/PageCard';
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
    return (
      <PageCard
        eyebrow="Coordenador"
        title="Igreja Local"
        description="Carregando sessão..."
      />
    );
  }

  if (!session.data) {
    return (
      <PageCard
        eyebrow="Coordenador"
        title="Igreja Local"
        description="Entre com seu email antes de criar uma Igreja Local."
      >
        <CardContent>
          <Button asChild><Link to="/auth">Entrar</Link></Button>
        </CardContent>
      </PageCard>
    );
  }

  return (
    <PageCard
      eyebrow="Coordenador"
      title="Igreja Local"
      description="Crie a Igreja Local que vai organizar Edições, Equipes, Convites e Vendas."
    >
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="nome-igreja">Nome da Igreja Local</Label>
            <Input id="nome-igreja" value={nome} onChange={(event) => setNome(event.target.value)} required minLength={3} />
          </div>
          <Button type="submit" disabled={createIgreja.isPending}>
            {createIgreja.isPending ? 'Criando...' : 'Criar Igreja Local'}
          </Button>
        </form>
        {createIgreja.isSuccess ? (
          <Alert><AlertDescription>Igreja Local criada: {createIgreja.data.nome}</AlertDescription></Alert>
        ) : null}
        {createIgreja.isError ? <Alert variant="destructive"><AlertDescription>{createIgreja.error.message}</AlertDescription></Alert> : null}
      </CardContent>
    </PageCard>
  );
}
