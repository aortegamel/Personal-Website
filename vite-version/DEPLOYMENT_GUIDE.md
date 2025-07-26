# Deployment Guide

This guide explains how the content loading system works across different deployment platforms.

## Content Loading System

The app uses a prebuilt content system that:
1. Generates static HTML files from markdown during build time
2. Creates a manifest.json file listing all available content
3. Loads content dynamically based on the deployment environment

## Supported Platforms

### 1. Walrus Sites (angleito.wal.app)
- Content is served from the root path
- URLs are automatically adjusted for Walrus's serving pattern
- Example: `https://angleito.wal.app/content/manifest.json`

### 2. Vercel
- Standard static file serving
- Content is served from the `/content` directory
- Example: `https://your-app.vercel.app/content/manifest.json`

### 3. Local Development
- In development mode: Uses demo content from `src/lib/demo-content.ts`
- In production preview: Uses prebuilt content from `/content` directory

## Build Process

1. **Prebuild Step** (`npm run prebuild`)
   - Converts markdown content to HTML
   - Generates manifest.json with metadata
   - Outputs to `public/content/` directory

2. **Build Step** (`npm run build`)
   - Runs prebuild automatically
   - Copies content to `dist/content/`
   - Bundles the application

## Deployment Steps

### For Walrus:
```bash
npm run build
npm run optimize:walrus
# Deploy dist directory to Walrus
```

### For Vercel:
```bash
# Push to GitHub
# Vercel will automatically build and deploy
```

### For Other Platforms:
```bash
npm run build
# Deploy dist directory to your platform
```

## Debugging Content Loading

The content loading system includes detailed logging:

1. Check browser console for:
   - "Loading manifest from: [URL]"
   - "Manifest loaded successfully"
   - "Loading content from: [URL]"

2. Common issues:
   - **404 errors**: Check if content files exist in dist/content/
   - **CORS errors**: Ensure your server allows JSON/HTML content types
   - **Path issues**: The system tries multiple path variations automatically

## Testing Production Build

```bash
# Build the project
npm run build

# Test locally
npm run preview

# Verify content files
ls -la dist/content/
```

## Environment Variables

- `import.meta.env.BASE_URL`: Base URL for the application (default: "/")
- `import.meta.env.DEV`: Development mode flag

## Content Structure

```
public/content/
├── manifest.json
├── posts/
│   ├── post-slug.html
│   └── ...
└── projects/
    ├── project-slug.html
    └── ...
```

## Troubleshooting

1. **Content not loading in production**
   - Check if manifest.json is accessible at /content/manifest.json
   - Verify HTML files are in the correct directories
   - Check browser console for specific error messages

2. **Walrus-specific issues**
   - Ensure all paths use forward slashes
   - Check that content files are included in the Walrus bundle
   - Verify the site is using the correct base URL

3. **Vercel-specific issues**
   - Check vercel.json configuration
   - Ensure rewrites don't interfere with /content paths
   - Verify build output includes content directory