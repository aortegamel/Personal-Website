/// <reference types="bun" />
import { describe, expect, test } from 'bun:test'
import { parseMd, parsePost, parseProject, publishedPosts } from './content-source'
import { formatDate } from './utils'

const post = (front: string, body = 'Body text.\n') => `---\n${front}\n---\n${body}`
const valid = 'title: Hello\ndescription: A post\ndate: 2026-01-05'

describe('parseMd', () => {
  test('normalizes BOM and CRLF, removes single and double quotes', () => {
    const { data, content } = parseMd(
      "\uFEFF---\r\ntitle: 'It''s here'\r\ndescription: \"Quoted: yes\"\r\ntags:\r\n  - 'a'\r\n  - \"b\"\r\n---\r\nLine one\r\nLine two\r\n",
    )
    expect(data).toEqual({ title: "It's here", description: 'Quoted: yes', tags: ['a', 'b'] })
    expect(content).toBe('Line one\nLine two\n')
  })

  test('only unquoted true/false become booleans', () => {
    expect(parseMd(post("a: true\nb: 'true'\nc: \"false\"")).data).toEqual({ a: true, b: 'true', c: 'false' })
  })

  test.each([
    ['|', 'line one\nline two'],
    ['|-', 'line one\nline two'],
    ['|+', 'line one\nline two'],
    ['>', 'line one line two'],
    ['>-', 'line one line two'],
    ['>+', 'line one line two'],
  ] as const)('reads the full %s block scalar', (header, expected) => {
    const { data, unparsed } = parseMd(post(`d: ${header}\n  line one\n  line two\nnext: x`))
    expect(data).toEqual({ d: expected, next: 'x' })
    expect(unparsed).toEqual([])
  })

  test('keeps blank-separated block scalar content', () => {
    expect(parseMd(post('d: >-\n  para one\n\n  para two\n\nnext: x')).data.d).toBe('para one\npara two')
    expect(parseMd(post('d: |\n  a\n    b\n\n  c')).data.d).toBe('a\n  b\n\nc')
  })

  test('records unread lines with file line numbers, skipping blanks and comments', () => {
    expect(parseMd(post('# note\n\na: b\n  stray\n[x]')).unparsed).toEqual([
      { line: 5, text: '  stray', key: 'a' },
      { line: 6, text: '[x]', key: 'a' },
    ])
  })
})

describe('parsePost', () => {
  test('returns a published post with optional fields', () => {
    expect(parsePost(post(`${valid}\nupdated: 2026-02-01\ntags:\n  - ai`), 'hello')).toEqual({
      slug: 'hello',
      title: 'Hello',
      description: 'A post',
      date: '2026-01-05',
      updated: '2026-02-01',
      tags: ['ai'],
      content: 'Body text.\n',
    })
  })

  test('drafts return null even when incomplete', () => {
    expect(parsePost(post('draft: true'), 'Not A Slug')).toBeNull()
    expect(parsePost(post(`${valid}\ndraft: false`), 'hello')?.slug).toBe('hello')
  })

  test('accepts leap days and rejects non-leap days', () => {
    expect(parsePost(post('title: T\ndescription: D\ndate: 2024-02-29'), 'leap')?.date).toBe('2024-02-29')
    expect(() => parsePost(post('title: T\ndescription: D\ndate: 2025-02-29'), 'non-leap')).toThrow(/date must be/)
  })

  test.each([
    ['missing title', post('description: A post\ndate: 2026-01-05'), /title is required/],
    ['missing description', post('title: T\ndate: 2026-01-05'), /description is required/],
    ['missing date', post('title: T\ndescription: D'), /date must be/],
    ['no frontmatter', 'Just text', /title is required/],
    ['impossible date', post('title: T\ndescription: D\ndate: 2026-02-30'), /date must be a valid YYYY-MM-DD/],
    ['datetime', post('title: T\ndescription: D\ndate: 2026-01-05T10:00:00Z'), /date must be/],
    ['bad updated', post(`${valid}\nupdated: 2026-13-01`), /updated must be/],
    ['flow tags', post(`${valid}\ntags: [a, b]`), /tags must be a block list/],
    ['quoted draft', post(`${valid}\ndraft: 'true'`), /draft must be true or false/],
    ['updated before date', post(`${valid}\nupdated: 2026-01-04`), /updated \(2026-01-04\) must not be before date \(2026-01-05\)/],
    [
      'wrapped plain description',
      post('title: T\ndescription: First half\n  second half\ndate: 2026-01-05'),
      /unsupported frontmatter line 4 after "description": "  second half"/,
    ],
    [
      'block indentation indicator',
      post('title: T\ndescription: |2\n  text\ndate: 2026-01-05'),
      /unsupported frontmatter line 4 after "description"/,
    ],
    ['nested map', post(`${valid}\nmeta:\n  a: b`), /unsupported frontmatter line 6 after "meta"/],
  ] as const)('rejects %s with the slug', (_name, raw, message) => {
    expect(() => parsePost(raw, 'hello')).toThrow(/^Blog post "hello": /)
    expect(() => parsePost(raw, 'hello')).toThrow(message)
  })

  test('rejects a non-slug filename for published posts', () => {
    expect(() => parsePost(post(valid), 'Hello World')).toThrow(/filename must be a lowercase slug/)
  })

  test('publishes a full wrapped block description and same-day update', () => {
    const p = parsePost(post('title: T\ndescription: |-\n  Real text\n  continues\ndate: 2026-01-05\nupdated: 2026-01-05'), 'hello')
    expect(p?.description).toBe('Real text\ncontinues')
    expect(p?.updated).toBe('2026-01-05')
  })

  test('drafts skip validation before unread lines can fail', () => {
    expect(parsePost(post('draft: true\ndescription: wrapped\n  more\nupdated: 2020-01-01\ndate: 2026-01-05'), 'hello')).toBeNull()
  })
})

