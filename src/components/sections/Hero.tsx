import React from 'react';
import { cn } from '@/lib/utils';
import Section from '../layout/Section';
import { Button } from '../ui/Button';

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function Hero({
  title,
  description,
  ctaText = 'Learn More',
  ctaLink = '#',
  className,
  ...props
}: HeroProps) {
  return (
    <Section 
      className={cn(
        'bg-gradient-to-b from-gray-50 to-white',
        className
      )}
      align="center"
    >
      <div 
        className="container mx-auto px-4 py-16 text-center"
        {...props}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          {description}
        </p>
        <Button 
          href={ctaLink}
          variant="default"
        >
          {ctaText}
        </Button>
      </div>
    </Section>
  );
}
