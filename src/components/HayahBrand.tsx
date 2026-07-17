import { cn } from '@/lib/utils';

type HayahBrandProps = {
  className?: string;
  size?: 'sm' | 'md';
};

export function HayahBrand({ className, size = 'md' }: HayahBrandProps) {
  return (
    <div className={cn('flex items-baseline gap-1.5', className)}>
      <span
        className={cn(
          'font-bold tracking-tight text-foreground',
          size === 'sm' ? 'text-base' : 'text-xl',
        )}
      >
        hayah
      </span>
      <span
        className={cn(
          'font-bold uppercase tracking-widest text-primary',
          size === 'sm' ? 'text-xs' : 'text-sm',
        )}
      >
        vendas
      </span>
    </div>
  );
}
