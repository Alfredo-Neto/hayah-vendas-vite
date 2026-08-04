import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { canOperateAsCoordenador, useUserAccessQuery } from './userAccess';

type CoordenadorAccessGateProps = {
  children: ReactNode;
  title?: string;
  description?: string;
};

export function CoordenadorAccessGate({
  children,
  title = 'Acesso de Coordenador pendente',
  description = 'Seu acesso foi criado, mas um Admin ainda precisa autorizar você como Coordenador antes de administrar Igreja Local, Edições, Equipes ou Convites.',
}: CoordenadorAccessGateProps) {
  const access = useUserAccessQuery();

  if (access.isLoading) {
    return (
      <PageCard eyebrow="Autorização" title="Verificando acesso" description="Confirmando sua autorização de Coordenador..." />
    );
  }

  if (access.isError) {
    return (
      <PageCard eyebrow="Autorização" title="Não foi possível verificar seu acesso" description="Tente sair e entrar novamente.">
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{access.error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </PageCard>
    );
  }

  if (!canOperateAsCoordenador(access.data)) {
    return (
      <PageCard eyebrow="Autorização" title={title} description={description}>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Cadastro recebido. Aguarde um Admin autorizar seu acesso de Coordenador ou entre com um email já autorizado.
            </AlertDescription>
          </Alert>
          <Button asChild variant="outline">
            <Link to="/dashboard">Voltar ao início</Link>
          </Button>
        </CardContent>
      </PageCard>
    );
  }

  return children;
}
