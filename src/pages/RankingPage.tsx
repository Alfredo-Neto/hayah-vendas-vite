import { CoordenadorAccessGate } from '@/features/access/CoordenadorAccessGate';
import { PageCard } from '@/components/PageCard';

export function RankingPage() {
  return (
    <CoordenadorAccessGate>
      <PageCard
        eyebrow="Resultado"
        title="Ranking"
        description="Scaffold para o Coordenador ver o total de Vendas por Equipe."
      />
    </CoordenadorAccessGate>
  );
}
