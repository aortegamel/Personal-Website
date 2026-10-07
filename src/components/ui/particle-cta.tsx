import React, { useRef, useEffect } from 'react';

interface ParticleField {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  particles: Particle[];
  mouse: { x: number; y: number };
  animationId?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  connections: number[];
}

interface ParticleCTAProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseRadius?: number;
  particleColors?: string[];
}

export function ParticleCTA({
  children,
  className,
  particleCount = 50,
  connectionDistance = 150,
  mouseRadius = 100,
  particleColors = ['#fbbf24', '#fcd34d', '#0073e6', '#338fff']
}: ParticleCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.3,
        connections: []
      });
    }

    const field: ParticleField = {
      canvas,
      ctx,
      particles,
      mouse: { x: -1000, y: -1000 }
    };

    fieldRef.current = field;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach((particle, i) => {
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

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
        const dx = field.mouse.x - particle.x;
        const dy = field.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          particle.vx += (dx / distance) * force * 0.5;
          particle.vy += (dy / distance) * force * 0.5;
          particle.targetAlpha = 0.8;
        } else {
          particle.targetAlpha = Math.random() * 0.3 + 0.2;
        }

        // Smooth alpha transition
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.1;

        // Limit velocity
        const maxSpeed = 2;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Clear connections
        particle.connections = [];

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 115, 230, ${opacity * particle.alpha * other.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            particle.connections.push(j);
            other.connections.push(i);
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, particle.color + '40');
        gradient.addColorStop(1, particle.color + '00');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      field.animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      field.mouse.x = e.clientX - rect.left;
      field.mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      field.mouse.x = -1000;
      field.mouse.y = -1000;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (field.animationId) {
        cancelAnimationFrame(field.animationId);
      }
      canvas.remove();
    };
  }, [particleCount, connectionDistance, mouseRadius, particleColors]);

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}