#!/usr/bin/env bun

import { parseMarkdown } from '../src/lib/markdown'
import { demoProjects, demoPosts } from '../src/lib/demo-content'
import fs from 'fs/promises'
import path from 'path'

interface ContentManifest {
  posts: Record<string, {
    slug: string
    title: string
    description: string
    date: string
    htmlPath: string
    frontMatter: any
  }>
  projects: Record<string, {
    slug: string
    title: string
    description: string
    date: string
    htmlPath: string
    frontMatter: any
  }>
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    // Directory exists
  }
}

async function prebuildContent() {
  console.log('🚀 Starting content prebuild...')
  
  const outputDir = path.join(process.cwd(), 'public', 'content')
  await ensureDir(outputDir)
  await ensureDir(path.join(outputDir, 'posts'))
  await ensureDir(path.join(outputDir, 'projects'))
  
  const manifest: ContentManifest = {
    posts: {},
    projects: {}
  }
  
  // Process posts
  console.log('📝 Building posts...')
  for (const post of demoPosts) {
    const { content, frontMatter } = await parseMarkdown(post.content)
    const htmlPath = `/content/posts/${post.slug}.html`
    
    await fs.writeFile(
      path.join(process.cwd(), 'public', htmlPath),
      content
    )
    
    manifest.posts[post.slug] = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      htmlPath,
      frontMatter
    }
    
    console.log(`  ✅ Built: ${post.title}`)
  }
  
  // Process projects
  console.log('🔧 Building projects...')
  for (const project of demoProjects) {
    const { content, frontMatter } = await parseMarkdown(project.content)
    const htmlPath = `/content/projects/${project.slug}.html`
    
    await fs.writeFile(
      path.join(process.cwd(), 'public', htmlPath),
      content
    )
    
    manifest.projects[project.slug] = {
      slug: project.slug,
      title: project.title,
      description: project.description,
      date: project.date,
      htmlPath,
      frontMatter
    }
    
    console.log(`  ✅ Built: ${project.title}`)
  }
  
  // Write manifest
  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
  
  console.log('\n✨ Content prebuild complete!')
  console.log(`📦 Built ${Object.keys(manifest.posts).length} posts and ${Object.keys(manifest.projects).length} projects`)
  console.log(`📄 Manifest written to: public/content/manifest.json`)
}

prebuildContent().catch(console.error)