import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { site } from '../site'

// Circular water portal. The viewport SVG keeps its tracking line outside hero clipping.
export function AbyssOrb({ className = '' }: { className?: string }) {
  const orbRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trackRef = useRef<SVGSVGElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const targetRef = useRef<SVGRectElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    const canvas = canvasRef.current
    const track = trackRef.current
    const line = lineRef.current
    const target = targetRef.current
    const ctx = canvas?.getContext('2d')
    if (!orb || !canvas || !ctx || !track || !line || !target) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const style = getComputedStyle(orb)
    const blue = style.getPropertyValue('--ocean-primary-light').trim() || '#338fff'
    const gold = style.getPropertyValue('--bitcoin-primary').trim() || '#fbbf24'
    const light = style.getPropertyValue('--bitcoin-primary-light').trim() || '#fcd34d'
    const dark = style.getPropertyValue('--abyss-deep').trim() || '#000b17'
    const glyphs = `${site.name} / ${site.tagline} / `
    const current = document.createElement('canvas')
    const currentCtx = current.getContext('2d')
    const glintSprite = document.createElement('canvas')
    const glintCtx = glintSprite.getContext('2d')
    if (!currentCtx || !glintCtx) return

    let bounds = orb.getBoundingClientRect()
    let width = 0
    let height = 0
    let dpr = 0
    let visible = false
    let reduced = motion.matches
    let raf = 0
    let last = 0
    let clock = 0
    let nextTide = 3200
    let tideStart = -Infinity
    let gazeX = 0
    let gazeY = 0
    let pointerX = 0
    let pointerY = 0
    let pointerAt = -Infinity
    let hasPointer = false
    let word: { x: number; y: number; width: number; height: number } | null = null
    let water: CanvasGradient | null = null
    let radius = 0
    // Fixed bubble seeds; positions derive from the clock so no per-frame allocation.
    const bubbles = Array.from({ length: 7 }, (_, i) => ({
      u: (i * 0.37 + 0.11) % 1,
      speed: 0.006 + (i % 3) * 0.003,
      phase: i * 1.7,
      r: 1 + (i % 3) * 0.8,
    }))

    // Cache glyph texture, water gradient, glint sprite, and device-pixel sizing outside the frame loop.
    const resize = () => {
      bounds = orb.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      if (bounds.width === width && bounds.height === height && ratio === dpr) return
      width = bounds.width
      height = bounds.height
      dpr = ratio
      if (!width || !height) return
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radius = Math.min(width, height) / 2 - 2
      water = ctx.createRadialGradient(width / 2, height / 2, radius * 0.05, width / 2, height / 2, radius)
      water.addColorStop(0, blue)
      water.addColorStop(1, dark)
      const pitch = width / 43
      const rowHeight = height / 17
      current.width = Math.round(width * 2 * dpr)
      current.height = Math.round(height * dpr)
      currentCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      currentCtx.font = `${pitch * 1.22}px ui-monospace, monospace`
      currentCtx.textBaseline = 'middle'
      currentCtx.fillStyle = light
      for (let row = 0; row < 17; row++) {
        for (let col = 0; col < 86; col++) {
          currentCtx.globalAlpha = 0.5 + ((row * 7 + col * 3) % 7) / 14
          currentCtx.fillText(glyphs[(row * 43 + col) % glyphs.length], col * pitch, row * rowHeight + rowHeight / 2)
        }
      }
      const sprite = 64
      glintSprite.width = sprite
      glintSprite.height = sprite
      const glow = glintCtx.createRadialGradient(sprite / 2, sprite / 2, 1, sprite / 2, sprite / 2, sprite / 2)
      glow.addColorStop(0, 'rgba(255,255,255,0.9)')
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      glintCtx.clearRect(0, 0, sprite, sprite)
      glintCtx.fillStyle = glow
      glintCtx.fillRect(0, 0, sprite, sprite)
      draw(0)
    }

    const draw = (swell: number) => {
      if (!width || !height || !water) return
      const cx = width / 2
      const cy = height / 2
      const offset = reduced ? 0 : (clock * 0.008) % width
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()
      ctx.globalAlpha = 1
      ctx.fillStyle = water
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      // Portfolio glyphs drift as underwater currents, pushed by the gaze target.
      ctx.globalAlpha = 0.35
      ctx.drawImage(current, -offset + gazeX * 0.5, gazeY * 0.5, width * 2, height)
      // Three sine wave layers; amplitude swells with the tide pulse.
      for (let layer = 0; layer < 3; layer++) {
        const baseY = cy + (layer - 1) * radius * 0.45
        const amp = (2.5 + layer * 1.8) * (1 + swell * 0.9)
        const phase = clock * (0.0009 + layer * 0.0003) + gazeX * 0.01 * (layer + 1) + layer * 2
        ctx.globalAlpha = 0.28 + layer * 0.06
        ctx.strokeStyle = layer === 1 ? light : blue
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (let x = cx - radius; x <= cx + radius; x += 6) {
          const y = baseY + Math.sin(x * 0.05 + phase) * amp + gazeY * 0.1 * (layer + 1)
          if (x === cx - radius) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      // Rising bubbles on fixed clock-driven tracks.
      ctx.strokeStyle = light
      for (const bubble of bubbles) {
        const travel = (clock * bubble.speed + bubble.phase * 20) % (radius * 2)
        const y = cy + radius - travel
        const x = cx + (bubble.u - 0.5) * radius * 1.4 + Math.sin(clock / 900 + bubble.phase) * 3
        ctx.globalAlpha = 0.4
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, bubble.r, 0, Math.PI * 2)
        ctx.stroke()
      }
      // Glint leans toward the pointer/word target.
      const maxGlint = radius * 0.35
      const gx = Math.max(-maxGlint, Math.min(maxGlint, gazeX * 0.6))
      const gy = Math.max(-maxGlint, Math.min(maxGlint, gazeY * 0.6))
      const glintSize = radius * 0.9
      ctx.globalAlpha = 0.5 + swell * 0.2
      ctx.drawImage(glintSprite, cx + gx - glintSize / 2, cy + gy - glintSize / 2, glintSize, glintSize)
      ctx.restore()
      // Thin gold rim brightens with the tide pulse.
      ctx.globalAlpha = 0.7 + swell * 0.3
      ctx.strokeStyle = gold
      ctx.lineWidth = 1.5 + swell
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const clearTarget = () => {
      hasPointer = false
      word = null
      track.style.visibility = 'hidden'
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
      clearTarget()
    }
    const tick = (now: number) => {
      raf = 0
      if (!visible || document.hidden || reduced || !width || !height) return
      const dt = Math.min(now - last, 50)
      last = now
      clock += dt
      const active = hasPointer && now - pointerAt < 2500
      const tx = word ? word.x + word.width / 2 : pointerX
      const ty = word ? word.y + word.height / 2 : pointerY
      const dx = tx - (bounds.left + width / 2)
      const dy = ty - (bounds.top + height / 2)
      const targetX = active ? Math.max(-1, Math.min(1, dx / 360)) * width * 0.235 : Math.sin(clock / 2800) * width * 0.035
      const targetY = active ? Math.max(-1, Math.min(1, dy / 260)) * height * 0.14 : Math.sin(clock / 3700) * height * 0.025
      const ease = 1 - Math.exp(-dt / 100)
      gazeX += (targetX - gazeX) * ease
      gazeY += (targetY - gazeY) * ease
      if (clock >= nextTide) {
        tideStart = clock
        nextTide = clock + 2600 + Math.random() * 3800
      }
      const tide = (clock - tideStart) / 650
      const swell = tide < 1 ? Math.sin(tide * Math.PI) : 0
      draw(swell)
      if (active) {
        line.setAttribute('x1', String(bounds.left + width / 2 + gazeX))
        line.setAttribute('y1', String(bounds.top + height / 2 + gazeY))
        line.setAttribute('x2', String(tx))
        line.setAttribute('y2', String(ty))
        target.setAttribute('x', String(word ? word.x - 2 : tx - 4))
        target.setAttribute('y', String(word ? word.y - 2 : ty - 4))
        target.setAttribute('width', String(word ? word.width + 4 : 8))
        target.setAttribute('height', String(word ? word.height + 4 : 8))
        track.style.visibility = 'visible'
      } else {
        track.style.visibility = 'hidden'
      }
      raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf && visible && !document.hidden && !reduced && width && height) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.buttons) {
        clearTarget()
        return
      }
      if (reduced || !visible || document.hidden) return
      pointerX = event.clientX
      pointerY = event.clientY
      pointerAt = performance.now()
      hasPointer = true
      wake()
    }
    const onWord = (event: Event) => {
      if (reduced || !visible || document.hidden) return
      const detail = (event as CustomEvent<{ text: string; rect: typeof word } | null>).detail
      word = detail?.rect ?? null
      if (word) {
        pointerAt = performance.now()
        hasPointer = true
        wake()
      }
    }
    const onScroll = () => {
      clearTarget()
      bounds = orb.getBoundingClientRect()
    }
    const onExit = (event: PointerEvent) => {
      if (!event.relatedTarget) clearTarget()
    }
    const onVisibility = () => {
      if (document.hidden) stop()
      else wake()
    }
    const onMotion = () => {
      reduced = motion.matches
      stop()
      gazeX = gazeY = 0
      tideStart = -Infinity
      nextTide = clock + 3200
      draw(0)
      wake()
    }
    const onResize = () => {
      resize()
      clearTarget()
      wake()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
      else stop()
    })
    const resizeObserver = new ResizeObserver(onResize)
    resize()
    observer.observe(orb)
    resizeObserver.observe(orb)
    // Real mouse/pen events remain valid when browser media queries report no fine pointer.
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', clearTarget, { passive: true })
    window.addEventListener('pointerout', onExit, { passive: true })
    window.addEventListener('portfolio:word-hover', onWord)
    window.addEventListener('blur', clearTarget)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    motion.addEventListener('change', onMotion)
    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', clearTarget)
      window.removeEventListener('pointerout', onExit)
      window.removeEventListener('portfolio:word-hover', onWord)
      window.removeEventListener('blur', clearTarget)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <>
      <div ref={orbRef} aria-hidden="true" className={`abyss-orb pointer-events-none absolute ${className}`}>
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
      {typeof document !== 'undefined' && createPortal(
        <svg
          ref={trackRef}
          aria-hidden="true"
          className="abyss-track pointer-events-none fixed inset-0 z-30 h-full w-full"
          style={{ visibility: 'hidden', color: 'var(--bitcoin-primary)' }}
        >
          <line ref={lineRef} stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" opacity="0.35" />
          <rect ref={targetRef} fill="none" stroke="currentColor" strokeWidth="1" rx="1" opacity="0.65" />
        </svg>,
        document.body,
      )}
    </>
  )
}
