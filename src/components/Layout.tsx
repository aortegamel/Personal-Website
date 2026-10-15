import { useEffect, useLayoutEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import ParticlesBackground from './ParticlesBackground'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { key, pathname } = useLocation()

  // A new page starts at the top. Layout effects run before paint, so the
  // new page never flashes at the previous scroll offset.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (
      typeof CSS === 'undefined' || !CSS.highlights ||
      typeof Highlight === 'undefined' || typeof Intl.Segmenter === 'undefined' ||
      (!document.caretPositionFromPoint && !document.caretRangeFromPoint)
    ) return

    // Native highlights leave the DOM, selection, and link/button actions unchanged.
    const range = document.createRange()
    const highlight = new Highlight(range)
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' })
    const glyphSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    let cachedNode: Text | null = null
    let cachedText = ''
    let segments: Intl.Segments | undefined
    let glyphs: Intl.Segments | undefined
    let frame: number | null = null
    let latestPointer: PointerEvent | null = null
    let activeWord: {
      text: string
      rect: { x: number; y: number; width: number; height: number }
    } | null = null
    const clear = () => {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      latestPointer = null
      CSS.highlights.delete('hovered-word')
      if (activeWord) {
        activeWord = null
        window.dispatchEvent(new CustomEvent('portfolio:word-hover', { detail: null }))
      }
    }

    const move = (event: PointerEvent) => {
      if (
        (event.pointerType !== 'mouse' && event.pointerType !== 'pen') ||
        event.buttons !== 0 || window.getSelection()?.isCollapsed === false
      ) {
        clear()
        return
      }

      const { clientX: x, clientY: y } = event
      const caret = document.caretPositionFromPoint?.(x, y)
      const fallback = !caret ? document.caretRangeFromPoint?.(x, y) : null
      const node = caret?.offsetNode ?? fallback?.startContainer
      const offset = caret?.offset ?? fallback?.startOffset
      const parent = node?.parentElement
      if (
        !(node instanceof Text) || offset === undefined || !parent ||
        !parent.closest('header, main, footer') || parent.isContentEditable ||
        parent.closest('a, button, input, textarea, select, script, style, [aria-hidden="true"], [role="button"]') ||
        !(event.target instanceof Element) || !event.target.contains(node)
      ) {
        clear()
        return
      }

      if (cachedNode !== node || cachedText !== node.data) {
        cachedNode = node
        cachedText = node.data
        segments = segmenter.segment(cachedText)
        glyphs = glyphSegmenter.segment(cachedText)
      }

      // Carets can follow a glyph. Its rectangle must contain the pointer, not nearby whitespace.
      for (const position of [offset, offset - 1]) {
        const glyph = glyphs?.containing(position)
        // Word segments can include apostrophes or decimal points. Punctuation must not activate them.
        if (!glyph || !/[\p{L}\p{N}\p{M}]/u.test(glyph.segment)) continue
        const word = segments?.containing(glyph.index)
        if (!word?.isWordLike) continue
        range.setStart(node, glyph.index)
        range.setEnd(node, glyph.index + glyph.segment.length)
        for (const rect of range.getClientRects()) {
          if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) {
            range.setStart(node, word.index)
            range.setEnd(node, word.index + word.segment.length)
            CSS.highlights.set('hovered-word', highlight)
            // The eye receives the native word box only when its text or viewport geometry changes.
            const { x, y, width, height } = range.getBoundingClientRect()
            if (
              activeWord?.text !== word.segment ||
              activeWord.rect.x !== x || activeWord.rect.y !== y ||
              activeWord.rect.width !== width || activeWord.rect.height !== height
            ) {
              activeWord = { text: word.segment, rect: { x, y, width, height } }
              window.dispatchEvent(new CustomEvent('portfolio:word-hover', { detail: activeWord }))
            }
            return
          }
        }
      }
      clear()
    }
    // Process only the latest pointer position each frame. Clear also cancels scheduled hit tests.
    const queueMove = (event: PointerEvent) => {
      latestPointer = event
      if (frame !== null) return
      frame = requestAnimationFrame(() => {
        frame = null
        const pointer = latestPointer
        latestPointer = null
        if (pointer) move(pointer)
      })
    }
    const exit = (event: PointerEvent) => {
      if (!event.relatedTarget) clear()
    }
    const selection = () => {
      if (window.getSelection()?.isCollapsed === false) clear()
    }

    document.addEventListener('pointermove', queueMove, { passive: true })
    document.addEventListener('pointerdown', clear, true)
    document.addEventListener('pointerout', exit)
    document.addEventListener('pointercancel', clear)
    document.addEventListener('selectionchange', selection)
    window.addEventListener('blur', clear)
    window.addEventListener('scroll', clear, { capture: true, passive: true })
    return () => {
      document.removeEventListener('pointermove', queueMove)
      document.removeEventListener('pointerdown', clear, true)
      document.removeEventListener('pointerout', exit)
      document.removeEventListener('pointercancel', clear)
      document.removeEventListener('selectionchange', selection)
      window.removeEventListener('blur', clear)
      window.removeEventListener('scroll', clear, true)
      clear()
    }
  }, [key]) // Route changes remove the old highlight and reset the text cache.

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}