import React, { forwardRef, useEffect, useRef, useState } from 'react';

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'default' | 'abyss' | 'ocean' | 'glass';
  /** Hover animation type */
  hoverEffect?: 'float' | 'glow' | 'scale' | 'none';
  /** Scroll animation type */
  scrollAnimation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'none';
  /** Animation delay in milliseconds */
  animationDelay?: number;
  /** Whether to show border on hover */
  hoverBorder?: boolean;
  /** Track mouse position for glow effect */
  mouseGlow?: boolean;
  /** Custom className */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

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
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    // Scroll animation observer
    useEffect(() => {
      if (scrollAnimation === 'none' || !cardRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(cardRef.current);

      return () => observer.disconnect();
    }, [scrollAnimation]);

    // Mouse tracking for glow effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mouseGlow || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    // Variant classes
    const variantClasses = {
      default: 'card',
      abyss: 'card-abyss',
      ocean: 'card-ocean',
      glass: 'card-glass',
    };

    // Hover effect classes
    const hoverClasses = {
      float: 'card-hover-float',
      glow: 'card-hover-glow',
      scale: 'card-hover-scale',
      none: '',
    };

    // Scroll animation classes
    const scrollClasses = {
      fadeIn: 'scroll-fade-in',
      slideUp: 'scroll-slide-up',
      slideDown: 'scroll-slide-down',
      slideLeft: 'scroll-slide-left',
      slideRight: 'scroll-slide-right',
      scaleIn: 'scroll-scale-in',
      none: '',
    };

    const combinedClassName = `
      ${variantClasses[variant]}
      ${hoverEffect !== 'none' ? hoverClasses[hoverEffect] : ''}
      ${scrollAnimation !== 'none' ? scrollClasses[scrollAnimation] : ''}
      ${scrollAnimation !== 'none' && isInView ? 'in-view' : ''}
      ${hoverBorder ? 'hover:border-bitcoin-500/50' : ''}
      ${mouseGlow ? 'card-modern' : ''}
      ${className}
    `.trim();

    const style = {
      ...props.style,
      animationDelay: animationDelay ? `${animationDelay}ms` : undefined,
      '--mouse-x': mouseGlow ? `${mousePosition.x}%` : undefined,
      '--mouse-y': mouseGlow ? `${mousePosition.y}%` : undefined,
    } as React.CSSProperties;

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className={combinedClassName}
        onMouseMove={handleMouseMove}
        style={style}
        {...props}
      >
        {/* Animated border overlay */}
        {hoverBorder && (
          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-bitcoin-500/20 via-ocean-primary/20 to-bitcoin-500/20 animate-gradient-x" />
          </div>
        )}

        {/* Ocean wave effect for ocean variant */}
        {variant === 'ocean' && (
          <div className="ocean-wave absolute inset-0 rounded-xl pointer-events-none" />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>

        {/* Subtle background pattern */}
        {variant === 'abyss' && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-bitcoin-500/10 via-transparent to-ocean-primary/10" />
          </div>
        )}
      </div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export default AnimatedCard;