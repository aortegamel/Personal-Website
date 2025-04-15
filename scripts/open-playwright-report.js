// scripts/open-playwright-report.js
// Usage: node scripts/open-playwright-report.js [report-url-or-path]
// Opens the Playwright HTML report in a Chromium browser using Puppeteer.

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function openReport(reportTarget) {
  let url = reportTarget;

  // If the argument looks like a file path, convert to file:// URL
  if (!/^https?:\/\//i.test(reportTarget)) {
    // Resolve relative to current working directory
    const absPath = path.resolve(reportTarget);
    if (!fs.existsSync(absPath)) {
      throw new Error(`File not found: ${absPath}`);
    }
    url = 'file://' + absPath;
  }

  const browser = await puppeteer.launch({
    headless: false, // Show the browser window
    // You can add userDataDir or other options here if needed
  });

  const page = await browser.newPage();
  await page.goto(url);

  console.log(`✅ Playwright report opened at: ${url}`);
  // Do not close the browser so the user can view the report
}

async function main() {
  const reportArg = process.argv[2] || 'http://localhost:52833';

  try {
    await openReport(reportArg);
  } catch (err) {
    console.error('❌ Failed to open Playwright report:', err.message);
    process.exit(1);
  }
}

main();