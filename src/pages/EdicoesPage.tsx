import { CoordenadorAccessGate } from '@/features/access/CoordenadorAccessGate';
import { PageCard } from '@/components/PageCard';

export function EdicoesPage() {
  return (
    <CoordenadorAccessGate>
      <PageCard
        eyebrow="Edição"
        title="Edições"
        description="Scaffold para criar uma Edição ativa dentro da Igreja Local."
      />
    </CoordenadorAccessGate>
  );
}
