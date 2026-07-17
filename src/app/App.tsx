import { createRootRoute, createRoute, createRouter, Navigate, RouterProvider } from '@tanstack/react-router';
import { AppLayout } from './AppLayout';
import { AuthPage } from '../pages/AuthPage';
import { ConviteAceitePage } from '../pages/ConviteAceitePage';
import { ConvitesPage } from '../pages/ConvitesPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EdicoesPage } from '../pages/EdicoesPage';
import { EquipesPage } from '../pages/EquipesPage';
import { IgrejaLocalPage } from '../pages/IgrejaLocalPage';
import { RankingPage } from '../pages/RankingPage';
import { VendasPage } from '../pages/VendasPage';

const rootRoute = createRootRoute();

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

const conviteAceiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/convites/$code',
  component: ConviteAceitePage,
});

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  component: () => <Navigate to="/dashboard" replace />,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const igrejaLocalRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/igreja-local',
  component: IgrejaLocalPage,
});

const edicoesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/edicoes',
  component: EdicoesPage,
});

const equipesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/equipes',
  component: EquipesPage,
});

const convitesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/convites',
  component: ConvitesPage,
});

const vendasRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/vendas',
  component: VendasPage,
});

const rankingRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/ranking',
  component: RankingPage,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  conviteAceiteRoute,
  appRoute.addChildren([
    indexRoute,
    dashboardRoute,
    igrejaLocalRoute,
    edicoesRoute,
    equipesRoute,
    convitesRoute,
    vendasRoute,
    rankingRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}
