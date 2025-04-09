'use client';

import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bitcoin-500 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-deepSea-shallow hover:bg-deepSea-middle text-white',
        bitcoin: 'bg-bitcoin-500 hover:bg-bitcoin-600 text-deepSea-abyss shadow-bitcoin hover:shadow-bitcoin-lg',
        outline: 'border border-abyss-400/30 bg-transparent hover:bg-deepSea-middle/10 text-abyss-100',
        ghost: 'hover:bg-deepSea-middle/10 text-abyss-100 hover:text-white',
        link: 'text-bitcoin-400 hover:text-bitcoin-300 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  external?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, external, children, ...props }, ref) => {
    if (href) {
      const linkProps = external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
      
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          {...linkProps}
        >
          {children}
        </Link>
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
