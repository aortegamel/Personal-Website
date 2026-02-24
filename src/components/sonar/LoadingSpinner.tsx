import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-2 border-sonar-blue/30" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sonar-signal animate-spin" />
      <div className="absolute inset-2 rounded-full border border-sonar-signal/20" />
    </div>
  );
}
