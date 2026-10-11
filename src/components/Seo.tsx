import { useEffect } from 'react'

interface SeoProps {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Keeps title/meta/canonical/JSON-LD in sync on SPA navigation.
// Crawlers get the same tags from prerendered HTML; this covers share
// previews and in-app navigation. No dependencies.
export function Seo({
  title,
  description,
  path,
  type = 'website',
  noindex = false,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const url = `${window.location.origin}${path}`
    const ogImage = `${window.location.origin}/og-cover.svg`
    document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canon) {
      canon = document.createElement('link')
      canon.rel = 'canonical'
      document.head.appendChild(canon)
    }
    canon.href = url
    let ld = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]')
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement('script')
        ld.type = 'application/ld+json'
        ld.setAttribute('data-seo-jsonld', 'true')
        document.head.appendChild(ld)
      }
      ld.textContent = JSON.stringify(jsonLd)
    } else if (ld) {
      ld.remove()
    }
  }, [title, description, path, type, noindex, jsonLd])
  return null
}
