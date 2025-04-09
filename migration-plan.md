# Jekyll to Next.js 14 Migration Plan

## Overview
This document outlines the migration strategy for converting a Jekyll-based portfolio site to Next.js 14 with React, ContentLayer for Markdown files, TailwindCSS, TypeScript, and GitHub Actions for CI/CD.

## Migration Steps

### 1. Project Structure Preparation
- Identified multiple Next.js implementations in `nextjs-portfolio/` and `src/` directories
- Chose `src/` directory as the base implementation due to more complete setup

### 2. Content Migration
#### Posts Migration
- Created `migrate-content.js` script to convert Jekyll posts to ContentLayer-compatible Markdown
- Key transformations:
  - Converted `categories` from space-separated strings to arrays
  - Preserved front matter fields
  - Moved posts to `content/posts/` directory

#### Projects Migration
- Created `convert-projects.js` script to convert YAML project files to Markdown
- Key transformations:
  - Preserved all project metadata
  - Ensured `features` field is an array
  - Moved projects to `content/projects/` directory

### 3. ContentLayer Configuration
- Updated `contentlayer.config.ts` to define document types
- Added support for:
  - Posts with categories
  - Projects with tech stack and features
- Configured computed fields for slugs and URLs

### 4. TypeScript Configuration
- Updated `tsconfig.json` to:
  - Add `baseUrl` and path aliases
  - Include `.contentlayer/generated` in include paths
  - Resolve ContentLayer type generation issues

### 5. Component Updates
- Refactored `src/app/projects/page.tsx` to use ContentLayer-generated data
- Implemented dynamic project listing with:
  - Tech stack badges
  - GitHub link
  - Responsive grid layout

## Remaining Tasks
- [ ] Implement similar migration for blog posts page
- [ ] Set up GitHub Actions for CI/CD
- [ ] Add search functionality using ContentLayer-generated content
- [ ] Implement individual project and post detail pages

## Lessons Learned
- Careful handling of front matter and metadata is crucial
- ContentLayer requires precise type definitions
- Migration scripts help automate repetitive conversion tasks

## Recommended Next Steps
1. Thoroughly test all migrated content
2. Implement comprehensive error handling
3. Add more metadata fields as needed
4. Optimize performance and build times

## Technologies Used
- Next.js 14
- React 19
- ContentLayer
- TypeScript
- TailwindCSS
- GitHub Actions (planned)

## Migration Complexity
- Moderate complexity due to content type transformations
- Significant improvement in content management and type safety