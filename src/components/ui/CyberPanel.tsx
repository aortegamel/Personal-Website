'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cyberPanelVariants = cva(
  'relative backdrop-filter backdrop-blur-md transition-all duration-300 overflow-hidden group',
  {
    variants: {
      variant: {
        // Standard cyberpunk panel
        default: `
          bg-cyber-black/30 border border-cyber-ui
          hover:bg-cyber-dark/40 hover:border-cyber-cyan
          hover:shadow-lg hover:shadow-cyber-cyan/20
        `,
        // Glowing neon panel
        neon: `
          bg-cyber-black/40 border-2 border-cyber-cyan
          shadow-lg shadow-cyber-cyan/30
          hover:shadow-xl hover:shadow-cyber-cyan/50
          animate-cyber-pulse
        `,
        // HUD information panel
        hud: `
          bg-gradient-to-br from-cyber-black/60 to-cyber-dark/40
          border border-cyber-ui backdrop-filter backdrop-blur-lg
          hover:border-cyber-cyan
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-transparent before:via-cyber-cyan/5 before:to-transparent
          before:opacity-0 hover:before:opacity-100 before:transition-opacity
        `,
        // Matrix-style green panel
        matrix: `
          bg-cyber-black/50 border border-cyber-green/30
          shadow-md shadow-cyber-green/20
          hover:border-cyber-green hover:shadow-lg hover:shadow-cyber-green/40
          font-cyber-body
        `,
        // Alert/warning panel
        alert: `
          bg-cyber-black/40 border-2 border-cyber-orange
          shadow-lg shadow-cyber-orange/30
          animate-cyber-flicker
          hover:shadow-xl hover:shadow-cyber-orange/50
        `,
        // Magenta themed panel
        magenta: `
          bg-cyber-black/40 border border-cyber-magenta/50
          shadow-md shadow-cyber-magenta/20
          hover:border-cyber-magenta hover:shadow-lg hover:shadow-cyber-magenta/40
        `,
      },
      size: {
        sm: 'p-3 rounded-md',
        default: 'p-4 rounded-lg',
        lg: 'p-6 rounded-xl',
        xl: 'p-8 rounded-2xl',
      },
      corners: {
        none: '',
        small: 'clip-path-[polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px))]',
        medium: 'clip-path-[polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%-12px))]',
        large: 'clip-path-[polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,16px_100%,0_calc(100%-16px))]',
      },
      glitch: {
        none: '',
        subtle: 'hover:animate-cyber-glitch',
        medium: 'animate-cyber-glitch',
        intense: 'animate-cyber-glitch animate-cyber-flicker',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      corners: 'none',
      glitch: 'none',
    },
  }
);

export interface CyberPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberPanelVariants> {
  /**
   * Panel title for HUD display
   */
  title?: string;
  /**
   * Subtitle or additional info
   */
  subtitle?: string;
  /**
   * Whether to show corner brackets
   */
  showCorners?: boolean;
  /**
   * Whether to show scan line animation
   */
  showScanline?: boolean;
  /**
   * Whether to show status indicator
   */
  status?: 'online' | 'offline' | 'warning' | 'error' | null;
  /**
   * Additional header content
   */
  headerContent?: React.ReactNode;
}

/**
 * CyberPanel Component
 * 
 * A versatile cyberpunk-themed panel component for displaying information
 * in a futuristic HUD-style interface.
 * 
 * Features:
 * - Multiple visual variants with different color schemes
 * - Optional title/subtitle with status indicators
 * - Configurable corner cuts and glitch effects
 * - Scan line animations and corner brackets
 * - Glass morphism with backdrop blur
 * - Hover effects and state transitions
 */
const CyberPanel = React.forwardRef<HTMLDivElement, CyberPanelProps>(
  ({ 
    className, 
    variant, 
    size, 
    corners,
    glitch,
    title,
    subtitle,
    showCorners = false,
    showScanline = false,
    status = null,
    headerContent,
    children, 
    ...props 
  }, ref) => {
    const statusColors = {
      online: 'bg-cyber-green',
      offline: 'bg-gray-500',
      warning: 'bg-cyber-orange',
      error: 'bg-red-500',
    };

    return (
      <div
        className={cn(cyberPanelVariants({ variant, size, corners, glitch, className }))}
        ref={ref}
        {...props}
      >
        {/* Corner brackets */}
        {showCorners && (
          <>
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current opacity-60" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-current opacity-60" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-current opacity-60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current opacity-60" />
          </>
        )}

        {/* Scan line effect */}
        {showScanline && (
          <div className="
            absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none
          ">
            <div className="
              absolute inset-x-0 h-px top-1/3
              bg-gradient-to-r from-transparent via-current to-transparent
              animate-cyber-scan opacity-60
            " />
          </div>
        )}

        {/* Header section */}
        {(title || subtitle || status || headerContent) && (
          <div className="flex items-start justify-between mb-4 pb-2 border-b border-current/20">
            <div className="flex-1">
              {title && (
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-cyber-heading text-lg font-medium text-cyber-text-primary">
                    {title}
                  </h3>
                  {status && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${statusColors[status]} animate-cyber-pulse`}
                      />
                      <span className="text-xs font-cyber-body text-cyber-text-secondary uppercase tracking-wide">
                        {status}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {subtitle && (
                <p className="text-sm font-cyber-body text-cyber-text-secondary">
                  {subtitle}
                </p>
              )}
            </div>
            {headerContent && (
              <div className="flex-shrink-0 ml-4">
                {headerContent}
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Background grid effect for enhanced cyberpunk feel */}
        <div 
          className="
            absolute inset-0 opacity-5 pointer-events-none
            bg-gradient-to-br from-transparent via-current to-transparent
          "
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    );
  }
);

CyberPanel.displayName = 'CyberPanel';

export { CyberPanel, cyberPanelVariants };