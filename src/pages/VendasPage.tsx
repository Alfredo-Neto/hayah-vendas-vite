import { CoordenadorAccessGate } from '@/features/access/CoordenadorAccessGate';
import { PageCard } from '@/components/PageCard';

export function VendasPage() {
  return (
    <CoordenadorAccessGate>
      <PageCard
        eyebrow="Líder"
        title="Vendas"
        description="Scaffold para o Líder registrar uma Venda da sua Equipe."
      />
    </CoordenadorAccessGate>
  );
}
