import { Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  Mail,
  Receipt,
  Trophy,
} from 'lucide-react';
import { PageCard } from '@/components/PageCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CardContent } from '@/components/ui/card';
import { canOperateAsCoordenador, useUserAccessQuery } from '@/features/access/userAccess';
import { useSessionQuery } from '@/features/auth/authQueries';

function getDisplayName(email: string | undefined) {
  if (!email) return 'Coordenador';
  const local = email.split('@')[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

const featureCards = [
  {
    icon: CalendarDays,
    label: 'Edições',
    title: 'Gerencie suas Edições',
    description: 'Crie e acompanhe Edições ativas dentro da Igreja Local.',
    link: '/edicoes',
    linkText: 'Ver edições',
  },
  {
    icon: Mail,
    label: 'Convites',
    title: 'Convites de Líder',
    description: 'Gere e acompanhe convites para líderes de equipe.',
    link: '/convites',
    linkText: 'Ver convites',
  },
  {
    icon: Receipt,
    label: 'Vendas',
    title: 'Registre Vendas',
    description: 'Acompanhe as vendas registradas pelas equipes.',
    link: '/vendas',
    linkText: 'Ver vendas',
  },
  {
    icon: Trophy,
    label: 'Ranking',
    title: 'Ranking da Edição',
    description: 'Veja o desempenho das equipes em tempo real.',
    link: '/ranking',
    linkText: 'Ver ranking',
  },
];

export function DashboardPage() {
  const session = useSessionQuery();
  const access = useUserAccessQuery();
  const displayName = getDisplayName(session.data?.user?.email);

  if (access.isLoading) {
    return <PageCard eyebrow="Autorização" title="Verificando acesso" description="Confirmando suas permissões..." />;
  }

  if (access.isError) {
    return (
      <PageCard eyebrow="Autorização" title="Não foi possível verificar seu acesso" description="Tente sair e entrar novamente.">
        <CardContent>
          <Alert variant="destructive"><AlertDescription>{access.error.message}</AlertDescription></Alert>
        </CardContent>
      </PageCard>
    );
  }

  if (!canOperateAsCoordenador(access.data)) {
    return (
      <PageCard
        eyebrow="Acesso pendente"
        title={`Olá, ${displayName}.`}
        description="Seu cadastro está ativo, mas um Admin ainda precisa autorizar você como Coordenador antes de liberar o painel operacional."
      >
        <CardContent>
          <Alert>
            <AlertDescription>
              A criação de acesso em /auth não concede privilégios de Coordenador. Aguarde autorização do Admin ou entre com um email já autorizado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </PageCard>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <p className="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">
          Bem-vindo ao Hayah Vendas
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Olá, {displayName}.</h1>
        <p className="mt-2 text-muted-foreground">
          Sua jornada de gestão de vendas começa aqui.
        </p>
      </section>

      <Link to="/vendas" className="hayah-cta flex items-center gap-4 px-6 py-5 text-primary-foreground">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/15">
          <Receipt className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">Registrar Venda</p>
          <p className="text-sm text-white/80">
            Registre uma nova venda para sua equipe.
          </p>
        </div>
        <ArrowRight className="size-5 shrink-0 opacity-80" />
      </Link>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featureCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="hayah-card flex flex-col p-5">
              <div className="mb-4 flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {card.label}
                </span>
              </div>
              <h2 className="mb-2 font-semibold">{card.title}</h2>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{card.description}</p>
              <Link
                to={card.link}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80"
              >
                {card.linkText}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="hayah-banner px-8 py-10">
        <p className="relative text-xs font-semibold tracking-widest text-primary uppercase">
          Hayah Vendas
        </p>
        <h2 className="relative mt-2 text-2xl font-bold tracking-tight">
          Venda. O futuro já começou.
        </h2>
        <p className="relative mt-2 max-w-lg text-sm text-muted-foreground">
          Use esta plataforma para organizar Igrejas Locais, Edições, Equipes e acompanhar o ranking de vendas.
        </p>
      </div>
    </div>
  );
}
