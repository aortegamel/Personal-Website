import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if browsers are already installed
const browserPath = path.join(__dirname, '../node_modules/playwright/.local-browsers');
const browsersInstalled = fs.existsSync(browserPath);

if (browsersInstalled) {
  console.log('✅ Playwright browsers are already installed.');
} else {
  console.log('🔄 Installing Playwright browsers...');
  try {
    execSync('npx playwright install chromium', { stdio: 'inherit' });
    console.log('✅ Playwright browsers installed successfully.');
  } catch (error) {
    console.error('❌ Failed to install Playwright browsers:', error.message);
    process.exit(1);
  }
}
