'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 3, gap = 'md', responsive = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          {
            'grid-cols-1': cols === 1 || (responsive && cols > 1),
            'sm:grid-cols-2': responsive && cols >= 2,
            'grid-cols-2': !responsive && cols === 2,
            'md:grid-cols-3': responsive && cols >= 3,
            'grid-cols-3': !responsive && cols === 3,
            'lg:grid-cols-4': responsive && cols >= 4,
            'grid-cols-4': !responsive && cols === 4,
            'xl:grid-cols-5': responsive && cols >= 5,
            'grid-cols-5': !responsive && cols === 5,
            '2xl:grid-cols-6': responsive && cols >= 6,
            'grid-cols-6': !responsive && cols === 6,
            'gap-0': gap === 'none',
            'gap-3': gap === 'sm',
            'gap-6': gap === 'md',
            'gap-8': gap === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';

export { Grid };
