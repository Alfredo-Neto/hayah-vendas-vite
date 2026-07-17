import { NavLink, Outlet } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Visão Geral' },
  { href: '/igreja-local', label: 'Igreja Local' },
  { href: '/edicoes', label: 'Edições' },
  { href: '/equipes', label: 'Equipes' },
  { href: '/convites', label: 'Convites' },
  { href: '/vendas', label: 'Vendas' },
  { href: '/ranking', label: 'Ranking' },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="border-b bg-card lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="px-6 py-5 text-lg font-semibold tracking-tight">Hayah Vendas</div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:overflow-visible">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                'shrink-0 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground',
              )}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
