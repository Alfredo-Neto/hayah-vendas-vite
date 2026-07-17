import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type PageCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  standalone?: boolean;
};

export function PageCard({ eyebrow, title, description, standalone = false }: PageCardProps) {
  return (
    <Card className={standalone ? 'mx-auto mt-12 max-w-xl' : 'max-w-xl'}>
      <CardHeader>
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
