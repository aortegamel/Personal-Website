'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface DataParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  color: string;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface CircuitNode {
  x: number;
  y: number;
  size: number;
  color: string;
  pulsePhase: number;
  connections: number[];
  active: boolean;
}

interface EnergyPulse {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  color: string;
  intensity: number;
}

interface NoiseCell {
  x: number;
  y: number;
  value: number;
  targetValue: number;
  changeRate: number;
}

interface CyberBackgroundEffectsProps {
  className?: string;
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  intensity?: 1 | 2 | 3 | 4 | 5;
  enableParticles?: boolean;
  enableCircuits?: boolean;
  enablePulses?: boolean;
  enableGrid?: boolean;
  enableNoise?: boolean;
  particleCount?: number;
  circuitNodeCount?: number;
  pulseFrequency?: number;
  noiseIntensity?: number;
  performanceMode?: boolean; // Reduces effects for mobile
}

/**
 * CyberBackgroundEffects Component
 * 
 * Creates atmospheric cyberpunk background effects with multiple layers:
 * - Floating data particles with physics and trails
 * - Animated circuit board patterns with energy flows
 * - Energy pulse waves across the screen
 * - Holographic overlay grids
 * - Digital noise textures
 * 
 * Features:
 * - Theme-aware colors matching cyberpunk design system
 * - Canvas-based animations with requestAnimationFrame
 * - Performance optimizations for mobile devices
 * - Multiple effect layers that can be combined
 * - Configurable intensity and effect types
 */
