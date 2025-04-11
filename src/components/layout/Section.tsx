import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export default function Section({ 
  children, 
  className, 
  align = 'left' 
}: SectionProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <section 
      className={cn(
        'py-12', 
        alignmentClasses[align], 
        className
      )}
    >
      {children}
    </section>
  );
}
