/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { mdToHtml } from './markdown'

describe('mdToHtml block boundaries', () => {
  test('wrapped prose stays one paragraph', () => {
    expect(mdToHtml('First line\r\nsecond line\n\nNext')).toBe('<p>First line\nsecond line</p>\n<p>Next</p>')
  })

  test('a wrapped line that starts with a number stays prose', () => {
    expect(mdToHtml('Released in\n2019. Then\n1. first')).toBe(
      '<p>Released in\n2019. Then</p>\n<ol><li>first</li></ol>',
    )
  })

  test('lists keep wrapped and blank-separated items, then return to prose', () => {
    expect(mdToHtml('- one\n  wrapped\n- two\n\n- three\n\nAfter')).toBe(
      '<ul><li>one\nwrapped</li><li>two</li><li>three</li></ul>\n<p>After</p>',
    )
    expect(mdToHtml('- a\n## H')).toBe('<ul><li>a</li></ul>\n<h2>H</h2>')
  })

  test('ordered lists keep their start and end at a different list type', () => {
    expect(mdToHtml('3. c\n4. d\n- e')).toBe('<ol start="3"><li>c</li><li>d</li></ol>\n<ul><li>e</li></ul>')
  })

  test('thematic breaks are not list items', () => {
    expect(mdToHtml('a\n***\n- - -\nb')).toBe('<p>a</p>\n<hr>\n<hr>\n<p>b</p>')
  })

  test('blockquote lines join into one quote', () => {
    expect(mdToHtml('> one\n> two\n\nafter')).toBe('<blockquote><p>one\ntwo</p></blockquote>\n<p>after</p>')
  })

  test('an indented paragraph after a blank line continues an ordered item', () => {
    expect(mdToHtml('1. one\n\n   continued paragraph\n   wraps\n\n2. two\n3. three\n\nAfter')).toBe(
      '<ol><li><p>one</p><p>continued paragraph\nwraps</p></li><li>two</li><li>three</li></ol>\n<p>After</p>',
    )
  })
})

describe('mdToHtml code and escaping', () => {
  test('fenced code is escaped verbatim, including markdown-like lines', () => {
    expect(mdToHtml('```ts\n<b>&\n\n**x**\n- y\n```\nafter')).toBe(
      '<pre><code>&lt;b&gt;&amp;\n\n**x**\n- y</code></pre>\n<p>after</p>',
    )
  })

  test('an unclosed fence keeps its content', () => {
    expect(mdToHtml('```\nconst a = 1 < 2')).toBe('<pre><code>const a = 1 &lt; 2</code></pre>')
  })

  test('text is escaped and inline code stays literal', () => {
    expect(
      mdToHtml('Use <script>alert("x")</script> & `src/**/*.ts` with **bold**, *em*, [docs](https://x.dev/?a=1&b=2)'),
    ).toBe(
      '<p>Use &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; <code>src/**/*.ts</code> with <strong>bold</strong>, <em>em</em>, <a href="https://x.dev/?a=1&amp;b=2">docs</a></p>',
    )
  })
})

describe('mdToHtml inline safety', () => {
  test('generated HTML is never parsed again (nested image/link handler injection)', () => {
    expect(mdToHtml("[hover](![ onmouseover=window.name='modern-audit-handler' ](x))")).toBe(
      `<p>[hover](<img alt=" onmouseover=window.name='modern-audit-handler' " src="x" loading="lazy">)</p>`,
    )
  })

  test('executable and control-obfuscated destinations never become active', () => {
    expect(
      mdToHtml(
        '[a](javascript:alert(1)) [b](JaVaScRiPt:alert(1)) [d](java\u0001script:x) [e](data:text/html,x) ![i](javascript:x) ![j](mailto:a@b.c)',
      ),
    ).toBe('<p>a b d e i j</p>')
    expect(mdToHtml('[c](java\tscript:alert(1))')).toBe('<p>[c](java\tscript:alert(1))</p>')
  })

  test('web, relative, and mailto destinations stay active', () => {
    expect(mdToHtml('[m](mailto:a@b.c) [r](/blog/x/#top) ![p](./a.png)')).toBe(
      '<p><a href="mailto:a@b.c">m</a> <a href="/blog/x/#top">r</a> <img alt="p" src="./a.png" loading="lazy"></p>',
    )
  })

  test('destinations keep balanced parentheses', () => {
    expect(mdToHtml('[Wiki](https://en.wikipedia.org/wiki/Foo_(bar)) (see [docs](https://x.dev/a))')).toBe(
      '<p><a href="https://en.wikipedia.org/wiki/Foo_(bar)">Wiki</a> (see <a href="https://x.dev/a">docs</a>)</p>',
    )
  })

  test('emphasis and code never leak into href, src, or alt', () => {
    expect(
      mdToHtml('[glob](https://x.dev/**/*.ts) ![a *b* c](https://x.dev/a_*b*.png) [`a]b` *x*](https://x.dev/*y*)'),
    ).toBe(
      '<p><a href="https://x.dev/**/*.ts">glob</a> <img alt="a *b* c" src="https://x.dev/a_*b*.png" loading="lazy"> <a href="https://x.dev/*y*"><code>a]b</code> <em>x</em></a></p>',
    )
  })

  test('emphasis needs valid boundaries', () => {
    expect(
      mdToHtml('snake*case*name, 2*3*4 and a * b * c stay, but **bold *nested* text** and *[x](https://x.dev)* work'),
    ).toBe(
      '<p>snake*case*name, 2*3*4 and a * b * c stay, but <strong>bold <em>nested</em> text</strong> and <em><a href="https://x.dev">x</a></em> work</p>',
    )
  })
})
