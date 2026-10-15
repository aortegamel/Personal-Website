import { useEffect } from 'react'
import { markdownUrl, pageUrl, site } from '../site'
import type { Post } from '../types/content'

interface SeoProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

// Constants and JSON-LD builders are shared with scripts/prerender.ts,
// so build-time HTML and client updates emit identical tags.
export const OG_IMAGE = `${site.url}/og-cover.png`
export const BLOG_TITLE = `Blog | ${site.name}`
export const BLOG_DESCRIPTION = 'Blogs written by me, about anything that I think matters and my opinions, subject to change!'

const author = { '@type': 'Person', name: site.name, url: pageUrl('/') }

export function pageJsonLd(
  schemaType: string,
  headline: string,
  description: string,
  path: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline,
    description,
    url: pageUrl(path),
    author,
    ...extra,
  }
}

export const blogJsonLd = (): Record<string, unknown> =>
  pageJsonLd('Blog', BLOG_TITLE, BLOG_DESCRIPTION, '/blog')

export function postJsonLd(post: Post): Record<string, unknown> {
  const path = `/blog/${post.slug}`
  return pageJsonLd('BlogPosting', post.title, post.description, path, {
    datePublished: post.date,
    ...(post.updated ? { dateModified: post.updated } : {}),
    ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    mainEntityOfPage: pageUrl(path),
  })
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string | null): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// selector must match a <link> carrying exactly these attributes.
function upsertLink(selector: string, attrs: Record<string, string> | null): void {
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!attrs) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    document.head.appendChild(el)
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
}

// Keeps title/meta/canonical/JSON-LD/discovery links in sync on SPA
// navigation. URLs always derive from site.url, never the browsing
// origin. Prerendered HTML marks its JSON-LD block with data-seo-jsonld,
// so this updates that block instead of adding a second one.
export function Seo({
  title,
  description,
  path,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    // Noindex pages (404) have no canonical URL or Markdown counterpart.
    const url = noindex ? null : pageUrl(path)
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', typeof jsonLd?.keywords === 'string' ? jsonLd.keywords : null)
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', OG_IMAGE)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', OG_IMAGE)
    upsertLink('link[rel="canonical"]', url === null ? null : { rel: 'canonical', href: url })
    upsertLink(
      'link[rel="alternate"][type="text/markdown"]',
      url === null ? null : { rel: 'alternate', type: 'text/markdown', href: markdownUrl(path) },
    )
    upsertLink('link[rel="describedby"]', { rel: 'describedby', href: `${site.url}/llms.txt` })
    let ld = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]')
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement('script')
        ld.type = 'application/ld+json'
        ld.setAttribute('data-seo-jsonld', '')
        document.head.appendChild(ld)
      }
      ld.textContent = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    } else if (ld) {
      ld.remove()
    }
  }, [title, description, path, type, noindex, jsonLd])
  return null
}
