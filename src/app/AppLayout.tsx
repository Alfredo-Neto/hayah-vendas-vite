import { NavLink, Outlet } from 'react-router';

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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Hayah Vendas</div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
