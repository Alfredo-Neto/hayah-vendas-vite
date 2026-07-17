import { cn } from '@/lib/utils';

type UserAvatarProps = {
  name: string;
  className?: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

export function UserAvatar({ name, className }: UserAvatarProps) {
  return (
    <div
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground',
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
