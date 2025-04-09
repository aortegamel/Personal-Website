'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  withGradient?: boolean;
  centered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Hero({
  className,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  withGradient = true,
  centered = true,
  size = 'lg',
  ...props
}: HeroProps) {
  return (
    <Section
      className={cn(
        'relative overflow-hidden py-20',
        {
          'text-center': centered,
          'py-16': size === 'sm',
          'py-20': size === 'md',
          'py-24': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {/* Background elements */}
      {withGradient && (
        <>
          <div className="absolute inset-0 bg-abyss-radial opacity-30" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-abyss-400/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-abyss-400/50 to-transparent" />
        </>
      )}

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className={cn(
          'font-bold font-montserrat mb-6 tracking-tight',
          {
            'text-3xl md:text-4xl': size === 'sm',
            'text-4xl md:text-5xl': size === 'md',
            'text-5xl md:text-6xl': size === 'lg',
          }
        )}>
          {withGradient ? (
            <span className="abyss-gradient-text">{title}</span>
          ) : (
            title
          )}
        </h1>

        {subtitle && (
          <p className={cn(
            'text-abyss-100 mb-8 max-w-2xl mx-auto',
            {
              'text-lg': size === 'sm',
              'text-xl': size === 'md',
              'text-2xl': size === 'lg',
            }
          )}>
            {subtitle}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className={cn(
            'flex gap-4 mt-8',
            {
              'justify-center': centered,
              'flex-col sm:flex-row': true,
            }
          )}>
            {primaryAction && (
              <Button variant="bitcoin" size="lg" href={primaryAction.href}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" size="lg" href={secondaryAction.href}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
