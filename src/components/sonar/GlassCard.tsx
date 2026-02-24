import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, glow, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-panel rounded-sonar p-6',
        'text-sonar-highlight-bright',
        glow && 'sonar-glow-hover',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
