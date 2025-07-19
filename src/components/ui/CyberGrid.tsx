'use client';

import React from 'react';

interface CyberGridProps {
  /**
   * Whether the grid effect is enabled
   */
  enabled?: boolean;
  /**
   * Size of grid cells in pixels
   */
  cellSize?: number;
  /**
   * Opacity of the grid lines (0-1)
   */
  opacity?: number;
  /**
   * Color of the grid lines
   */
  color?: string;
  /**
   * Whether to show animated pulse effects
   */
  animated?: boolean;
  /**
   * Grid pattern type
   */
  pattern?: 'square' | 'hexagon' | 'circuit';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show corner brackets for HUD effect
   */
  showCorners?: boolean;
}

/**
 * CyberGrid Component
 * 
 * Creates cyberpunk-style background grid patterns for HUD-like interfaces.
 * Supports different grid patterns and animated effects.
 * 
 * Features:
 * - Multiple grid patterns (square, hexagon, circuit-board style)
 * - Animated pulse effects and corner brackets
 * - Configurable cell size and opacity
 * - Performance optimized with CSS patterns
 * - Optional HUD corner elements
 */
export const CyberGrid: React.FC<CyberGridProps> = ({
  enabled = true,
  cellSize = 50,
  opacity = 0.1,
  color = 'var(--cyber-ui-border)',
  animated = true,
  pattern = 'square',
  className = '',
  showCorners = false,
}) => {
  if (!enabled) return null;

  const gridStyle = {
    '--grid-color': color,
    '--grid-opacity': opacity,
    '--grid-size': `${cellSize}px`,
  } as React.CSSProperties;

  const getGridPattern = () => {
    switch (pattern) {
      case 'hexagon':
        return {
          backgroundImage: `
            linear-gradient(30deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%),
            linear-gradient(-30deg, transparent 24%, var(--grid-color) 25%, var(--grid-color) 26%, transparent 27%, transparent 74%, var(--grid-color) 75%, var(--grid-color) 76%, transparent 77%)
          `,
          backgroundSize: `calc(var(--grid-size) * 1.5) var(--grid-size)`,
        };
      
      case 'circuit':
        return {
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px),
            radial-gradient(circle at calc(var(--grid-size) / 2) calc(var(--grid-size) / 2), var(--grid-color) 2px, transparent 2px)
          `,
          backgroundSize: `var(--grid-size) var(--grid-size), var(--grid-size) var(--grid-size), var(--grid-size) var(--grid-size)`,
        };
      
      default: // square
        return {
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: `var(--grid-size) var(--grid-size)`,
        };
    }
  };

  return (
    <div
      className={`
        fixed inset-0 pointer-events-none z-0
        ${animated ? 'animate-cyber-pulse' : ''}
        ${className}
      `}
      style={{
        ...gridStyle,
        ...getGridPattern(),
        opacity: 'var(--grid-opacity)',
      }}
    >
      {/* Animated overlay for circuit pattern */}
      {pattern === 'circuit' && animated && (
        <div
          className="
            absolute inset-0
            opacity-50
          "
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, var(--grid-color) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, var(--grid-color) 1px, transparent 1px)
            `,
            backgroundSize: `calc(var(--grid-size) * 2) calc(var(--grid-size) * 2)`,
            animation: 'cyberGlow 3s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* HUD Corner Brackets */}
      {showCorners && (
        <>
          {/* Top Left */}
          <div
            className="
              absolute top-4 left-4
              w-8 h-8
              border-l-2 border-t-2
              opacity-60
            "
            style={{
              borderColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
          
          {/* Top Right */}
          <div
            className="
              absolute top-4 right-4
              w-8 h-8
              border-r-2 border-t-2
              opacity-60
            "
            style={{
              borderColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
          
          {/* Bottom Left */}
          <div
            className="
              absolute bottom-4 left-4
              w-8 h-8
              border-l-2 border-b-2
              opacity-60
            "
            style={{
              borderColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
          
          {/* Bottom Right */}
          <div
            className="
              absolute bottom-4 right-4
              w-8 h-8
              border-r-2 border-b-2
              opacity-60
            "
            style={{
              borderColor: color,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        </>
      )}

      {/* Animated data streams for enhanced effect */}
      {animated && pattern === 'circuit' && (
        <>
          <div
            className="
              absolute top-1/3 left-0 right-0
              h-px
              bg-gradient-to-r from-transparent via-current to-transparent
              opacity-60
            "
            style={{
              color: color,
              animation: 'cyber-scan 4s linear infinite',
              boxShadow: `0 0 5px ${color}`,
            }}
          />
          
          <div
            className="
              absolute top-0 bottom-0 left-2/3
              w-px
              bg-gradient-to-b from-transparent via-current to-transparent
              opacity-60
            "
            style={{
              color: color,
              animation: 'cyber-scan 6s linear infinite reverse',
              boxShadow: `0 0 5px ${color}`,
            }}
          />
        </>
      )}
    </div>
  );
};

export default CyberGrid;