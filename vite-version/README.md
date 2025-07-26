# Angleito Portfolio - Vite + Bun + Walrus

A modern, fast portfolio website built with Vite, React, and Bun, designed to use Walrus for decentralized markdown content storage.

## 🚀 Tech Stack

- **Build Tool**: Vite 7.x for fast development and optimized builds
- **Runtime**: Bun for package management and development  
- **Frontend**: React 19 with TypeScript
- **Routing**: React Router DOM 7.x
- **Styling**: Tailwind CSS 4.x with custom design system
- **Markdown**: Unified ecosystem (remark + rehype) for processing
- **Storage**: Walrus network for decentralized content storage
- **Typography**: @tailwindcss/typography for markdown rendering

## 🛠️ Development

### Prerequisites
- [Bun](https://bun.sh/) installed locally

### Getting Started
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build  
bun run preview
```

## 🌊 Walrus Integration

The site uses [Walrus](https://walrus.site/) for decentralized content storage:

- Upload markdown files directly to Walrus network
- Update `CONTENT_REGISTRY` in `src/lib/content.ts` with blob IDs
- Content is fetched dynamically without rebuilding the site

### Benefits
- **Cost Effective**: Minimal hosting costs (only static site)
- **Decentralized**: Content stored on Walrus network
- **Scalable**: Add content without site rebuilds
- **Fast**: Optimized build with minimal bundle size

## 📝 Content Format

### Blog Posts
```yaml
---
title: "Post Title"
description: "Brief description"
date: "2025-01-15"
category: "technology"
tags: ["react", "typescript", "web3"]
featured: true
---
```

### Projects
```yaml
---
title: "Project Title"
description: "Project description"
date: "2025-01-15"
tags: ["react", "typescript", "blockchain"]
github: "https://github.com/username/repo"
demo: "https://demo-url.com"
featured: true
---
```

## 🚀 Deployment

The built site is fully static and can be deployed to any static hosting service. Build output goes to `dist/` directory.

## 🔧 Next Steps

1. Implement actual Walrus API integration in `src/lib/markdown.ts`
2. Upload your markdown content to Walrus
3. Update content registry with real blob IDs
4. Deploy static site to your preferred hosting platform