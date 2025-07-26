#!/usr/bin/env bun

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

interface FileGroup {
  pattern: string
  files: string[]
  totalSize: number
}

const MAX_BATCH_SIZE = 5 * 1024 * 1024 // 5MB per batch for Walrus Quilt

async function getFileSize(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath)
  return stats.size
}

async function groupSmallFiles(distDir: string): Promise<FileGroup[]> {
  const groups: FileGroup[] = []
  
  // Group HTML files
  const htmlFiles = await findFiles(distDir, '.html')
  const htmlGroup: FileGroup = {
    pattern: '*.html',
    files: [],
    totalSize: 0
  }
  
  for (const file of htmlFiles) {
    const size = await getFileSize(file)
    if (size < 100 * 1024) { // Only batch files smaller than 100KB
      htmlGroup.files.push(file)
      htmlGroup.totalSize += size
    }
  }
  
  if (htmlGroup.files.length > 0) {
    groups.push(htmlGroup)
  }
  
  // Group small JS chunks
  const jsFiles = await findFiles(path.join(distDir, 'assets'), '.js')
  const jsGroup: FileGroup = {
    pattern: 'assets/*.js',
    files: [],
    totalSize: 0
  }
  
  for (const file of jsFiles) {
    const size = await getFileSize(file)
    if (size < 50 * 1024) { // Small JS chunks
      jsGroup.files.push(file)
      jsGroup.totalSize += size
    }
  }
  
  if (jsGroup.files.length > 0) {
    groups.push(jsGroup)
  }
  
  return groups
}

async function findFiles(dir: string, extension: string): Promise<string[]> {
  const files: string[] = []
  
  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.name.endsWith(extension)) {
        files.push(fullPath)
      }
    }
  }
  
  await walk(dir)
  return files
}

async function createBatchManifest(groups: FileGroup[], distDir: string) {
  const manifest = {
    version: '1.0',
    batches: groups.map(group => ({
      id: crypto.randomBytes(16).toString('hex'),
      pattern: group.pattern,
      files: group.files.map(f => path.relative(distDir, f)),
      totalSize: group.totalSize,
      estimatedSavings: calculateSavings(group)
    })),
    metadata: {
      generatedAt: new Date().toISOString(),
      totalFiles: groups.reduce((sum, g) => sum + g.files.length, 0),
      totalSize: groups.reduce((sum, g) => sum + g.totalSize, 0)
    }
  }
  
  await fs.writeFile(
    path.join(distDir, 'walrus-batch-manifest.json'),
    JSON.stringify(manifest, null, 2)
  )
  
  return manifest
}

function calculateSavings(group: FileGroup): number {
  // Walrus has ~64MB metadata overhead per blob
  const metadataOverhead = 64 * 1024 * 1024
  const individualCost = group.files.length * metadataOverhead
  const batchedCost = metadataOverhead
  const savings = ((individualCost - batchedCost) / individualCost) * 100
  return Math.round(savings)
}

async function optimizeForWalrus() {
  console.log('🔍 Analyzing files for Walrus optimization...')
  
  const distDir = path.join(process.cwd(), 'dist')
  
  try {
    await fs.access(distDir)
  } catch {
    console.error('❌ dist directory not found. Run build first.')
    process.exit(1)
  }
  
  const groups = await groupSmallFiles(distDir)
  
  if (groups.length === 0) {
    console.log('✅ No optimization needed - files are already efficiently sized')
    return
  }
  
  console.log(`\n📊 Found ${groups.length} groups of small files that can be batched:`)
  
  for (const group of groups) {
    console.log(`\n  ${group.pattern}:`)
    console.log(`    Files: ${group.files.length}`)
    console.log(`    Total size: ${(group.totalSize / 1024).toFixed(2)} KB`)
    console.log(`    Estimated savings: ${calculateSavings(group)}%`)
  }
  
  const manifest = await createBatchManifest(groups, distDir)
  
  console.log('\n📋 Batch manifest created: dist/walrus-batch-manifest.json')
  console.log(`\n💰 Total potential savings:`)
  console.log(`   Files that can be batched: ${manifest.metadata.totalFiles}`)
  console.log(`   Total size: ${(manifest.metadata.totalSize / 1024).toFixed(2)} KB`)
  console.log('\n✨ Use Walrus Quilt to batch these files when storing')
}

// Run if called directly
if (import.meta.main) {
  optimizeForWalrus().catch(console.error)
}

export { optimizeForWalrus }