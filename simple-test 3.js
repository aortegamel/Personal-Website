const fs = require('fs');

// Check if Header.tsx exists
if (fs.existsSync('src/components/Header.tsx')) {
  console.log('Header.tsx exists');
} else {
  console.log('Header.tsx does not exist');
}

// Check if Footer.tsx exists
if (fs.existsSync('src/components/Footer.tsx')) {
  console.log('Footer.tsx exists');
} else {
  console.log('Footer.tsx does not exist');
}

// Check if tailwind.config.js exists
if (fs.existsSync('tailwind.config.js')) {
  console.log('tailwind.config.js exists');
} else {
  console.log('tailwind.config.js does not exist');
}
