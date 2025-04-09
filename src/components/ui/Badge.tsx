'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-deepSea-deep/70 text-abyss-100',
        primary: 'bg-deepSea-shallow text-white',
        secondary: 'bg-deepSea-middle/50 text-abyss-100',
        bitcoin: 'bg-bitcoin-500/90 text-deepSea-abyss',
        outline: 'border border-abyss-400/30 text-abyss-100',
        category: 'bg-deepSea-deep/70 text-bitcoin-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
