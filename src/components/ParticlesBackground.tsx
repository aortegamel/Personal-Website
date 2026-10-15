import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle settings; count scales with viewport to match hero density
    const particles: Particle[] = []
    const particleCount = Math.min(280, Math.max(100, Math.round((window.innerWidth * window.innerHeight) / 4500)))
    const colors = ['#fbbf24', '#0073e6', '#00f5ff', '#338fff']

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    // Animation loop; pauses when the tab is hidden
    let animationId: number
    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.6
        ctx.fill()

        // Draw connections; axis pre-check plus squared distance skips sqrt for far pairs
        for (let j = index + 1; j < particles.length; j++) {
          const otherParticle = particles[j]
          const dx = particle.x - otherParticle.x
          if (dx > 150 || dx < -150) continue
          const dy = particle.y - otherParticle.y
          if (dy > 150 || dy < -150) continue
          const distSq = dx * dx + dy * dy
          if (distSq >= 22500) continue
          const distance = Math.sqrt(distSq)
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.strokeStyle = particle.color
          ctx.globalAlpha = 0.45 * (1 - distance / 150)
          ctx.stroke()
        }
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  )
}