#!/bin/bash

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Print success message
echo "Build completed successfully!"
