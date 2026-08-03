import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Receipt,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { HayahBrand } from '@/components/HayahBrand';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { useSignOutMutation } from '@/features/auth/authMutations';
import { useSessionQuery } from '@/features/auth/authQueries';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/igreja-local', label: 'Igreja Local', icon: Building2 },
  { href: '/edicoes', label: 'Edições', icon: CalendarDays },
  { href: '/equipes', label: 'Equipes', icon: Users },
  { href: '/convites', label: 'Convites', icon: Mail },
  { href: '/vendas', label: 'Vendas', icon: Receipt },
  { href: '/ranking', label: 'Ranking', icon: Trophy },
];

function getDisplayName(email: string | undefined) {
  if (!email) return 'Coordenador';
  const local = email.split('@')[0] ?? email;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

type SidebarNavProps = {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )}
          >
            {isActive ? (
              <span className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
            ) : null}
            <Icon className={cn('size-4 shrink-0', isActive && 'text-primary')} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

type SidebarFooterProps = {
  displayName: string;
  email: string | undefined;
  onSignOut: () => void;
  isSigningOut: boolean;
};

function SidebarFooter({ displayName, email, onSignOut, isSigningOut }: SidebarFooterProps) {
  return (
    <div className="border-t border-border px-4 py-4">
      <div className="mb-3 flex items-center gap-3 px-1">
        <UserAvatar name={displayName} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{email ?? '—'}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        disabled={isSigningOut}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="size-4" />
        {isSigningOut ? 'Saindo...' : 'Sair'}
      </button>
    </div>
  );
}

export function AppLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const session = useSessionQuery();
  const signOut = useSignOutMutation();
  const email = session.data?.user?.email;
  const displayName = getDisplayName(email);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  function handleSignOut() {
    setMobileMenuOpen(false);
    signOut.mutate(undefined, {
      onSettled: () => {
        void navigate({ to: '/auth', replace: true });
      },
    });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="px-5 py-6">
          <HayahBrand />
        </div>

        <SidebarNav pathname={pathname} />

        <SidebarFooter displayName={displayName} email={email} onSignOut={handleSignOut} isSigningOut={signOut.isPending} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <Menu className="size-5" />
            </button>
            <HayahBrand size="sm" />
          </div>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={displayName} />
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{email ?? '—'}</p>
              </div>
            </div>
          </div>
        </header>

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="absolute inset-y-4 left-4 flex w-[min(18rem,calc(100%-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-sidebar shadow-2xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <HayahBrand size="sm" />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col overflow-y-auto py-3">
                <SidebarNav pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
              </div>

              <SidebarFooter displayName={displayName} email={email} onSignOut={handleSignOut} isSigningOut={signOut.isPending} />
            </aside>
          </div>
        ) : null}

        <main className="flex-1 px-6 py-8 lg:px-10">
          <Outlet />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-6 py-4 text-xs text-muted-foreground">
          <p>© Hayah Vendas — Plataforma de gestão de vendas</p>
          <div className="flex gap-4">
            <span>Política de Privacidade</span>
            <span>Termos de Uso</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
