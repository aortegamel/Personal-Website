'use client';

import React, { useState, useEffect } from 'react';

interface GlitchTextProps {
  /**
   * The text content to display with glitch effect
   */
  children: React.ReactNode;
  /**
   * Whether the glitch effect is enabled
   */
  enabled?: boolean;
  /**
   * Intensity of the glitch effect (1-5)
   */
  intensity?: 1 | 2 | 3 | 4 | 5;
  /**
   * How often the glitch effect triggers (ms)
   */
  frequency?: number;
  /**
   * Duration of each glitch effect (ms)
   */
  duration?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * HTML element to render as
   */
  as?: keyof JSX.IntrinsicElements;
  /**
   * Glitch color (defaults to cyberpunk cyan)
   */
  glitchColor?: string;
}

/**
 * GlitchText Component
 * 
 * Creates cyberpunk-style glitch effects on text elements.
 * Features randomized glitch animations with customizable intensity and frequency.
 * 
 * Features:
 * - Multiple glitch effects: position shift, color distortion, text corruption
 * - Configurable intensity levels and timing
 * - Performance optimized with CSS transforms
 * - Supports any HTML element via 'as' prop
 * - Automatic cleanup of effects
 */
export const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  enabled = true,
  intensity = 2,
  frequency = 3000,
  duration = 300,
  className = '',
  as: Component = 'span',
  glitchColor = 'var(--cyber-neon-cyan)',
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchData, setGlitchData] = useState({
    x: 0,
    y: 0,
    skew: 0,
    scale: 1,
  });

  useEffect(() => {
    if (!enabled) return;

    const triggerGlitch = () => {
      const maxOffset = intensity * 2;
      const maxSkew = intensity;
      const scaleVariation = 0.05 * intensity;

      setGlitchData({
        x: (Math.random() - 0.5) * maxOffset,
        y: (Math.random() - 0.5) * maxOffset,
        skew: (Math.random() - 0.5) * maxSkew,
        scale: 1 + (Math.random() - 0.5) * scaleVariation,
      });

      setIsGlitching(true);

      setTimeout(() => {
        setIsGlitching(false);
      }, duration);
    };

    const interval = setInterval(triggerGlitch, frequency);

    return () => clearInterval(interval);
  }, [enabled, intensity, frequency, duration]);

  const glitchStyle = {
    '--glitch-color': glitchColor,
    '--glitch-intensity': intensity,
  } as React.CSSProperties;

  const transformStyle = isGlitching ? {
    transform: `
      translate(${glitchData.x}px, ${glitchData.y}px) 
      skew(${glitchData.skew}deg) 
      scale(${glitchData.scale})
    `,
    filter: intensity > 3 ? 'hue-rotate(180deg) saturate(200%)' : 'none',
    transition: 'none',
  } : {
    transform: 'translate(0, 0) skew(0deg) scale(1)',
    filter: 'none',
    transition: 'all 0.1s ease',
  };

  return (
    <Component
      className={`
        relative inline-block
        ${isGlitching ? 'animate-cyber-glitch' : ''}
        ${className}
      `}
      style={{ ...glitchStyle, ...transformStyle }}
    >
      {/* Main text */}
      <span className="relative z-10">
        {children}
      </span>

      {/* Glitch layers for enhanced effect */}
      {enabled && isGlitching && (
        <>
          {/* Red channel offset */}
          <span
            className="
              absolute inset-0 z-0
              text-red-500
              opacity-80
            "
            style={{
              transform: `translate(-${intensity}px, 0)`,
              mixBlendMode: 'screen',
            }}
            aria-hidden="true"
          >
            {children}
          </span>

          {/* Blue channel offset */}
          <span
            className="
              absolute inset-0 z-0
              opacity-80
            "
            style={{
              color: glitchColor,
              transform: `translate(${intensity}px, 0)`,
              mixBlendMode: 'screen',
            }}
            aria-hidden="true"
          >
            {children}
          </span>

          {/* Noise overlay for intense glitches */}
          {intensity > 3 && (
            <div
              className="
                absolute inset-0 z-20
                pointer-events-none
                mix-blend-overlay
                opacity-30
              "
              style={{
                backgroundImage: `
                  url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")
                `,
                backgroundSize: '50px 50px',
                animation: 'cyberFlicker 0.1s infinite linear',
              }}
            />
          )}
        </>
      )}
    </Component>
  );
};

export default GlitchText;