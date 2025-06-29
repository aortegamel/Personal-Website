import React, { forwardRef, useRef } from 'react';
import { useRelativeMousePosition } from '@/hooks/useMousePosition';
import { useScrollAnimation } from '@/hooks/useIntersectionObserver';
import { composeClasses } from '@/lib/ui-utils';

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'abyss' | 'ocean' | 'glass';
  hoverEffect?: 'float' | 'glow' | 'scale' | 'none';
  scrollAnimation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'none';
  animationDelay?: number;
  hoverBorder?: boolean;
  mouseGlow?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Pure function for variant classes
const getVariantClass = (variant: AnimatedCardProps['variant']) => {
  const variants = {
    default: 'card',
    abyss: 'card-abyss',
    ocean: 'card-ocean',
    glass: 'card-glass',
  };
  return variants[variant || 'default'];
};

// Pure function for hover classes
const getHoverClass = (effect: AnimatedCardProps['hoverEffect']) => {
  const effects = {
    float: 'card-hover-float',
    glow: 'card-hover-glow',
    scale: 'card-hover-scale',
    none: '',
  };
  return effects[effect || 'none'];
};

// Pure function for scroll animation classes
const getScrollClass = (animation: AnimatedCardProps['scrollAnimation']) => {
  const animations = {
    fadeIn: 'scroll-fade-in',
    slideUp: 'scroll-slide-up',
    slideDown: 'scroll-slide-down',
    slideLeft: 'scroll-slide-left',
    slideRight: 'scroll-slide-right',
    scaleIn: 'scroll-scale-in',
    none: '',
  };
  return animations[animation || 'none'];
};

// Pure component for animated border overlay
const AnimatedBorder = () => (
  <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bitcoin-500/20 via-ocean-primary/20 to-bitcoin-500/20 animate-gradient-x" />
  </div>
);

// Pure component for ocean wave effect
const OceanWave = () => (
  <div className="ocean-wave absolute inset-0 rounded-xl pointer-events-none" />
);

// Pure component for abyss background pattern
const AbyssPattern = () => (
  <div className="absolute inset-0 opacity-5 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-500/10 via-transparent to-ocean-primary/10" />
  </div>
);

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      variant = 'default',
      hoverEffect = 'float',
      scrollAnimation = 'fadeIn',
      animationDelay = 0,
      hoverBorder = false,
      mouseGlow = false,
      className = '',
      children,
      style,
      ...props
    },
    forwardedRef
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    // Use custom hooks for cleaner code
    const { ref: scrollRef, isVisible } = useScrollAnimation(0.1);
    const { relativeX, relativeY } = useRelativeMousePosition(cardRef, mouseGlow);
    
    // Combine refs
    const setRefs = (el: HTMLDivElement | null) => {
      cardRef.current = el;
      scrollRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };
    
    // Build class names functionally
    const animatedClassName = composeClasses(
      getVariantClass(variant),
      hoverEffect !== 'none' && getHoverClass(hoverEffect),
      scrollAnimation !== 'none' && getScrollClass(scrollAnimation),
      scrollAnimation !== 'none' && isVisible && 'in-view',
      hoverBorder && 'hover:border-bitcoin-500/50',
      mouseGlow && 'card-modern',
      className
    );
    
    // Build styles with mouse position
    const animatedStyle = {
      ...style,
      animationDelay: animationDelay ? `${animationDelay}ms` : undefined,
      '--mouse-x': mouseGlow ? `${(relativeX + 1) * 50}%` : undefined,
      '--mouse-y': mouseGlow ? `${(relativeY + 1) * 50}%` : undefined,
    } as React.CSSProperties;

    return (
      <div
        ref={setRefs}
        className={animatedClassName}
        style={animatedStyle}
        {...props}
      >
        {hoverBorder && <AnimatedBorder />}
        {variant === 'ocean' && <OceanWave />}
        <div className="relative z-10">{children}</div>
        {variant === 'abyss' && <AbyssPattern />}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;