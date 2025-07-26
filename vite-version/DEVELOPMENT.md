# Development Notes

## Buffer Polyfill Issue

The `gray-matter` library requires Node.js Buffer which isn't available in the browser. 

**Solution Applied:**
1. Added `buffer` package as dependency
2. Added Buffer polyfill in `src/main.tsx`: `globalThis.Buffer = Buffer`
3. Added global definition in `vite.config.ts`: `global: 'globalThis'`

## Walrus Content System

The site is configured to use Walrus for decentralized content storage. Currently returns placeholder content for development.

**To implement Walrus:**
1. Update `CONTENT_REGISTRY` in `src/lib/content.ts` with real blob IDs
2. Implement actual Walrus API calls in `fetchMarkdownFromWalrus()`
3. Upload your markdown files to Walrus network

## Development Commands

```bash
# Start dev server
bun run dev

# Build for production  
bun run build

# Preview build
bun run preview

# Type check
bun run lint
```

## Known Issues

- React DevTools warning (dev only, safe to ignore)
- Bundle size warning (can be optimized with code splitting if needed)

## Next Steps

1. Implement actual Walrus API integration
2. Upload content to Walrus and update blob IDs
3. Optimize bundle size if needed
4. Deploy to production