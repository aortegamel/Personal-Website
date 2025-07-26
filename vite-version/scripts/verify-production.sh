#!/bin/bash

# Script to verify production build serves content correctly

echo "🔍 Verifying production build content..."
echo ""

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found. Run 'npm run build' first."
    exit 1
fi

# Check manifest.json
echo "1. Checking manifest.json..."
if [ -f "dist/content/manifest.json" ]; then
    echo "✅ manifest.json exists"
    echo "   Posts: $(jq -r '.posts | keys | join(", ")' dist/content/manifest.json 2>/dev/null || echo 'Unable to parse')"
    echo "   Projects: $(jq -r '.projects | keys | join(", ")' dist/content/manifest.json 2>/dev/null || echo 'Unable to parse')"
else
    echo "❌ manifest.json not found at dist/content/manifest.json"
fi
echo ""

# Check HTML files
echo "2. Checking HTML content files..."
for file in dist/content/posts/*.html dist/content/projects/*.html; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        echo "✅ $(basename "$file") - $size bytes"
    fi
done
echo ""

# Test with local server
echo "3. Testing with local server..."
echo "   Starting preview server on http://localhost:4173"
echo "   Press Ctrl+C to stop the server after testing"
echo ""

# Start preview server
npm run preview