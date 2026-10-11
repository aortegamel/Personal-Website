import { useEffect, useRef } from 'react'

// Static dial ticks: 12 marks, cardinals longer. Computed once, never per frame.
const TICKS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6
  const cardinal = i % 3 === 0
  const r1 = cardinal ? 40 : 43
  return {
    x1: 50 + r1 * Math.sin(a),
    y1: 50 - r1 * Math.cos(a),
    x2: 50 + 46 * Math.sin(a),
    y2: 50 - 46 * Math.cos(a),
    cardinal,
  }
})

// Decorative compass: the needle tracks the pointer with eased motion.
// One rAF loop, sleeps when settled, hidden tab, or off-screen.
// Static (no animation) under reduced-motion or coarse pointers.
export function CompassOrb({ className = '' }: { className?: string }) {
  const orbRef = useRef<HTMLDivElement>(null)
  const needleRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    const needle = needleRef.current
    if (!orb || !needle) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let target = 0
    let angle = 0
    let raf = 0
    let last = 0
    let visible = true

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(((now - last) / 1000) || 1 / 60, 0.1)
      last = now
      const k = Math.min(1, dt * 10)
      x += (tx - x) * k
      y += (ty - y) * k
      const diff = ((target - angle + 540) % 360) - 180 // shortest arc
      angle += diff * k
      orb.style.transform = `translate(${(x * 10).toFixed(2)}px, ${(y * 10).toFixed(2)}px)`
      needle.setAttribute('transform', `rotate(${angle.toFixed(2)} 50 50)`)
      if (Math.abs(tx - x) > 0.005 || Math.abs(ty - y) > 0.005 || Math.abs(diff) > 0.05) {
        raf = requestAnimationFrame(tick)
      }
    }

    const wake = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }

    const onMove = (e: PointerEvent) => {
      const r = orb.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      target = (Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180) / Math.PI
      tx = Math.max(-1, Math.min(1, (e.clientX - cx) / 300))
      ty = Math.max(-1, Math.min(1, (e.clientY - cy) / 300))
      wake()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
    })
    io.observe(orb)
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={orbRef} aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_0_12px_rgba(255,195,0,0.35)]">
        <circle cx="50" cy="50" r="46" fill="rgba(0,22,46,0.55)" stroke="#ffc300" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="34" fill="none" stroke="#338fff" strokeOpacity="0.25" strokeWidth="1" />
        {TICKS.map(({ cardinal, ...p }, i) => (
          <line key={i} {...p} stroke={cardinal ? '#ffc300' : '#66abff'} strokeOpacity={cardinal ? 0.9 : 0.5} strokeWidth={cardinal ? 2 : 1} />
        ))}
        <text x="50" y="16" textAnchor="middle" fontSize="8" fill="#ffc300" fontFamily="monospace">N</text>
        <g ref={needleRef}>
          <path d="M50 22 L54 50 L46 50 Z" fill="#ffc300" />
          <path d="M50 78 L54 50 L46 50 Z" fill="#338fff" fillOpacity="0.7" />
        </g>
        <circle cx="50" cy="50" r="3" fill="#00f5ff" />
      </svg>
    </div>
  )
}
