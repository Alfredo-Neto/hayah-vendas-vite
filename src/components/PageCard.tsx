import type { ReactNode } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type PageCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  standalone?: boolean;
  children?: ReactNode;
};

export function PageCard({ eyebrow, title, description, standalone = false, children }: PageCardProps) {
  const card = (
    <Card className={cn('hayah-card border shadow-none', standalone ? 'mx-auto max-w-xl' : 'max-w-2xl')}>
      <CardHeader>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">{eyebrow}</p>
        <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );

  if (standalone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        {card}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {card}
    </div>
  );
}