export const CyberBackgroundEffects: React.FC<CyberBackgroundEffectsProps> = ({
  className,
  theme = 'cyan',
  intensity = 2,
  enableParticles = true,
  enableCircuits = true,
  enablePulses = true,
  enableGrid = true,
  enableNoise = true,
  particleCount = 25,
  circuitNodeCount = 12,
  pulseFrequency = 3000,
  noiseIntensity = 0.1,
  performanceMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const particlesRef = useRef<DataParticle[]>([]);
  const circuitNodesRef = useRef<CircuitNode[]>([]);
  const energyPulsesRef = useRef<EnergyPulse[]>([]);
  const noiseCellsRef = useRef<NoiseCell[]>([]);
  const lastPulseTimeRef = useRef<number>(0);

  // Theme color configurations
  const themeColors = {
    cyan: {
      primary: '#00FFFF',
      secondary: '#0080FF',
      tertiary: '#40E0FF',
      glow: 'rgba(0, 255, 255, 0.6)',
      trail: 'rgba(0, 255, 255, 0.3)',
      grid: 'rgba(0, 255, 255, 0.1)',
    },
    magenta: {
      primary: '#FF00FF',
      secondary: '#FF0080',
      tertiary: '#FF40E0',
      glow: 'rgba(255, 0, 255, 0.6)',
      trail: 'rgba(255, 0, 255, 0.3)',
      grid: 'rgba(255, 0, 255, 0.1)',
    },
    green: {
      primary: '#00FF41',
      secondary: '#00CC33',
      tertiary: '#40FF7A',
      glow: 'rgba(0, 255, 65, 0.6)',
      trail: 'rgba(0, 255, 65, 0.3)',
      grid: 'rgba(0, 255, 65, 0.1)',
    },
    orange: {
      primary: '#FF6600',
      secondary: '#FF4400',
      tertiary: '#FF8A33',
      glow: 'rgba(255, 102, 0, 0.6)',
      trail: 'rgba(255, 102, 0, 0.3)',
      grid: 'rgba(255, 102, 0, 0.1)',
    },
    matrix: {
      primary: '#00FF41',
      secondary: '#003D10',
      tertiary: '#66FF7A',
      glow: 'rgba(0, 255, 65, 0.4)',
      trail: 'rgba(0, 255, 65, 0.2)',
      grid: 'rgba(0, 255, 65, 0.05)',
    },
  };

  const colors = themeColors[theme];

  // Initialize data particles
  const initializeParticles = useCallback((width: number, height: number) => {
    const particles: DataParticle[] = [];
    const count = performanceMode ? Math.floor(particleCount * 0.6) : particleCount;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5 * intensity,
        vy: (Math.random() - 0.5) * 0.5 * intensity,
        radius: Math.random() * 2 + 1,
        alpha: 0,
        targetAlpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.7 ? colors.secondary : colors.primary,
        life: 0,
        maxLife: Math.random() * 500 + 200,
        trail: [],
      });
    }
    
    particlesRef.current = particles;
  }, [particleCount, intensity, colors, performanceMode]);

  // Initialize circuit nodes
  const initializeCircuits = useCallback((width: number, height: number) => {
    const nodes: CircuitNode[] = [];
    const count = performanceMode ? Math.floor(circuitNodeCount * 0.7) : circuitNodeCount;
    
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? colors.primary : colors.tertiary,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
        active: Math.random() > 0.3,
      });
    }

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const distance = Math.sqrt(
          Math.pow(other.x - node.x, 2) + Math.pow(other.y - node.y, 2)
        );
        
        if (distance < 150 && Math.random() > 0.7) {
          node.connections.push(j);
          other.connections.push(i);
        }
      }
    });

    circuitNodesRef.current = nodes;
  }, [circuitNodeCount, colors, performanceMode]);

  // Initialize noise cells
  const initializeNoise = useCallback((width: number, height: number) => {
    const cells: NoiseCell[] = [];
    const cellSize = performanceMode ? 40 : 30;
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        cells.push({
          x: x * cellSize,
          y: y * cellSize,
          value: Math.random(),
          targetValue: Math.random(),
          changeRate: 0.001 + Math.random() * 0.002,
        });
      }
    }

    noiseCellsRef.current = cells;
  }, [performanceMode]);

  // Create energy pulse
  const createEnergyPulse = useCallback((width: number, height: number) => {
    const isHorizontal = Math.random() > 0.5;
    let startX, startY, endX, endY;

    if (isHorizontal) {
      startX = 0;
      endX = width;
      startY = endY = Math.random() * height;
    } else {
      startY = 0;
      endY = height;
      startX = endX = Math.random() * width;
    }

    energyPulsesRef.current.push({
      startX,
      startY,
      endX,
      endY,
      progress: 0,
      speed: 0.008 + Math.random() * 0.004,
      color: Math.random() > 0.6 ? colors.secondary : colors.primary,
      intensity: 0.3 + Math.random() * 0.4,
    });
  }, [colors]);

  // Animation loop
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw noise texture
    if (enableNoise) {
      noiseCellsRef.current.forEach(cell => {
        // Update noise value
        cell.value += (cell.targetValue - cell.value) * cell.changeRate;
        
        if (Math.abs(cell.value - cell.targetValue) < 0.05) {
          cell.targetValue = Math.random();
        }

        const alpha = cell.value * noiseIntensity * intensity * 0.1;
        ctx.fillStyle = colors.grid.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.fillRect(cell.x, cell.y, 30, 30);
      });
    }

    // Draw holographic grid
    if (enableGrid) {
      const gridSize = performanceMode ? 80 : 60;
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3 + Math.sin(currentTime * 0.001) * 0.1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    // Update and draw circuit nodes
    if (enableCircuits) {
      circuitNodesRef.current.forEach((node, i) => {
        node.pulsePhase += 0.02 * intensity;

        // Draw connections
        node.connections.forEach(connIndex => {
          const connectedNode = circuitNodesRef.current[connIndex];
          if (!connectedNode || !node.active || !connectedNode.active) return;

          const pulseAlpha = (Math.sin(node.pulsePhase) + 1) * 0.3;
          ctx.strokeStyle = colors.trail.replace(/[\d.]+\)$/, `${pulseAlpha})`);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();

          // Data flow along connection
          if (Math.random() > 0.98) {
            const flowProgress = (currentTime * 0.001) % 1;
            const flowX = node.x + (connectedNode.x - node.x) * flowProgress;
            const flowY = node.y + (connectedNode.y - node.y) * flowProgress;

            ctx.fillStyle = colors.primary;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(flowX, flowY, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        });

        // Draw node
        if (node.active) {
          const pulseSize = node.size + Math.sin(node.pulsePhase) * 0.5;
          
          // Node glow
          const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, pulseSize * 2
          );
          gradient.addColorStop(0, node.color + '60');
          gradient.addColorStop(1, node.color + '00');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
          ctx.fill();

          // Node core
          ctx.fillStyle = node.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    }

    // Update and draw data particles
    if (enableParticles) {
      particlesRef.current.forEach(particle => {
        // Update particle physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += deltaTime * 0.01;

        // Update trail
        particle.trail.push({ 
          x: particle.x, 
          y: particle.y, 
          alpha: particle.alpha 
        });
        
        if (particle.trail.length > (performanceMode ? 8 : 12)) {
          particle.trail.shift();
        }

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Update alpha based on life
        const lifeProgress = particle.life / particle.maxLife;
        if (lifeProgress < 0.2) {
          particle.alpha = (lifeProgress / 0.2) * particle.targetAlpha;
        } else if (lifeProgress > 0.8) {
          particle.alpha = particle.targetAlpha * (1 - (lifeProgress - 0.8) / 0.2);
        } else {
          particle.alpha = particle.targetAlpha;
        }

        // Reset particle if dead
        if (particle.life >= particle.maxLife) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = 0;
          particle.trail = [];
        }

        // Draw particle trail
        particle.trail.forEach((point, index) => {
          const trailAlpha = (index / particle.trail.length) * particle.alpha * 0.5;
          const trailSize = particle.radius * (index / particle.trail.length);
          
          ctx.fillStyle = colors.trail.replace(/[\d.]+\)$/, `${trailAlpha})`);
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle
        ctx.globalAlpha = particle.alpha;
        
        // Particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Particle core
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.globalAlpha = 1;
      });
    }

    // Create energy pulses
    if (enablePulses && currentTime - lastPulseTimeRef.current > pulseFrequency) {
      createEnergyPulse(canvas.width, canvas.height);
      lastPulseTimeRef.current = currentTime;
    }

    // Update and draw energy pulses
    energyPulsesRef.current = energyPulsesRef.current.filter(pulse => {
      pulse.progress += pulse.speed;

      if (pulse.progress <= 1) {
        const currentX = pulse.startX + (pulse.endX - pulse.startX) * pulse.progress;
        const currentY = pulse.startY + (pulse.endY - pulse.startY) * pulse.progress;

        // Draw pulse
        const pulseLength = 80;
        const gradient = ctx.createLinearGradient(
          currentX - pulseLength, currentY - pulseLength,
          currentX + pulseLength, currentY + pulseLength
        );
        gradient.addColorStop(0, pulse.color + '00');
        gradient.addColorStop(0.4, pulse.color + Math.floor(pulse.intensity * 255).toString(16));
        gradient.addColorStop(0.6, pulse.color + Math.floor(pulse.intensity * 255).toString(16));
        gradient.addColorStop(1, pulse.color + '00');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = pulse.color;
        ctx.beginPath();
        ctx.moveTo(currentX - pulseLength, currentY);
        ctx.lineTo(currentX + pulseLength, currentY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        return true;
      }
      
      return false;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [
    enableNoise, enableGrid, enableCircuits, enableParticles, enablePulses,
    noiseIntensity, intensity, pulseFrequency, colors, createEnergyPulse, performanceMode
  ]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas styles
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Reinitialize effects
      initializeParticles(canvas.width, canvas.height);
      initializeCircuits(canvas.width, canvas.height);
      initializeNoise(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initializeParticles, initializeCircuits, initializeNoise]);

  return (
    <div 
      ref={containerRef} 
      className={cn('fixed inset-0 overflow-hidden', className)}
      style={{ zIndex: -1 }}
    >
      <canvas ref={canvasRef} />
      
      {/* Static holographic overlay for extra depth */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.glow} 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${colors.trail} 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, ${colors.grid} 0%, transparent 30%)
          `,
          filter: 'blur(100px)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
    </div>
  );
};

export default CyberBackgroundEffects;