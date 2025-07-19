'use client';

import React, { useRef, useEffect, useState } from 'react';

interface CyberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'data' | 'glitch' | 'code';
  char?: string; // For code particles
  glitchOffset?: { x: number; y: number };
}

interface CyberParticleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  particleCount?: number;
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  intensity?: 1 | 2 | 3 | 4 | 5;
  showDataStream?: boolean;
  showGlitchEffect?: boolean;
}

/**
 * CyberParticleButton Component
 * 
 * Enhanced particle button with cyberpunk effects including data streams,
 * glitch particles, and code character animations.
 * 
 * Features:
 * - Multiple particle types (sparks, data streams, glitch, code characters)
 * - Cyberpunk color themes
 * - Configurable intensity levels
 * - Data stream and glitch effects
 * - Performance optimized with requestAnimationFrame
 */
export const CyberParticleButton: React.FC<CyberParticleButtonProps> = ({ 
  children, 
  className = '', 
  onClick,
  particleCount = 40,
  theme = 'cyan',
  intensity = 2,
  showDataStream = true,
  showGlitchEffect = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<CyberParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  // Color themes
  const themes = {
    cyan: {
      primary: '#00FFFF',
      secondary: '#0080FF',
      accent: '#40E0FF',
      glow: '#00FFFF40',
    },
    magenta: {
      primary: '#FF00FF',
      secondary: '#FF0080',
      accent: '#FF40E0',
      glow: '#FF00FF40',
    },
    green: {
      primary: '#00FF41',
      secondary: '#00CC33',
      accent: '#40FF7A',
      glow: '#00FF4140',
    },
    orange: {
      primary: '#FF6600',
      secondary: '#FF4400',
      accent: '#FF8A33',
      glow: '#FF660040',
    },
    matrix: {
      primary: '#00FF41',
      secondary: '#003D10',
      accent: '#66FF7A',
      glow: '#00FF4140',
    },
  };

  const colors = themes[theme];

  // Code characters for terminal-style particles
  const codeChars = ['0', '1', '>', '<', '/', '\\', '|', '-', '+', '*', '#', '@', '$', '%'];

  const createParticle = (x: number, y: number, type?: CyberParticle['type']): CyberParticle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = (Math.random() * 2 + 1) * intensity;
    const size = Math.random() * 2 + 1;
    const particleType = type || (['spark', 'data', 'glitch', 'code'][Math.floor(Math.random() * 4)] as CyberParticle['type']);
    
    let color = colors.primary;
    let maxLife = 1;
    let char: string | undefined;
    let glitchOffset: { x: number; y: number } | undefined;

    switch (particleType) {
      case 'spark':
        color = colors.primary;
        maxLife = 1.5;
        break;
      case 'data':
        color = colors.secondary;
        maxLife = 2;
        break;
      case 'glitch':
        color = colors.accent;
        maxLife = 0.8;
        glitchOffset = {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        };
        break;
      case 'code':
        color = colors.primary;
        maxLife = 2.5;
        char = codeChars[Math.floor(Math.random() * codeChars.length)];
        break;
    }
    
    return {
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: maxLife,
      maxLife,
      size: particleType === 'code' ? size * 1.5 : size,
      color,
      type: particleType,
      char,
      glitchOffset,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create data stream particles on mouse movement
    if (showDataStream && Math.random() > 0.7) {
      const newParticles = [];
      for (let i = 0; i < intensity; i++) {
        newParticles.push(createParticle(x, y, Math.random() > 0.5 ? 'data' : 'code'));
      }
      setParticles(prev => [...prev, ...newParticles].slice(-80));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create burst of cyberpunk particles on click
    const newParticles: CyberParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      let type: CyberParticle['type'] = 'spark';
      
      if (showGlitchEffect && Math.random() > 0.8) {
        type = 'glitch';
      } else if (showDataStream && Math.random() > 0.6) {
        type = Math.random() > 0.5 ? 'data' : 'code';
      }
      
      newParticles.push(createParticle(x, y, type));
    }
    setParticles(prev => [...prev, ...newParticles].slice(-120));
    
    if (onClick) onClick();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const updateCanvas = () => {
      // Set canvas size to match button
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      
      // Clear canvas with slight trail effect for cyberpunk feel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      setParticles(prev => {
        const updated = prev
          .map(particle => {
            const newParticle = {
              ...particle,
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              vy: particle.vy + 0.1, // gravity
              life: particle.life - (0.02 * (6 - intensity))
            };

            // Apply glitch offset
            if (particle.type === 'glitch' && particle.glitchOffset) {
              newParticle.x += particle.glitchOffset.x * (Math.random() - 0.5);
              newParticle.y += particle.glitchOffset.y * (Math.random() - 0.5);
            }

            return newParticle;
          })
          .filter(particle => 
            particle.life > 0 && 
            particle.x >= -50 && 
            particle.x <= canvas.width + 50 &&
            particle.y <= canvas.height + 50
          );
        
        // Draw particles
        updated.forEach(particle => {
          const alpha = particle.life / particle.maxLife;
          
          if (particle.type === 'code' && particle.char) {
            // Draw code characters
            ctx.font = `${particle.size * 8}px var(--font-cyber-body)`;
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            ctx.fillText(particle.char, particle.x, particle.y);
          } else {
            // Draw particle dots
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = particle.type === 'glitch' ? 15 : 8;
            ctx.shadowColor = particle.color;
            
            ctx.beginPath();
            
            if (particle.type === 'data') {
              // Draw data particles as small rectangles
              ctx.fillRect(
                particle.x - particle.size / 2, 
                particle.y - particle.size / 2, 
                particle.size, 
                particle.size
              );
            } else if (particle.type === 'glitch') {
              // Draw glitch particles with irregular shapes
              ctx.save();
              ctx.translate(particle.x, particle.y);
              ctx.rotate(Math.random() * Math.PI * 2);
              ctx.fillRect(-particle.size, -particle.size/2, particle.size * 2, particle.size);
              ctx.restore();
            } else {
              // Draw normal circular particles
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        });
        
        return updated;
      });
      
      animationRef.current = requestAnimationFrame(updateCanvas);
    };
    
    updateCanvas();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, intensity, showDataStream, showGlitchEffect]);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-visible ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />
      <span className="relative z-20">{children}</span>
    </button>
  );
};

export default CyberParticleButton;