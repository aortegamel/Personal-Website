#!/bin/bash

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Navigate to the Next.js project directory
cd nextjs-portfolio

# Print directory contents for debugging
echo "Listing files in nextjs-portfolio directory:"
ls -la

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js application
echo "Building Next.js application..."
npm run build

# Return to the root directory
cd ..

# Print success message
echo "Build completed successfully!"
