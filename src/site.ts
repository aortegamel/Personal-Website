// Single source for site identity + public contact links.
// Content markdown keeps its own per-project links; only the portfolio
// owner's shared identity lives here. `url` is the Cloudflare Pages
// custom domain: every canonical, sitemap, JSON-LD, and LLM URL derives
// from it, never from the browsing origin.
export const site = {
  name: 'Angel Ortega-Melton',
  url: 'https://angelortegamelton.com',
  tagline: 'AI-integrated applications, agent tooling, and data pipelines',
  description:
    'Portfolio of Angel Ortega-Melton: AI-integrated applications, agent tooling, and data pipelines.',
  email: 'aortegamelton@gmail.com',
  social: {
    github: 'https://github.com/aortegamel',
    linkedin: 'https://www.linkedin.com/in/angel-ortega-melton-31647a186/',
  },
} as const

// Cloudflare Pages serves each route from <route>/index.html and
// redirects /route to /route/. Canonical, sitemap, and JSON-LD URLs use
// the final trailing-slash form so crawlers never follow a redirect.
export const routePath = (path: string): string => (path.endsWith('/') ? path : `${path}/`)
export const pageUrl = (path: string): string => `${site.url}${routePath(path)}`
// Clean Markdown counterpart of a route (llmstxt.org index.md convention).
export const markdownUrl = (path: string): string => `${pageUrl(path)}index.md`
