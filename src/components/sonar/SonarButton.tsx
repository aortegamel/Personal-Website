'use client';

import { cn } from '@/lib/utils';

interface SonarButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function SonarButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  className,
  type = 'button',
}: SonarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        'px-6 py-3 rounded-sonar font-mono tracking-wide uppercase text-sm',
        'border transition-all duration-300',
        'hover:scale-105 active:scale-95 transition-transform',
        'focus:outline-none focus:ring-2 focus:ring-sonar-signal focus:ring-offset-2 focus:ring-offset-sonar-abyss',
        variant === 'primary' &&
          'bg-sonar-signal/20 border-sonar-signal text-sonar-highlight-bright hover:bg-sonar-signal/30 hover:shadow-sonar',
        variant === 'secondary' &&
          'bg-transparent border-sonar-blue text-sonar-blue hover:bg-sonar-blue/10',
        variant === 'danger' &&
          'bg-sonar-coral/20 border-sonar-coral text-sonar-coral hover:bg-sonar-coral/30',
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100',
        className
      )}
    >
      {children}
    </button>
  );
}
