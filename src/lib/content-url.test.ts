/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { safeContentUrl } from './content-url'

describe('safeContentUrl', () => {
  test.each([
    'https://example.com/a?b=1#c',
    'http://example.com',
    '//cdn.example.com/x.png',
    '/projects/stockbot/',
    'notes/a.md',
    '#overview',
    '?page=2',
    'https://en.wikipedia.org/wiki/Foo_(bar)',
  ])('keeps web or relative %p as written', (url) => {
    expect(safeContentUrl(url)).toBe(url)
  })

  test('trims the source and never resolves it against the parse base', () => {
    expect(safeContentUrl('  /blog/  ')).toBe('/blog/')
  })

  test.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '  javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'blob:https://example.com/id',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'javascript\r:alert(1)',
    '\u0001javascript:alert(1)',
    'https://example.com/\u0000',
    'https://example.com/\u0085',
    'http://[',
    '',
    '   ',
    'mailto:me@example.com',
  ])('rejects %p by default', (url) => {
    expect(safeContentUrl(url)).toBeNull()
  })

  test('allows mailto only on request, and never executable schemes', () => {
    expect(safeContentUrl('mailto:me@example.com', true)).toBe('mailto:me@example.com')
    expect(safeContentUrl('javascript:alert(1)', true)).toBeNull()
    expect(safeContentUrl('MAILTO:me@example.com', false)).toBeNull()
  })
})
