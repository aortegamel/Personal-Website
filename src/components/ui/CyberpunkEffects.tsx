'use client';

import React from 'react';
import { ScanlineOverlay } from './ScanlineOverlay';
import { CyberGrid } from './CyberGrid';

interface CyberpunkEffectsProps {
  /**
   * Whether cyberpunk effects are enabled
   */
  enabled?: boolean;
  /**
   * Intensity level of all effects (1-5)
   */
  intensity?: 1 | 2 | 3 | 4 | 5;
  /**
   * Whether to show scanline overlay
   */
  showScanlines?: boolean;
  /**
   * Whether to show background grid
   */
  showGrid?: boolean;
  /**
   * Whether to show HUD corner brackets
   */
  showHUD?: boolean;
  /**
   * Color theme for cyberpunk effects
   */
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Children to render (for wrapping specific sections)
   */
  children?: React.ReactNode;
}

/**
 * CyberpunkEffects Component
 * 
 * A comprehensive wrapper that combines all cyberpunk visual effects.
 * Can be used globally or to wrap specific sections of the interface.
 * 
 * Features:
 * - Combines scanlines, grid, and HUD effects
 * - Multiple color themes
 * - Configurable intensity levels
 * - Can wrap content or be used as global overlay
 * - Performance optimized
 */
export const CyberpunkEffects: React.FC<CyberpunkEffectsProps> = ({
  enabled = true,
  intensity = 2,
  showScanlines = true,
  showGrid = true,
  showHUD = false,
  theme = 'cyan',
  className = '',
  children,
}) => {
  if (!enabled) {
    return children ? <>{children}</> : null;
  }

  // Theme color mapping
  const themeColors = {
    cyan: {
      primary: 'var(--cyber-neon-cyan)',
      grid: 'var(--cyber-ui-border)',
    },
    magenta: {
      primary: 'var(--cyber-neon-magenta)',
      grid: 'var(--cyber-ui-border)',
    },
    green: {
      primary: 'var(--cyber-neon-green)',
      grid: 'var(--cyber-neon-green)',
    },
    orange: {
      primary: 'var(--cyber-neon-orange)',
      grid: 'var(--cyber-ui-border)',
    },
    matrix: {
      primary: '#00FF41',
      grid: '#003D10',
    },
  };

  const colors = themeColors[theme];
  
  // Calculate effect properties based on intensity
  const scanlineOpacity = Math.min(intensity * 0.03, 0.15);
  const gridOpacity = Math.min(intensity * 0.02, 0.1);
  const scanlineSpeed = Math.max(4 - intensity, 1);
  const gridSize = Math.max(60 - intensity * 10, 30);

  return (
    <div className={`relative ${className}`}>
      {/* Background Grid */}
      {showGrid && (
        <CyberGrid
          enabled={enabled}
          cellSize={gridSize}
          opacity={gridOpacity}
          color={colors.grid}
          animated={intensity > 2}
          pattern={intensity > 3 ? 'circuit' : 'square'}
          showCorners={showHUD}
        />
      )}

      {/* Scanline Overlay */}
      {showScanlines && (
        <ScanlineOverlay
          enabled={enabled}
          opacity={scanlineOpacity}
          speed={scanlineSpeed}
          color={colors.primary}
        />
      )}

      {/* Content */}
      {children}

      {/* Additional atmosphere effects for high intensity */}
      {intensity > 4 && (
        <div
          className="
            fixed inset-0 pointer-events-none z-40
            opacity-5
            mix-blend-overlay
          "
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${colors.primary} 1px, transparent 1px),
              radial-gradient(circle at 60% 70%, ${colors.primary} 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, ${colors.primary} 1px, transparent 1px)
            `,
            backgroundSize: '200px 200px, 300px 300px, 250px 250px',
            animation: 'cyberGlow 4s ease-in-out infinite alternate',
          }}
        />
      )}
    </div>
  );
};

export default CyberpunkEffects;