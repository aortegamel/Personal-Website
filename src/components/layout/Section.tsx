'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  containerClassName?: string;
  withContainer?: boolean;
  as?: 'section' | 'div' | 'article' | 'aside';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    containerSize = 'lg', 
    containerClassName,
    withContainer = true,
    as: Component = 'section',
    children,
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn('py-12', className)}
        {...props}
      >
        {withContainer ? (
          <Container size={containerSize} className={containerClassName}>
            {children}
          </Container>
        ) : (
          children
        )}
      </Component>
    );
  }
);

Section.displayName = 'Section';

export { Section };
