# Local Testing Checklist

## Quick Start

```bash
# Build and test everything at once
bun run test:build
```

Or step by step:

```bash
# 1. Build the hybrid site
bun run build:walrus

# 2. Serve it locally
bun run preview:hybrid
```

## Testing Checklist

### 1. Static Pre-rendered Pages
Visit these URLs and verify they load instantly with content visible:

- [ ] http://localhost:3000/posts - Posts listing page
- [ ] http://localhost:3000/projects - Projects listing page
- [ ] http://localhost:3000/posts/ - Individual post
- [ ] http://localhost:3000/projects/nyxusd - Individual project

**What to check:**
- Content appears immediately (no loading spinner)
- View page source - full HTML content should be present
- Disable JavaScript in browser - pages should still work

### 2. React SPA Features
- [ ] http://localhost:3000/ - Homepage (React-powered)
- [ ] http://localhost:3000/about - About page (client-side route)
- [ ] Click navigation links - should work without page refresh
- [ ] Back/forward browser buttons work correctly

### 3. Content Loading
- [ ] Check Network tab - content fragments load from `/content/`
- [ ] Verify manifest.json loads correctly
- [ ] Check that CSS and JS files are cached properly

### 4. SEO & Metadata
View source on pre-rendered pages to verify:
- [ ] Proper `<title>` tags
- [ ] Meta description tags
- [ ] Open Graph tags for social sharing

### 5. Performance Testing
Open DevTools Network tab:
- [ ] First paint time for static pages < 500ms
- [ ] JS bundle loads async and doesn't block content
- [ ] CSS is loaded in the `<head>`

### 6. Edge Cases
- [ ] 404 page works for non-existent routes
- [ ] Trailing slashes redirect properly
- [ ] Direct navigation to deep links works

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

## Console Errors

Check browser console for:
- [ ] No JavaScript errors
- [ ] No 404s for resources
- [ ] No mixed content warnings

## Build Verification

Check the `dist` folder contains:
```
dist/
├── index.html (React SPA)
├── posts.html (Static)
├── projects.html (Static)
├── posts/*.html (Static pages)
├── projects/*.html (Static pages)
├── content/*.html (Fragments)
├── assets/*.js/css (Bundles)
└── walrus-manifest.json
```

## Final Checks Before Walrus Deployment

1. [ ] All tests pass
2. [ ] No console errors
3. [ ] All routes work correctly
4. [ ] Static pages load without JavaScript
5. [ ] Check `walrus-batch-manifest.json` for optimization opportunities

If all checks pass, you're ready to deploy to Walrus!