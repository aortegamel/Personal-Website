#!/usr/bin/env bun

import { generateStaticPages } from './generate-static'
import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

async function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Command failed with code ${code}`))
    })
  })
}

async function copyDirectory(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

async function buildHybrid() {
  console.log('🚀 Starting hybrid build process...\n')
  
  try {
    // Step 1: Run prebuild to generate content
    console.log('📝 Step 1: Generating content HTML...')
    await runCommand('bun', ['run', 'prebuild'])
    
    // Step 2: Generate static pages
    console.log('\n🏗️  Step 2: Generating static pages...')
    await generateStaticPages()
    
    // Step 3: Build React app with Vite
    console.log('\n⚛️  Step 3: Building React app...')
    await runCommand('bun', ['run', 'build:only'])
    
    // Step 4: Merge static pages into dist
    console.log('\n🔀 Step 4: Merging outputs...')
    const staticDir = path.join(process.cwd(), '.tmp-static')
    const distDir = path.join(process.cwd(), 'dist')
    
    try {
      // Check if static directory exists
      await fs.access(staticDir)
      
      // Copy static HTML files to dist root
      const staticFiles = await fs.readdir(staticDir)
      for (const file of staticFiles) {
        if (file.endsWith('.html') && file !== 'index.html') {
          // Don't overwrite the main index.html from Vite
          await fs.copyFile(
            path.join(staticDir, file),
            path.join(distDir, file)
          )
        }
      }
      
      // Copy static subdirectories
      await copyDirectory(
        path.join(staticDir, 'posts'),
        path.join(distDir, 'posts')
      )
      await copyDirectory(
        path.join(staticDir, 'projects'),
        path.join(distDir, 'projects')
      )
      
      // Clean up temporary static directory
      await fs.rm(staticDir, { recursive: true, force: true })
      
    } catch (error) {
      console.log('⚠️  Static directory not found, skipping merge')
    }
    
    // Step 5: Create Walrus manifest
    console.log('\n📋 Step 5: Creating Walrus manifest...')
    await createWalrusManifest()
    
    console.log('\n✅ Hybrid build complete!')
    console.log('📦 Output directory: dist/')
    console.log('\nTo deploy to Walrus, run:')
    console.log('  site-builder deploy ./dist --epochs 100')
    
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

async function createWalrusManifest() {
  const manifest = {
    version: '1.0',
    routes: [
      { path: '/', static: false }, // SPA handles dynamic homepage
      { path: '/posts', static: true },
      { path: '/projects', static: true },
      { path: '/posts/*', static: true },
      { path: '/projects/*', static: true },
      { path: '/*', static: false } // Everything else handled by SPA
    ],
    headers: {
      '*.html': {
        'Cache-Control': 'public, max-age=3600',
        'Content-Type': 'text/html; charset=utf-8'
      },
      '*.js': {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'application/javascript'
      },
      '*.css': {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': 'text/css'
      }
    }
  }
  
  await fs.writeFile(
    path.join(process.cwd(), 'dist', 'walrus-manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
}

// Run if called directly
if (import.meta.main) {
  buildHybrid().catch(console.error)
}

export { buildHybrid }