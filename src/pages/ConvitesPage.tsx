import { CoordenadorAccessGate } from '@/features/access/CoordenadorAccessGate';
import { PageCard } from '@/components/PageCard';

export function ConvitesPage() {
  return (
    <CoordenadorAccessGate>
      <PageCard
        eyebrow="Convite"
        title="Convites"
        description="Scaffold para gerar link de Convite de Líder para uma Equipe."
      />
    </CoordenadorAccessGate>
  );
}
