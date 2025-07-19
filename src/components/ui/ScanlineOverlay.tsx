'use client';

import React from 'react';

interface ScanlineOverlayProps {
  /**
   * Whether the scanline effect is enabled
   */
  enabled?: boolean;
  /**
   * Opacity of the scanline effect (0-1)
   */
  opacity?: number;
  /**
   * Speed of the scan animation (higher = faster)
   */
  speed?: number;
  /**
   * Color of the scanlines (CSS color or custom property)
   */
  color?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ScanlineOverlay Component
 * 
 * Creates a cyberpunk-style moving scanline effect across the entire viewport.
 * Designed to be used as a global overlay for atmospheric cyberpunk effects.
 * 
 * Features:
 * - Smooth animated scanlines with customizable speed
 * - Configurable opacity and color
 * - Performance optimized with CSS animations
 * - Can be toggled on/off for theme switching
 */
export const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({
  enabled = true,
  opacity = 0.1,
  speed = 2,
  color = 'var(--cyber-neon-cyan)',
  className = '',
}) => {
  if (!enabled) return null;

  const scanlineStyle = {
    '--scanline-color': color,
    '--scanline-opacity': opacity,
    '--scanline-duration': `${speed}s`,
  } as React.CSSProperties;

  return (
    <div
      className={`
        fixed inset-0 pointer-events-none z-50
        overflow-hidden
        ${className}
      `}
      style={scanlineStyle}
    >
      {/* Primary scanline */}
      <div
        className="
          absolute inset-x-0 h-px
          bg-gradient-to-r from-transparent via-current to-transparent
          animate-cyber-scan
        "
        style={{
          color: `var(--scanline-color)`,
          opacity: `var(--scanline-opacity)`,
          animationDuration: `var(--scanline-duration)`,
          filter: 'blur(0.5px)',
          boxShadow: `0 0 10px var(--scanline-color)`,
        }}
      />
      
      {/* Secondary scanline with offset */}
      <div
        className="
          absolute inset-x-0 h-px
          bg-gradient-to-r from-transparent via-current to-transparent
          animate-cyber-scan
        "
        style={{
          color: `var(--scanline-color)`,
          opacity: `calc(var(--scanline-opacity) * 0.6)`,
          animationDuration: `calc(var(--scanline-duration) * 1.5)`,
          animationDelay: '1s',
          filter: 'blur(1px)',
          boxShadow: `0 0 5px var(--scanline-color)`,
        }}
      />

      {/* Background static effect */}
      <div
        className="
          absolute inset-0
          opacity-[0.02]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              var(--scanline-color) 2px,
              var(--scanline-color) 4px
            )
          `,
          animation: 'cyberFlicker 0.15s infinite linear',
        }}
      />
    </div>
  );
};

export default ScanlineOverlay;