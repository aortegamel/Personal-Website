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
  baseAlpha: number;
  connections: number[];
}

const DEFAULT_PARTICLE_COLORS = ['#fbbf24', '#fcd34d', '#0073e6', '#338fff'];

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
  particleCount,
  connectionDistance = 150,
  mouseRadius = 100,
  particleColors = DEFAULT_PARTICLE_COLORS
}: ParticleCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    // Density matches the hero: one dot per ~4500 px², so every section reads
    // as rich as the top of the homepage. Explicit prop overrides auto count.
    const autoCount = Math.min(600, Math.max(80, Math.round((canvas.width * canvas.height) / 4500)));
    const count = particleCount ?? autoCount;

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.3;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: 0,
        targetAlpha: baseAlpha,
        baseAlpha,
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

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) field.animationId = requestAnimationFrame(animate);
    });
    io.observe(container);

    // Spatial grid: pair checks only against neighbors, not all n². Cell =
    // connectionDistance so linked pairs always share a cell or touch one.
    const cell = connectionDistance;
    const grid = new Map<number, number[]>();

    const animate = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
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

        // Mouse interaction; squared distance avoids sqrt per particle per frame
        const mdx = field.mouse.x - particle.x;
        const mdy = field.mouse.y - particle.y;
        const mdistSq = mdx * mdx + mdy * mdy;
        if (mdistSq < mouseRadius * mouseRadius && mdistSq > 0.0001) {
          const mdist = Math.sqrt(mdistSq);
          const force = (mouseRadius - mdist) / mouseRadius;
          particle.vx += (mdx / mdist) * force * 0.5;
          particle.vy += (mdy / mdist) * force * 0.5;
          particle.targetAlpha = 0.8;
        } else if (particle.targetAlpha > particle.baseAlpha) {
          particle.targetAlpha = particle.baseAlpha;
        }

        // Smooth alpha transition
        particle.alpha += (particle.targetAlpha - particle.alpha) * 0.1;

        // Limit velocity; squared compare skips sqrt for slow particles
        const maxSpeed = 2;
        const speedSq = particle.vx * particle.vx + particle.vy * particle.vy;
        if (speedSq > maxSpeed * maxSpeed) {
          const speed = Math.sqrt(speedSq);
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;
      }

      // Bucket particles into grid cells
      grid.clear();
      for (let i = 0; i < particles.length; i++) {
        const k = Math.floor(particles[i].x / cell) * 100000 + Math.floor(particles[i].y / cell);
        const bucket = grid.get(k);
        if (bucket) bucket.push(i);
        else grid.set(k, [i]);
      }

      // Draw connections: each particle checks its cell + forward neighbors only.
      // Same pairs as the old i<j full scan, minus the far-apart sqrt calls.
      const connSq = connectionDistance * connectionDistance;
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#0073e6';
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const cx = Math.floor(particle.x / cell);
        const cy = Math.floor(particle.y / cell);
        particle.connections.length = 0;
        for (let gx = cx - 1; gx <= cx + 1; gx++) {
          for (let gy = cy - 1; gy <= cy + 1; gy++) {
            const bucket = grid.get(gx * 100000 + gy);
            if (!bucket) continue;
            for (let b = 0; b < bucket.length; b++) {
              const j = bucket[b];
              if (j <= i) continue;
              const other = particles[j];
              const dx = other.x - particle.x;
              if (dx > connectionDistance || dx < -connectionDistance) continue;
              const dy = other.y - particle.y;
              if (dy > connectionDistance || dy < -connectionDistance) continue;
              const distSq = dx * dx + dy * dy;
              if (distSq < connSq) {
                const distance = Math.sqrt(distSq);
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.globalAlpha = (1 - distance / connectionDistance) * 0.9 * particle.alpha * other.alpha;
                ctx.stroke();
                particle.connections.push(j);
                other.connections.push(i);
              }
            }
          }
        }
      }

      // Draw particles; one batched fill pass per color, no per-frame gradients
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

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
      for (let i = 0; i < particles.length; i++) particles[i].targetAlpha = particles[i].baseAlpha;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      io.disconnect();
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