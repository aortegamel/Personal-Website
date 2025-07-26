#!/usr/bin/env bun

import { demoPosts, demoProjects } from '../src/lib/demo-content'
import { parseMarkdown } from '../src/lib/markdown'
import { htmlTemplate, pageContent, listTemplate, homeTemplate } from '../src/static/templates'
import fs from 'fs/promises'
import path from 'path'

const STATIC_DIR = path.join(process.cwd(), '.tmp-static')

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    // Directory exists
  }
}

async function generateStaticPages() {
  console.log('🏗️  Starting static page generation...')
  
  // Ensure output directories exist
  await ensureDir(STATIC_DIR)
  await ensureDir(path.join(STATIC_DIR, 'posts'))
  await ensureDir(path.join(STATIC_DIR, 'projects'))
  
  // Generate homepage
  console.log('📄 Generating homepage...')
  const featuredPosts = demoPosts.filter(p => p.featured)
  const featuredProjects = demoProjects.filter(p => p.featured)
  const homeContent = homeTemplate(featuredPosts, featuredProjects)
  await fs.writeFile(
    path.join(STATIC_DIR, 'index.html'),
    htmlTemplate('Angel Ortega-Melton - Portfolio', homeContent, {
      description: 'Portfolio of Angel Ortega-Melton - Entrepreneur, Developer, Creator',
      type: 'website'
    })
  )
  
  // Generate posts listing
  console.log('📝 Generating posts listing...')
  const postsListContent = listTemplate('All Posts', demoPosts, 'posts')
  await fs.writeFile(
    path.join(STATIC_DIR, 'posts.html'),
    htmlTemplate('Posts - Angel Ortega-Melton', postsListContent, {
      description: 'Blog posts and articles by Angel Ortega-Melton',
      type: 'website'
    })
  )
  
  // Generate projects listing
  console.log('🔧 Generating projects listing...')
  const projectsListContent = listTemplate('All Projects', demoProjects, 'projects')
  await fs.writeFile(
    path.join(STATIC_DIR, 'projects.html'),
    htmlTemplate('Projects - Angel Ortega-Melton', projectsListContent, {
      description: 'Projects and work by Angel Ortega-Melton',
      type: 'website'
    })
  )
  
  // Generate individual post pages
  console.log('📑 Generating individual post pages...')
  for (const post of demoPosts) {
    const { content: html } = await parseMarkdown(post.content)
    const postContent = pageContent(post.title, html, { href: '/posts', text: '← Back to Posts' })
    await fs.writeFile(
      path.join(STATIC_DIR, 'posts', `${post.slug}.html`),
      htmlTemplate(post.title, postContent, {
        description: post.description,
        type: 'article'
      })
    )
    console.log(`  ✅ Generated: ${post.title}`)
  }
  
  // Generate individual project pages
  console.log('🛠️  Generating individual project pages...')
  for (const project of demoProjects) {
    const { content: html } = await parseMarkdown(project.content)
    const projectContent = pageContent(project.title, html, { href: '/projects', text: '← Back to Projects' })
    await fs.writeFile(
      path.join(STATIC_DIR, 'projects', `${project.slug}.html`),
      htmlTemplate(project.title, projectContent, {
        description: project.description,
        type: 'article'
      })
    )
    console.log(`  ✅ Generated: ${project.title}`)
  }
  
  console.log('\n✨ Static generation complete!')
  console.log(`📦 Generated ${1 + 2 + demoPosts.length + demoProjects.length} static pages`)
}

// Run if called directly
if (import.meta.main) {
  generateStaticPages().catch(console.error)
}

export { generateStaticPages }