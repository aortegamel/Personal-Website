import React, { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface ParticleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  particleCount?: number;
  colors?: string[];
}

// Particles live in a ref, never in state: the old version called
// setState inside requestAnimationFrame and re-rendered React 60x/s
// forever. The loop now runs only while particles exist.
export default function ParticleButton({
  children,
  className = '',
  onClick,
  particleCount = 30,
  colors = ['#ffc300', '#ffcf33', '#ffdb66', '#0073e6', '#338fff']
}: ParticleButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const partsRef = useRef<Particle[]>([]);
  const rafRef = useRef(0);
  const hoverRef = useRef(false);
  const colorsRef = useRef(colors);
  colorsRef.current = colors;

  const spawn = (x: number, y: number, n: number) => {
    const parts = partsRef.current;
    const palette = colorsRef.current;
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 3 + 2;
      parts.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        size: Math.random() * 3 + 1,
        color: palette[(Math.random() * palette.length) | 0],
      });
    }
    if (parts.length > 100) parts.splice(0, parts.length - 100);
    if (!rafRef.current) tick();
  };

  const tick = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      rafRef.current = 0;
      return;
    }
    const parts = partsRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life -= 0.02;
      if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y > canvas.height) {
        parts[i] = parts[parts.length - 1];
        parts.pop();
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    rafRef.current = parts.length ? requestAnimationFrame(tick) : 0;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!canvas || !button) return;
    const rect = button.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const pos = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hoverRef.current || Math.random() <= 0.8) return;
    const { x, y } = pos(e);
    spawn(x, y, 1);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { x, y } = pos(e);
    spawn(x, y, particleCount);
    onClick?.();
  };

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-visible ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { hoverRef.current = true }}
      onMouseLeave={() => { hoverRef.current = false }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />
      <span className="relative z-20">{children}</span>
    </button>
  );
}