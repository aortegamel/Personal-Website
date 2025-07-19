'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CyberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  connections: number[];
  type: 'node' | 'data' | 'terminal' | 'scanner';
  pulsePhase: number;
  char?: string; // For terminal particles
  scanDirection?: { x: number; y: number }; // For scanner particles
}

interface CyberParticleFieldProps {
  children?: React.ReactNode;
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  intensity?: 1 | 2 | 3 | 4 | 5;
  showDataFlow?: boolean;
  showTerminalNodes?: boolean;
  showScannerNodes?: boolean;
}

/**
 * CyberParticleField Component
 * 
 * Enhanced particle network with cyberpunk aesthetics, data flows,
 * terminal nodes, and scanner effects.
 * 
 * Features:
 * - Multiple particle types (nodes, data, terminal, scanner)
 * - Dynamic connection networks with data flow visualization
 * - Mouse interaction with attraction/repulsion effects
 * - Terminal-style character particles
 * - Scanner beam effects
 * - Configurable cyberpunk themes
 */
export const CyberParticleField: React.FC<CyberParticleFieldProps> = ({
  children,
  className,
  particleCount = 60,
  connectionDistance = 120,
  mouseRadius = 100,
  theme = 'cyan',
  intensity = 2,
  showDataFlow = true,
  showTerminalNodes = true,
  showScannerNodes = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<CyberParticle[]>([]);

  // Color themes
  const themes = {
    cyan: {
      primary: '#00FFFF',
      secondary: '#0080FF',
      connection: '#00FFFF40',
      data: '#40E0FF',
      terminal: '#00CCCC',
    },
    magenta: {
      primary: '#FF00FF',
      secondary: '#FF0080',
      connection: '#FF00FF40',
      data: '#FF40E0',
      terminal: '#CC00CC',
    },
    green: {
      primary: '#00FF41',
      secondary: '#00CC33',
      connection: '#00FF4140',
      data: '#40FF7A',
      terminal: '#00CC33',
    },
    orange: {
      primary: '#FF6600',
      secondary: '#FF4400',
      connection: '#FF660040',
      data: '#FF8A33',
      terminal: '#CC5500',
    },
    matrix: {
      primary: '#00FF41',
      secondary: '#003D10',
      connection: '#00FF4120',
      data: '#66FF7A',
      terminal: '#00FF41',
    },
  };

  const colors = themes[theme];
  const terminalChars = ['0', '1', '>', '<', '/', '\\', '|', '-', '+', '*', '#', '@'];

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas style
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initializeParticles();
    };

    const initializeParticles = () => {
      const particles: CyberParticle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        let type: CyberParticle['type'] = 'node';
        let char: string | undefined;
        let scanDirection: { x: number; y: number } | undefined;

        // Determine particle type based on intensity and features
        const typeRand = Math.random();
        if (showTerminalNodes && typeRand > 0.8) {
          type = 'terminal';
          char = terminalChars[Math.floor(Math.random() * terminalChars.length)];
        } else if (showDataFlow && typeRand > 0.6) {
          type = 'data';
        } else if (showScannerNodes && typeRand > 0.9) {
          type = 'scanner';
          scanDirection = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
          };
        }

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3 * intensity,
          vy: (Math.random() - 0.5) * 0.3 * intensity,
          radius: type === 'terminal' ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
          color: type === 'terminal' ? colors.terminal : 
                 type === 'data' ? colors.data :
                 type === 'scanner' ? colors.secondary : colors.primary,
          alpha: 0,
          targetAlpha: Math.random() * 0.5 + 0.3,
          connections: [],
          type,
          pulsePhase: Math.random() * Math.PI * 2,
          char,
          scanDirection,
        });
      }

      particlesRef.current = particles;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update pulse phase
        particle.pulsePhase += 0.05 * intensity;

        // Scanner particles move in scanning patterns
        if (particle.type === 'scanner' && particle.scanDirection) {
          particle.vx += particle.scanDirection.x * 0.01;
          particle.vy += particle.scanDirection.y * 0.01;
        }

        // Bounce off walls
        if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
          particle.vx *= -1;
        }
        if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
          particle.vy *= -1;
        }

        // Keep within bounds
        particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
        particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));

        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          const interactionStrength = particle.type === 'scanner' ? 0.8 : 0.3;
          
          particle.vx += (dx / distance) * force * interactionStrength;
          particle.vy += (dy / distance) * force * interactionStrength;
          particle.targetAlpha = 0.9;
        } else {
          particle.targetAlpha = particle.type === 'terminal' ? 0.7 : 
                                  particle.type === 'scanner' ? 0.8 :
                                  Math.random() * 0.3 + 0.2;
        }

        // Smooth alpha transition
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.1;

        // Limit velocity
        const maxSpeed = particle.type === 'scanner' ? 3 : 1.5;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Clear connections
        particle.connections = [];
      });

      // Draw connections and data flows
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.5;
            
            // Connection line
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = colors.connection.replace(/40$/, Math.floor(opacity * particle.alpha * other.alpha * 255).toString(16).padStart(2, '0'));
            ctx.lineWidth = particle.type === 'scanner' || other.type === 'scanner' ? 2 : 1;
            ctx.stroke();

            // Data flow animation along connections
            if (showDataFlow && Math.random() > 0.95) {
              const flowPosition = (Date.now() / 1000) % 1;
              const flowX = particle.x + (dx * flowPosition);
              const flowY = particle.y + (dy * flowPosition);
              
              ctx.beginPath();
              ctx.arc(flowX, flowY, 1, 0, Math.PI * 2);
              ctx.fillStyle = colors.data;
              ctx.globalAlpha = opacity * 0.8;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            particle.connections.push(j);
            other.connections.push(i);
          }
        }
      }

      // Draw particles
      particles.forEach(particle => {
        ctx.globalAlpha = particle.alpha;

        if (particle.type === 'terminal' && particle.char) {
          // Draw terminal characters
          ctx.font = `${particle.radius * 3}px var(--font-cyber-body)`;
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = particle.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(particle.char, particle.x, particle.y);
        } else {
          // Draw particle with pulse effect
          const pulseRadius = particle.radius + Math.sin(particle.pulsePhase) * 0.5;
          
          // Outer glow
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, pulseRadius * 3
          );
          gradient.addColorStop(0, particle.color + '80');
          gradient.addColorStop(1, particle.color + '00');
          
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseRadius * 3, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Main particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.shadowBlur = particle.type === 'scanner' ? 15 : 8;
          ctx.shadowColor = particle.color;
          ctx.fill();

          // Scanner beam effect
          if (particle.type === 'scanner') {
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.pulsePhase);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(50, -2);
            ctx.lineTo(50, 2);
            ctx.closePath();
            ctx.fillStyle = particle.color + '60';
            ctx.fill();
            ctx.restore();
          }
        }
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, connectionDistance, mouseRadius, theme, intensity, showDataFlow, showTerminalNodes, showScannerNodes]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <canvas ref={canvasRef} />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

export default CyberParticleField;