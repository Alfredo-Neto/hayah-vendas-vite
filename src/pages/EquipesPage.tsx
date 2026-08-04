import { CoordenadorAccessGate } from '@/features/access/CoordenadorAccessGate';
import { PageCard } from '@/components/PageCard';

export function EquipesPage() {
  return (
    <CoordenadorAccessGate>
      <PageCard
        eyebrow="Equipe"
        title="Equipes"
        description="Scaffold para criar uma Equipe dentro da Edição e preparar o Convite de Líder."
      />
    </CoordenadorAccessGate>
  );
}
