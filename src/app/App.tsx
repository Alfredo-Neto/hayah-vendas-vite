import { Navigate, Route, Routes } from 'react-router';
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

export function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/convites/:code" element={<ConviteAceitePage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/igreja-local" element={<IgrejaLocalPage />} />
        <Route path="/edicoes" element={<EdicoesPage />} />
        <Route path="/equipes" element={<EquipesPage />} />
        <Route path="/convites" element={<ConvitesPage />} />
        <Route path="/vendas" element={<VendasPage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Route>
    </Routes>
  );
}
