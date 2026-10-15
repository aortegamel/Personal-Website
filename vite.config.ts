import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { readdir, readFile } from 'node:fs/promises'
import { publishedPosts } from './src/lib/content-source'

const BLOG_DIR = path.resolve(import.meta.dirname, 'src/content/blog')
const BLOG_ID = 'virtual:blog-posts'
const RESOLVED_BLOG_ID = '\0' + BLOG_ID

// Parses src/content/blog/*.md in Node and exports only published posts,
// so draft text never enters the browser bundle. A missing directory
// means no posts. Invalid published metadata fails the build. In dev,
// any blog file add/change/delete reloads the page with fresh data.
function blogPosts(): Plugin {
  return {
    name: 'blog-posts',
    resolveId: (id) => (id === BLOG_ID ? RESOLVED_BLOG_ID : undefined),
    async load(id) {
      if (id !== RESOLVED_BLOG_ID) return
      const files = await readdir(BLOG_DIR).catch((e: NodeJS.ErrnoException) => {
        if (e.code === 'ENOENT') return [] as string[]
        throw e
      })
      const sources = await Promise.all(
        files
          .filter((f) => f.endsWith('.md'))
          .map(async (f) => ({ slug: f.slice(0, -3), raw: await readFile(path.join(BLOG_DIR, f), 'utf8') })),
      )
      return `export default ${JSON.stringify(publishedPosts(sources))}`
    },
    configureServer(server) {
      server.watcher.add(BLOG_DIR)
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(BLOG_DIR + path.sep) || !file.endsWith('.md')) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_BLOG_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), blogPosts()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
  },
  // Default host (localhost) keeps dev/preview off the LAN. Pass --host to opt in.
  server: {
    port: 3000,
    strictPort: false,
    fs: {
      // Setting deny replaces Vite's defaults, so the first four repeat them.
      // Blog sources (drafts included) reach the app only via virtual:blog-posts.
      // This denies plain, ?raw, ?url, ?import, and /@fs requests for them.
      // The glob avoids embedding the checkout path, which may contain glob characters.
      deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/src/content/blog/**'],
    },
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
