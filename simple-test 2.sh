#!/bin/bash

# Check if Header.tsx exists
if [ -f "src/components/Header.tsx" ]; then
  echo "Header.tsx exists"
else
  echo "Header.tsx does not exist"
fi

# Check if Footer.tsx exists
if [ -f "src/components/Footer.tsx" ]; then
  echo "Footer.tsx exists"
else
  echo "Footer.tsx does not exist"
fi

# Check if tailwind.config.js exists
if [ -f "tailwind.config.js" ]; then
  echo "tailwind.config.js exists"
else
  echo "tailwind.config.js does not exist"
fi
