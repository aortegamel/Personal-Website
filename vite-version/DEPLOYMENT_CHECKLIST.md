# Deployment Checklist

## Pre-deployment Steps (Both Platforms)

### 1. Code Quality Checks
- [ ] Run TypeScript type checking: `bun run lint`
- [ ] Ensure all tests pass (if applicable)
- [ ] Check for console.log statements in production code
- [ ] Verify all environment variables are properly configured

### 2. Content Preparation
- [ ] Ensure all blog posts are in `/public/content/posts/`
- [ ] Verify `manifest.json` is up to date
- [ ] Check that all images are optimized and properly referenced

### 3. Git Status
- [ ] All changes committed to git
- [ ] Working directory is clean
- [ ] On the correct branch (dev for development, main for production)

---

## Walrus Deployment

### 1. Build Commands
```bash
# Full build with optimization
bun run build:walrus

# This runs:
# 1. bun run build:hybrid (creates hybrid build)
# 2. bun run optimize:walrus (analyzes and optimizes for Walrus)
```

Alternative build commands:
```bash
# Standard build without Walrus optimization
bun run build

# Static-only build (for testing)
bun run build:static
```

### 2. Verify Build Output
Check the following files/folders exist in `dist/`:
- [ ] `index.html` - Main entry point
- [ ] `assets/` directory with:
  - [ ] `[name]-[hash].js` files (main bundle and chunks)
  - [ ] `[name]-[hash].css` files (styles)
  - [ ] Font files (if any)
- [ ] `content/` directory with:
  - [ ] `posts/` containing all blog post HTML files
  - [ ] `manifest.json` with post metadata
- [ ] `walrus-batch-manifest.json` (if optimization was run)
- [ ] All public assets (favicon, robots.txt, etc.)

### 3. Environment Configuration
- [ ] Base URL is set to `/` in `vite.config.ts`
- [ ] No absolute URLs in the application
- [ ] All asset references use relative paths

### 4. Walrus-Specific Optimizations
- [ ] Review `walrus-batch-manifest.json` for batching recommendations
- [ ] Small files (<100KB) are identified for batching
- [ ] Consider using Walrus Quilt for efficient storage

### 5. Testing Steps
```bash
# Test the hybrid build locally
bun run preview:hybrid

# Or use standard preview
bun run preview
```

Testing checklist:
- [ ] Home page loads correctly
- [ ] Blog listing shows all posts
- [ ] Individual blog posts render properly
- [ ] Navigation works (including back/forward)
- [ ] Static assets load (images, fonts, styles)
- [ ] No console errors in browser
- [ ] Content loads dynamically when needed

### 6. Deployment to Walrus
```bash
# After successful build, upload the dist directory to Walrus
# Using Walrus CLI or web interface

# Consider batching small files based on walrus-batch-manifest.json
```

### 7. Post-deployment Verification
- [ ] Access the site via Walrus gateway
- [ ] Verify all pages load correctly
- [ ] Check that content is properly cached
- [ ] Test on different browsers/devices
- [ ] Monitor for any CORS or content-type issues

---

## Vercel Deployment

### 1. Build Commands
```bash
# Standard build (as configured in vercel.json)
npm run build
# or
bun run build
```

This runs:
1. `bun run prebuild` - Preprocesses content
2. `vite build` - Builds the application

### 2. Verify Build Output
Check the following in `dist/`:
- [ ] Same structure as Walrus deployment
- [ ] `index.html` with proper asset references
- [ ] All assets have hashed filenames for caching
- [ ] Source maps are generated (`.map` files)

### 3. Environment Configuration
Vercel-specific settings in `vercel.json`:
- [ ] `buildCommand` is set to `npm run build`
- [ ] `outputDirectory` is set to `dist`
- [ ] Rewrites configured for SPA routing
- [ ] Headers configured for:
  - [ ] Content caching (`/content/*`)
  - [ ] Proper MIME types (`.json`, `.html`)

### 4. Testing Steps
```bash
# Test locally with Vercel CLI (if installed)
vercel dev

# Or use Vite preview
bun run preview
```

Testing checklist:
- [ ] All routes work with client-side navigation
- [ ] Refresh on any route returns the app (SPA behavior)
- [ ] Static content is properly cached
- [ ] JSON files load with correct content-type
- [ ] No hydration errors in React

### 5. Deployment to Vercel
```bash
# Using Vercel CLI
vercel

# For production
vercel --prod

# Or use Git integration (automatic on push to main)
```

### 6. Post-deployment Verification
- [ ] Check deployment URL provided by Vercel
- [ ] Verify custom domain (if configured)
- [ ] Test all functionality as with local testing
- [ ] Check Vercel Analytics/Web Vitals
- [ ] Monitor for any serverless function errors (if any)

---

## Special Considerations

### Walrus-Specific
1. **Content Addressing**: Files are content-addressed, so updates require new deployment
2. **Caching**: Walrus provides built-in caching, but consider browser caching strategies
3. **CORS**: Ensure proper CORS headers if accessing from different domains
4. **File Size**: Large files may need special handling or chunking
5. **Batching**: Use Walrus Quilt for small files to reduce storage overhead

### Vercel-Specific
1. **Build Minutes**: Monitor usage if on free tier
2. **Serverless Functions**: Not used in this static build, but available if needed
3. **Environment Variables**: Set via Vercel dashboard if needed
4. **Preview Deployments**: Automatic for PRs, useful for testing
5. **Edge Network**: Automatic CDN distribution

### Common Issues and Solutions

#### Build Failures
- **Missing dependencies**: Run `bun install` before building
- **TypeScript errors**: Fix with `bun run lint`
- **Content not found**: Ensure `prebuild-content.ts` runs successfully

#### Runtime Issues
- **404 on routes**: Check rewrite rules (Vercel) or ensure SPA routing
- **Slow loading**: Check bundle size, consider code splitting
- **Missing content**: Verify manifest.json is generated and accessible

#### Performance Optimization
- [ ] Enable gzip/brotli compression
- [ ] Optimize images (WebP format, proper sizing)
- [ ] Minimize JavaScript bundle size
- [ ] Use proper cache headers
- [ ] Consider lazy loading for blog content

---

## Quick Reference

### Walrus Deployment
```bash
bun run build:walrus
bun run preview:hybrid  # Test locally
# Upload dist/ to Walrus
```

### Vercel Deployment
```bash
bun run build
vercel --prod  # or git push to main
```

### Rollback Procedures
- **Walrus**: Deploy previous build (keep old builds archived)
- **Vercel**: Use Vercel dashboard to instant rollback to previous deployment

---

## Monitoring and Maintenance

### Regular Checks
- [ ] Monitor site availability
- [ ] Check for broken links
- [ ] Review analytics for performance issues
- [ ] Update dependencies monthly
- [ ] Backup content regularly

### Performance Metrics to Track
- [ ] Page load time
- [ ] Time to Interactive (TTI)
- [ ] First Contentful Paint (FCP)
- [ ] Bundle size over time
- [ ] Cache hit rates