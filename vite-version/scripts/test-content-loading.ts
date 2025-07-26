#!/usr/bin/env bun

// Test script to verify content loading works correctly
import { loadManifest, loadPrebuiltContent } from '../src/lib/prebuilt-content'

async function testContentLoading() {
  console.log('🧪 Testing content loading...\n')
  
  try {
    // Test manifest loading
    console.log('1. Testing manifest loading...')
    const manifest = await loadManifest()
    console.log('✅ Manifest loaded successfully')
    console.log(`   Posts: ${Object.keys(manifest.posts).join(', ')}`)
    console.log(`   Projects: ${Object.keys(manifest.projects).join(', ')}\n`)
    
    // Test loading a post
    console.log('2. Testing post loading...')
    const post = await loadPrebuiltContent('posts', '')
    if (post) {
      console.log('✅ Post loaded successfully')
      console.log(`   Title: ${post.frontMatter.title}`)
      console.log(`   Content length: ${post.content.length} characters\n`)
    } else {
      console.error('❌ Failed to load post\n')
    }
    
    // Test loading a project
    console.log('3. Testing project loading...')
    const project = await loadPrebuiltContent('projects', 'nyxusd')
    if (project) {
      console.log('✅ Project loaded successfully')
      console.log(`   Title: ${project.frontMatter.title}`)
      console.log(`   Content length: ${project.content.length} characters\n`)
    } else {
      console.error('❌ Failed to load project\n')
    }
    
    console.log('✨ Content loading tests complete!')
    
  } catch (error) {
    console.error('❌ Error during testing:', error)
  }
}

// Mock import.meta.env for testing
(globalThis as any).import = {
  meta: {
    env: {
      DEV: false,
      BASE_URL: '/'
    }
  }
}

testContentLoading()