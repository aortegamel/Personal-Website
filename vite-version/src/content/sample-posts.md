# Sample Posts for Walrus Storage

This directory will contain sample markdown files that demonstrate the structure for Walrus storage.

## Post Format

Each post should have frontmatter like this:

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

## Project Format  

Each project should have frontmatter like this:

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

## Walrus Integration

When ready for production:
1. Upload markdown files to Walrus
2. Update `CONTENT_REGISTRY` in `/src/lib/content.ts` with blob IDs
3. Implement `fetchMarkdownFromWalrus()` function with actual Walrus API calls
4. Content will be fetched dynamically from decentralized storage

This approach allows you to:
- Store content on decentralized Walrus network
- Keep website build small and fast
- Update content without rebuilding site
- Reduce hosting costs significantly