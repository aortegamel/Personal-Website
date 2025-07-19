'use client';

import React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cyberButtonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group',
  {
    variants: {
      variant: {
        // Primary cyberpunk button with neon glow
        cyber: `
          bg-transparent border-2 border-cyber-cyan text-cyber-cyan font-cyber-heading
          hover:bg-cyber-cyan hover:text-cyber-black hover:shadow-lg
          hover:shadow-cyber-cyan/50 transform hover:scale-105
          before:absolute before:inset-0 before:bg-cyber-cyan before:opacity-0 
          before:transition-opacity before:duration-300 hover:before:opacity-10
        `,
        // Magenta variant
        'cyber-magenta': `
          bg-transparent border-2 border-cyber-magenta text-cyber-magenta font-cyber-heading
          hover:bg-cyber-magenta hover:text-cyber-black hover:shadow-lg
          hover:shadow-cyber-magenta/50 transform hover:scale-105
          before:absolute before:inset-0 before:bg-cyber-magenta before:opacity-0 
          before:transition-opacity before:duration-300 hover:before:opacity-10
        `,
        // Green matrix style
        'cyber-green': `
          bg-transparent border-2 border-cyber-green text-cyber-green font-cyber-body
          hover:bg-cyber-green hover:text-cyber-black hover:shadow-lg
          hover:shadow-cyber-green/50 transform hover:scale-105
          before:absolute before:inset-0 before:bg-cyber-green before:opacity-0 
          before:transition-opacity before:duration-300 hover:before:opacity-10
        `,
        // Filled cyberpunk style
        'cyber-filled': `
          bg-gradient-to-r from-cyber-cyan to-cyber-magenta text-cyber-black font-cyber-heading
          hover:from-cyber-magenta hover:to-cyber-cyan hover:shadow-xl
          hover:shadow-cyber-cyan/30 transform hover:scale-105
          border-2 border-transparent
        `,
        // Ghost cyberpunk style
        'cyber-ghost': `
          bg-transparent text-cyber-cyan font-cyber-body
          hover:bg-cyber-cyan/10 hover:text-cyber-cyan
          hover:shadow-md hover:shadow-cyber-cyan/20
          border-2 border-transparent hover:border-cyber-cyan/30
        `,
        // HUD style button
        'cyber-hud': `
          bg-cyber-black/50 border border-cyber-ui text-cyber-text-primary font-cyber-body
          hover:bg-cyber-dark/70 hover:border-cyber-cyan hover:text-cyber-cyan
          hover:shadow-md hover:shadow-cyber-cyan/20
          backdrop-filter blur-sm
        `,
        // Glitch style button
        'cyber-glitch': `
          bg-transparent border-2 border-cyber-orange text-cyber-orange font-cyber-heading
          hover:bg-cyber-orange hover:text-cyber-black
          hover:shadow-lg hover:shadow-cyber-orange/50
          animate-cyber-glitch hover:animate-none
        `,
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded',
        default: 'h-10 px-4 py-2 text-sm rounded-md',
        lg: 'h-12 px-6 text-base rounded-lg',
        xl: 'h-14 px-8 text-lg rounded-xl',
        icon: 'h-9 w-9 rounded-md',
      },
      intensity: {
        low: '',
        medium: 'animate-cyber-pulse',
        high: 'animate-cyber-glow',
        extreme: 'animate-cyber-flicker',
      },
    },
    defaultVariants: {
      variant: 'cyber',
      size: 'default',
      intensity: 'low',
    },
  }
);

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  href?: string;
  external?: boolean;
  /**
   * Whether to show corner brackets for HUD effect
   */
  showCorners?: boolean;
  /**
   * Whether to show scan line effect on hover
   */
  showScanline?: boolean;
}

/**
 * CyberButton Component
 * 
 * A cyberpunk-themed button component with multiple visual variants.
 * Features neon glow effects, HUD styling, and animated interactions.
 * 
 * Features:
 * - Multiple cyberpunk color variants (cyan, magenta, green, orange)
 * - Different styles (outline, filled, ghost, HUD, glitch)
 * - Configurable intensity levels with animations
 * - Optional corner brackets and scan line effects
 * - Supports both button and link functionality
 */
const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    intensity,
    href, 
    external, 
    showCorners = false,
    showScanline = false,
    children, 
    ...props 
  }, ref) => {
    const buttonContent = (
      <>
        {/* Corner brackets for HUD effect */}
        {showCorners && (
          <>
            <span className="absolute top-0 left-0 w-2 h-2 border-l border-t border-current opacity-60" />
            <span className="absolute top-0 right-0 w-2 h-2 border-r border-t border-current opacity-60" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-current opacity-60" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-current opacity-60" />
          </>
        )}
        
        {/* Scan line effect */}
        {showScanline && (
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-r from-transparent via-current to-transparent
            h-px top-1/2 transform -translate-y-1/2
            animate-cyber-scan
          " />
        )}
        
        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </>
    );

    if (href) {
      const linkProps = external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {};
      
      return (
        <Link
          href={href}
          className={cn(cyberButtonVariants({ variant, size, intensity, className }))}
          {...linkProps}
        >
          {buttonContent}
        </Link>
      );
    }
    
    return (
      <button
        className={cn(cyberButtonVariants({ variant, size, intensity, className }))}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

export { CyberButton, cyberButtonVariants };