test('publishedPosts drops drafts and sorts newest first, slug tie-break', () => {
  const at = (date: string) => post(`title: T\ndescription: D\ndate: ${date}`)
  const slugs = publishedPosts([
    { slug: 'b', raw: at('2026-01-01') },
    { slug: 'draft', raw: post('draft: true') },
    { slug: 'a', raw: at('2026-01-01') },
    { slug: 'c', raw: at('2026-03-01') },
  ]).map((p) => p.slug)
  expect(slugs).toEqual(['c', 'a', 'b'])
})

describe('parseProject', () => {
  const project = (front: string) => `---\nname: P\n${front}\n---\nBody\n`

  test('keeps web and relative links, and falls back from demo to webpage', () => {
    expect(parseProject(project('github: https://github.com/a/b\ndemo: /blog/a/'), 'p')).toMatchObject({
      github: 'https://github.com/a/b',
      demo: '/blog/a/',
    })
    expect(parseProject(project('webpage: https://example.com'), 'p').demo).toBe('https://example.com')
  })

  test.each([
    ['github', 'javascript:alert(1)'],
    ['github', "'JavaScript:alert(1)'"],
    ['demo', 'data:text/html,x'],
    ['webpage', 'vbscript:x'],
    ['demo', '"java\tscript:alert(1)"'],
    ['github', ''],
  ] as const)('rejects unsafe %s %p with the slug and field', (field, value) => {
    expect(() => parseProject(project(`${field}: ${value}`), 'evil')).toThrow(
      new RegExp(`^Project "evil": ${field} must be an http\\(s\\) or relative URL`),
    )
  })

  test('rejects unsafe webpage even when demo is safe', () => {
    expect(() => parseProject(project('demo: https://ok.dev\nwebpage: javascript:x'), 'p')).toThrow(/webpage must be/)
  })

  test.each([
    ['bad date', 'date: 2026-02-30', /^Project "p": date must be a valid YYYY-MM-DD date/],
    ['wrapped description', 'description: First\n  second', /^Project "p": unsupported frontmatter line 4 after "description"/],
  ] as const)('rejects %s with the slug', (_name, front, message) => {
    expect(() => parseProject(project(front), 'p')).toThrow(message)
  })
})

test('formatDate keeps the calendar day in any timezone', () => {
  // West of UTC, local midnight is the previous day. The day must not shift.
  const previous = process.env.TZ
  try {
    process.env.TZ = 'America/Los_Angeles'
    expect(formatDate('2026-01-05')).toBe('January 5, 2026')
  } finally {
    if (previous === undefined) delete process.env.TZ
    else process.env.TZ = previous
  }
})
