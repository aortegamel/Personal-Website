#!/usr/bin/env bun

import { serve } from 'bun'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'

const DIST_DIR = join(process.cwd(), 'dist')
const PORT = 3000

// MIME types for different file extensions
const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

async function serveFile(path: string): Promise<Response> {
  try {
    const filePath = join(DIST_DIR, path)
    const content = await readFile(filePath)
    const ext = extname(filePath)
    const contentType = mimeTypes[ext] || 'text/plain'
    
    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      }
    })
  } catch (error) {
    return null
  }
}

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    let pathname = url.pathname
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`)
    
    // Remove trailing slash except for root
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1)
    }
    
    // Try exact path first
    let response = await serveFile(pathname)
    if (response) return response
    
    // Try with .html extension
    response = await serveFile(pathname + '.html')
    if (response) return response
    
    // Try index.html in directory
    response = await serveFile(pathname + '/index.html')
    if (response) return response
    
    // For client-side routing, serve index.html for unknown paths
    // This allows the React app to handle routing
    if (!pathname.includes('.')) {
      response = await serveFile('index.html')
      if (response) return response
    }
    
    // 404
    return new Response('Not Found', { status: 404 })
  }
})

console.log(`
🚀 Hybrid Walrus Site Server

Serving: ${DIST_DIR}
URL: http://localhost:${PORT}

Test these routes:
- http://localhost:${PORT}/ (React SPA)
- http://localhost:${PORT}/posts (Static pre-rendered)
- http://localhost:${PORT}/projects (Static pre-rendered)
- http://localhost:${PORT}/posts/ (Static pre-rendered)
- http://localhost:${PORT}/about (React SPA route)

Press Ctrl+C to stop
`)