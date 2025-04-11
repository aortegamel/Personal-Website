import { chromium } from '@playwright/test';
import { spawn } from 'child_process';

async function startDevServer() {
  return new Promise<void>((resolve, reject) => {
    const devServer = spawn('npm', ['run', 'dev'], { 
      stdio: 'pipe',
      shell: true 
    });

    devServer.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log('Dev Server Output:', output);
      
      // Check if server is ready
      if (output.includes('ready')) {
        resolve();
      }
    });

    devServer.stderr?.on('data', (data) => {
      console.error('Dev Server Error:', data.toString());
    });

    devServer.on('error', (error) => {
      console.error('Failed to start dev server:', error);
      reject(error);
    });
  });
}

async function connectBrowserToMCP() {
  try {
    // Start dev server
    await startDevServer();

    // Wait a bit to ensure server is fully up
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Launch Chromium browser
    const browser = await chromium.launch({ 
      headless: false, // Open browser visibly for debugging
      devtools: true   // Open DevTools to ensure logging
    });

    // Create a new page
    const page = await browser.newPage();

    // Navigate to local dev server
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Capture console logs
    page.on('console', (msg) => {
      console.log('Browser Console Log:', msg.text());
    });

    // Capture network requests
    await page.route('**/*', (route) => {
      const request = route.request();
      console.log('Network Request:', {
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
      route.continue();
    });

    // Run basic accessibility audit
    const accessibilityReport = await page.evaluate(() => {
      const auditResults = {
        violations: [],
        passes: []
      };

      const elements = document.querySelectorAll('*');
      elements.forEach((el) => {
        // Check for alt text on images
        if (el.tagName === 'IMG' && !el.getAttribute('alt')) {
          auditResults.violations.push({
            impact: 'critical',
            description: 'Image missing alt text',
            element: el.outerHTML
          });
        }
      });

      return auditResults;
    });

    console.log('Accessibility Audit Results:', accessibilityReport);

    // Keep the script running
    await new Promise(() => {});

  } catch (error) {
    console.error('Error connecting browser to MCP:', error);
    process.exit(1);
  }
}

connectBrowserToMCP().catch(console.error);