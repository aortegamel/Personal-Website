// This file helps Vercel identify the project structure
// It redirects to the actual Next.js application in the nextjs-portfolio directory

const { createServer } = require('http');

const server = createServer((req, res) => {
  // Set redirect headers
  res.writeHead(302, {
    'Location': '/nextjs-portfolio' + req.url
  });
  res.end();
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Redirecting to Next.js app in nextjs-portfolio directory on port ${port}`);
});
