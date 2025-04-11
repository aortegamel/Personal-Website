#!/usr/bin/env node

/**
 * Mock Vercel Builder
 * 
 * This script simulates the Vercel build process locally to help identify
 * deployment issues before pushing to Git.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Helper function to log with timestamp and color
function log(message, color = colors.white) {
  const timestamp = new Date().toISOString();
  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
}

// Helper function to log errors
function logError(message) {
  log(`❌ ${message}`, colors.red);
}

// Helper function to log success
function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

// Helper function to log info
function logInfo(message) {
  log(`ℹ️ ${message}`, colors.cyan);
}

// Helper function to log warnings
function logWarning(message) {
  log(`⚠️ ${message}`, colors.yellow);
}

// Helper function to execute shell commands
function execute(command, options = {}) {
  const defaultOptions = {
    stdio: 'inherit',
    encoding: 'utf8'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    log(`Executing: ${command}`, colors.magenta);
    return execSync(command, mergedOptions);
  } catch (error) {
    logError(`Command failed: ${command}`);
    logError(error.message);
    throw error;
  }
}

// Create a temporary directory to simulate Vercel environment
function createTempDir() {
  const tempDir = path.join(os.tmpdir(), `mock-vercel-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

// Copy project files to temp directory
function copyProjectFiles(sourceDir, targetDir) {
  log(`Copying project files to ${targetDir}...`);
  
  // Read .vercelignore if it exists
  let ignorePatterns = [];
  const vercelIgnorePath = path.join(sourceDir, '.vercelignore');
  if (fs.existsSync(vercelIgnorePath)) {
    ignorePatterns = fs.readFileSync(vercelIgnorePath, 'utf8')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .map(line => line.trim());
    logInfo(`Found .vercelignore with ${ignorePatterns.length} patterns`);
  }
  
  // Create a function to check if a file should be ignored
  function shouldIgnore(filePath) {
    const relativePath = path.relative(sourceDir, filePath);
    return ignorePatterns.some(pattern => {
      if (pattern.startsWith('!')) {
        // Negated pattern (include this file)
        return false;
      }
      if (pattern.endsWith('/')) {
        // Directory pattern
        return relativePath.startsWith(pattern);
      }
      // File pattern or glob
      return relativePath === pattern || relativePath.startsWith(`${pattern}/`);
    });
  }
  
  // Recursive function to copy files
  function copyRecursive(source, target) {
    if (shouldIgnore(source)) {
      return;
    }
    
    const stat = fs.statSync(source);
    
    if (stat.isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      const entries = fs.readdirSync(source);
      
      for (const entry of entries) {
        const sourcePath = path.join(source, entry);
        const targetPath = path.join(target, entry);
        copyRecursive(sourcePath, targetPath);
      }
    } else if (stat.isFile()) {
      fs.copyFileSync(source, target);
    }
  }
  
  copyRecursive(sourceDir, targetDir);
  logSuccess(`Project files copied to ${targetDir}`);
}

// Check for common issues in the project
function checkForCommonIssues(projectDir) {
  logInfo('Checking for common deployment issues...');
  
  const issues = [];
  
  // Check package.json
  const packageJsonPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for type: module with next.config.js
    if (packageJson.type === 'module' && fs.existsSync(path.join(projectDir, 'next.config.js'))) {
      issues.push('Package.json has "type": "module" but uses next.config.js. This can cause module system conflicts. Consider using next.config.mjs or removing "type": "module".');
    }
    
    // Check for build script
    if (!packageJson.scripts || !packageJson.scripts.build) {
      issues.push('No "build" script found in package.json. Vercel requires a build script.');
    }
    
    // Check for next.js
    if (!packageJson.dependencies || !packageJson.dependencies.next) {
      issues.push('Next.js not found in dependencies. Make sure to include it in package.json.');
    }
    
    // Check for contentlayer configuration
    if ((packageJson.dependencies && packageJson.dependencies.contentlayer) || 
        (packageJson.devDependencies && packageJson.devDependencies.contentlayer)) {
      if (!fs.existsSync(path.join(projectDir, 'contentlayer.config.js')) && 
          !fs.existsSync(path.join(projectDir, 'contentlayer.config.ts'))) {
        issues.push('Contentlayer is installed but no contentlayer.config.js/ts file found.');
      }
    }
  } else {
    issues.push('No package.json found in the project root.');
  }
  
  // Check for next.config.js issues
  const nextConfigPath = path.join(projectDir, 'next.config.js');
  const nextConfigMjsPath = path.join(projectDir, 'next.config.mjs');
  const nextConfigTsPath = path.join(projectDir, 'next.config.ts');
  
  if (!fs.existsSync(nextConfigPath) && !fs.existsSync(nextConfigMjsPath) && !fs.existsSync(nextConfigTsPath)) {
    issues.push('No Next.js configuration file found (next.config.js, next.config.mjs, or next.config.ts).');
  }
  
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    if (nextConfigContent.includes('output: "export"') || nextConfigContent.includes('output: \'export\'')) {
      issues.push('Next.js is configured with "output: export" which is for static exports and not compatible with Vercel\'s server-side rendering.');
    }
  }
  
  // Check for .env files
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  const foundEnvFiles = envFiles.filter(file => fs.existsSync(path.join(projectDir, file)));
  
  if (foundEnvFiles.length > 0) {
    logWarning(`Found ${foundEnvFiles.length} .env files: ${foundEnvFiles.join(', ')}. Make sure to configure environment variables in Vercel dashboard.`);
  }
  
  // Report issues
  if (issues.length > 0) {
    logWarning(`Found ${issues.length} potential issues:`);
    issues.forEach((issue, index) => {
      logWarning(`${index + 1}. ${issue}`);
    });
  } else {
    logSuccess('No common issues found.');
  }
  
  return issues;
}

// Run the build process
function runBuild(projectDir) {
  log('Starting build process...', colors.green);
  
  try {
    // Install dependencies
    log('Installing dependencies...', colors.cyan);
    execute('npm install', { cwd: projectDir });
    logSuccess('Dependencies installed');
    
    // Run the build
    log('Running build...', colors.cyan);
    execute('npm run build', { cwd: projectDir });
    logSuccess('Build completed successfully');
    
    return true;
  } catch (error) {
    logError('Build failed');
    return false;
  }
}

// Main function
async function main() {
  log('Mock Vercel Builder', colors.green + colors.bright);
  log('This script simulates the Vercel build process locally', colors.dim);
  
  // Get the project directory
  const projectDir = process.cwd();
  logInfo(`Project directory: ${projectDir}`);
  
  // Create a temporary directory
  const tempDir = createTempDir();
  logInfo(`Temporary directory: ${tempDir}`);
  
  try {
    // Copy project files to temp directory
    copyProjectFiles(projectDir, tempDir);
    
    // Check for common issues
    const issues = checkForCommonIssues(tempDir);
    
    // Run the build process
    const buildSuccess = runBuild(tempDir);
    
    // Report results
    if (buildSuccess) {
      logSuccess('Mock Vercel build completed successfully');
      if (issues.length > 0) {
        logWarning(`However, ${issues.length} potential issues were found that might affect deployment.`);
      }
    } else {
      logError('Mock Vercel build failed');
      if (issues.length > 0) {
        logError(`${issues.length} potential issues were found that might be causing the failure.`);
      }
    }
  } catch (error) {
    logError(`An error occurred: ${error.message}`);
  } finally {
    // Clean up
    log('Cleaning up...', colors.dim);
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
      log('Temporary directory removed', colors.dim);
    } catch (error) {
      logWarning(`Failed to remove temporary directory: ${error.message}`);
    }
  }
}

// Run the main function
main().catch(error => {
  logError(`Unhandled error: ${error.message}`);
  process.exit(1);
});
