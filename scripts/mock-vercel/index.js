#!/usr/bin/env node

/**
 * Mock Vercel CLI
 * 
 * This script provides a command-line interface for the mock Vercel tools.
 */

const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// Helper function to log with color
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

// Helper function to execute a script
function executeScript(scriptName, args = []) {
  const scriptPath = path.join(__dirname, `${scriptName}.js`);
  const command = `node ${scriptPath} ${args.join(' ')}`;
  
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}

// Show help message
function showHelp() {
  log('Mock Vercel CLI', colors.green + colors.bright);
  log('A tool to simulate Vercel deployment locally', colors.dim);
  log('\nCommands:', colors.bright);
  log('  check       Check your project for Vercel compatibility issues', colors.cyan);
  log('  build       Build your project as Vercel would', colors.cyan);
  log('  deploy      Simulate a full Vercel deployment locally', colors.cyan);
  log('  help        Show this help message', colors.cyan);
  
  log('\nExamples:', colors.bright);
  log('  node scripts/mock-vercel check', colors.yellow);
  log('  node scripts/mock-vercel build', colors.yellow);
  log('  node scripts/mock-vercel deploy', colors.yellow);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'check':
    case 'check-deployment':
    case 'check-config':
      executeScript('check-deployment');
      break;
      
    case 'build':
      executeScript('build');
      break;
      
    case 'deploy':
      executeScript('deploy');
      break;
      
    case 'help':
    case '--help':
    case '-h':
    default:
      showHelp();
      break;
  }
}

// Run the main function
main();
