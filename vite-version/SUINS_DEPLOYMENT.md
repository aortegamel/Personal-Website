# SuiNS Deployment Guide for Walrus Sites

## Prerequisites

1. **Mainnet wallet** with SUI and WAL tokens
2. **SuiNS name** purchased on https://suins.io
3. **Walrus CLI** configured for mainnet
4. **site-builder** tool installed

## Step 1: Build for Production

```bash
# Clean build
rm -rf dist
bun run build:walrus
```

## Step 2: Deploy to Mainnet

```bash
# Deploy using mainnet configuration
site-builder deploy ./dist \
  --config sites-config.mainnet.yaml \
  --epochs 100
```

This will output something like:
```
Created new site: your site
New site object ID: 0x1234567890abcdef...
```

**Save this object ID!**

## Step 3: Link SuiNS Name

1. Go to https://suins.io
2. Navigate to your SuiNS name management
3. Add a new record:
   - Type: `Walrus Site`
   - Target: `0x1234567890abcdef...` (your site object ID)
   
## Step 4: Access Your Site

After SuiNS propagation (usually instant), access your site at:
- `https://yourname.wal.app`

## Common Issues & Solutions

### Issue: Site not loading on SuiNS

**Check 1: Network**
```bash
# Verify you deployed to mainnet
cat ws-resources.json | grep network
```

**Check 2: Object ID**
- Ensure you're using the site object ID, not the transaction ID
- The site object ID starts with `0x`

**Check 3: Asset Paths**
- All assets should use absolute paths starting with `/`
- Check browser console for 404 errors

### Issue: Blank page or routing errors

**Solution:** Ensure your build uses correct base path:
```javascript
// vite.config.ts
base: '/'  // Must be '/' for Walrus Sites
```

### Issue: CORS or loading errors

**Solution:** Check ws-layout.yaml headers:
```yaml
headers:
  Access-Control-Allow-Origin: "*"
  X-Content-Type-Options: "nosniff"
```

## Updating Your Site

```bash
# 1. Make changes
# 2. Rebuild
bun run build:walrus

# 3. Update (not deploy)
site-builder update ./dist \
  --config sites-config.mainnet.yaml \
  --epochs 100
```

## Monitoring

Check your site's status:
```bash
# View site details
site-builder site <your-object-id> --config sites-config.mainnet.yaml
```

## Cost Optimization

1. Use `--epochs` wisely:
   - Mainnet: 1 epoch = 2 weeks
   - 100 epochs = ~4 years
   
2. Use Walrus Quilt for small files:
   - Check `walrus-batch-manifest.json`
   - Batch HTML files together

## Final Checklist

- [ ] Deployed to mainnet (not testnet)
- [ ] Used site object ID (not transaction ID)
- [ ] SuiNS record points to correct object ID
- [ ] All asset paths are absolute (`/assets/...`)
- [ ] Site loads at `https://yourname.wal.app`
- [ ] Console has no 404 or CORS errors