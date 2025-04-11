#!/usr/bin/env node

/**
 * Vercel Deployment Checker
 * 
 * This script checks your project for common Vercel deployment issues
 * and provides recommendations for fixing them.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Check for common deployment issues
function checkDeploymentIssues() {
  const issues = [];
  
  // Check package.json
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for type: module with next.config.js
      if (packageJson.type === 'module' && fs.existsSync(path.join(process.cwd(), 'next.config.js'))) {
        issues.push({
          type: 'error',
          message: 'Package.json has "type": "module" but uses next.config.js',
          details: 'This can cause module system conflicts in Vercel deployment',
          fix: 'Either remove "type": "module" from package.json or rename next.config.js to next.config.mjs'
        });
      }
      
      // Check for contentlayer without config
      if ((packageJson.dependencies && packageJson.dependencies.contentlayer) || 
          (packageJson.devDependencies && packageJson.devDependencies.contentlayer)) {
        if (!fs.existsSync(path.join(process.cwd(), 'contentlayer.config.js')) && 
            !fs.existsSync(path.join(process.cwd(), 'contentlayer.config.ts'))) {
          issues.push({
            type: 'error',
            message: 'Contentlayer is installed but no contentlayer.config.js/ts file found',
            details: 'Vercel build will fail without a contentlayer configuration file',
            fix: 'Create a contentlayer.config.js file in the project root'
          });
        }
      }
      
      // Check for next-contentlayer
      if ((packageJson.dependencies && packageJson.dependencies.contentlayer) && 
          (!packageJson.dependencies || !packageJson.dependencies['next-contentlayer'])) {
        issues.push({
          type: 'error',
          message: 'Contentlayer is installed but next-contentlayer is missing',
          details: 'Both packages are required for contentlayer to work properly',
          fix: 'Install next-contentlayer: npm install next-contentlayer'
        });
      }
      
      // Check for build script
      if (!packageJson.scripts || !packageJson.scripts.build) {
        issues.push({
          type: 'error',
          message: 'No "build" script found in package.json',
          details: 'Vercel requires a build script to deploy your application',
          fix: 'Add a build script to package.json, e.g., "build": "next build"'
        });
      }
    } else {
      issues.push({
        type: 'error',
        message: 'package.json not found',
        details: 'A package.json file is required for Vercel deployment',
        fix: 'Create a package.json file in the project root'
      });
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: `Error checking package.json: ${error.message}`,
      details: 'Could not parse package.json',
      fix: 'Make sure package.json is valid JSON'
    });
  }
  
  // Check next.config.js
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for output: 'export'
      if (nextConfig.includes('output:') && 
          (nextConfig.includes('output: "export"') || nextConfig.includes("output: 'export'"))) {
        issues.push({
          type: 'error',
          message: 'Next.js is configured with "output: export"',
          details: 'This setting is for static exports and not compatible with Vercel\'s server-side rendering',
          fix: 'Remove the "output: export" option for Vercel deployment'
        });
      }
      
      // Check for basePath
      if (nextConfig.includes('basePath:')) {
        issues.push({
          type: 'warning',
          message: 'basePath is set in next.config.js',
          details: 'This might cause routing issues on Vercel',
          fix: 'Consider removing basePath for Vercel deployment or ensure it\'s configured correctly'
        });
      }
    }
  } catch (error) {
    issues.push({
      type: 'error',
      message: `Error checking next.config.js: ${error.message}`,
      details: 'Could not read next.config.js',
      fix: 'Make sure next.config.js is valid JavaScript'
    });
  }
  
  // Check for .next directory in .gitignore
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      
      if (!gitignore.includes('.next') && !gitignore.includes('/.next')) {
        issues.push({
          type: 'warning',
          message: '.next directory is not in .gitignore',
          details: 'The .next directory should not be committed to Git',
          fix: 'Add ".next" to your .gitignore file'
        });
      }
    }
  } catch (error) {
    issues.push({
      type: 'warning',
      message: `Error checking .gitignore: ${error.message}`,
      details: 'Could not read .gitignore',
      fix: 'Make sure .gitignore exists and is readable'
    });
  }
  
  // Check for .env files
  try {
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
    const foundEnvFiles = envFiles.filter(file => fs.existsSync(path.join(process.cwd(), file)));
    
    if (foundEnvFiles.length > 0) {
      issues.push({
        type: 'info',
        message: `Found ${foundEnvFiles.length} .env files: ${foundEnvFiles.join(', ')}`,
        details: 'Environment variables need to be configured in the Vercel dashboard',
        fix: 'Add all required environment variables to your Vercel project settings'
      });
    }
  } catch (error) {
    issues.push({
      type: 'warning',
      message: `Error checking .env files: ${error.message}`,
      details: 'Could not check for environment files',
      fix: 'Make sure your environment files are readable'
    });
  }
  
  // Check for large files
  try {
    // Get the list of files in the project
    const output = execSync('find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -size +5M', { encoding: 'utf8' });
    
    if (output.trim()) {
      const largeFiles = output.trim().split('\n');
      
      issues.push({
        type: 'warning',
        message: `Found ${largeFiles.length} large files (>5MB)`,
        details: `Large files: ${largeFiles.join(', ')}`,
        fix: 'Consider removing or optimizing large files, or add them to .vercelignore'
      });
    }
  } catch (error) {
    // Ignore errors from the find command
  }
  
  return issues;
}

// Check for Vercel-specific optimizations
function checkOptimizations() {
  const optimizations = [];
  
  // Check for image optimization
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfigMjsPath = path.join(process.cwd(), 'next.config.mjs');
    
    let nextConfig = '';
    
    if (fs.existsSync(nextConfigPath)) {
      nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    } else if (fs.existsSync(nextConfigMjsPath)) {
      nextConfig = fs.readFileSync(nextConfigMjsPath, 'utf8');
    }
    
    if (nextConfig) {
      // Check for image optimization
      if (!nextConfig.includes('images:') || nextConfig.includes('unoptimized: true')) {
        optimizations.push({
          type: 'optimization',
          message: 'Image optimization is not enabled',
          details: 'Vercel provides built-in image optimization that can improve performance',
          fix: 'Enable image optimization in next.config.js by configuring the images property'
        });
      }
      
      // Check for internationalization
      if (nextConfig.includes('i18n:')) {
        optimizations.push({
          type: 'info',
          message: 'Internationalization is configured',
          details: 'Make sure your i18n configuration is compatible with Vercel',
          fix: 'Review the Vercel documentation for internationalization best practices'
        });
      }
    }
  } catch (error) {
    optimizations.push({
      type: 'warning',
      message: `Error checking Next.js configuration: ${error.message}`,
      details: 'Could not check for optimizations in Next.js configuration',
      fix: 'Make sure your Next.js configuration files are valid'
    });
  }
  
  // Check for caching headers
  try {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    
    if (fs.existsSync(vercelJsonPath)) {
      const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
      
      if (!vercelJson.headers || !vercelJson.headers.some(header => 
        header.headers && header.headers.some(h => h.key === 'Cache-Control')
      )) {
        optimizations.push({
          type: 'optimization',
          message: 'No Cache-Control headers found in vercel.json',
          details: 'Adding caching headers can improve performance',
          fix: 'Add Cache-Control headers to vercel.json for static assets'
        });
      }
    }
  } catch (error) {
    optimizations.push({
      type: 'warning',
      message: `Error checking vercel.json: ${error.message}`,
      details: 'Could not check for optimizations in vercel.json',
      fix: 'Make sure vercel.json is valid JSON'
    });
  }
  
  return optimizations;
}

// Main function
function main() {
  log('Vercel Deployment Checker', colors.green + colors.bright);
  log('This script checks your project for common Vercel deployment issues', colors.dim);
  log('-------------------------------------------------------------------', colors.dim);
  
  // Check for deployment issues
  const issues = checkDeploymentIssues();
  
  // Check for optimizations
  const optimizations = checkOptimizations();
  
  // Report results
  const errors = issues.filter(issue => issue.type === 'error');
  const warnings = issues.filter(issue => issue.type === 'warning');
  const infos = issues.filter(issue => issue.type === 'info');
  
  log('\nDeployment Issues:', colors.bright);
  log(`${errors.length} critical issues`, errors.length > 0 ? colors.red : colors.green);
  log(`${warnings.length} warnings`, warnings.length > 0 ? colors.yellow : colors.green);
  log(`${infos.length} informational items`, colors.cyan);
  log(`${optimizations.length} optimization opportunities`, colors.magenta);
  
  // Show errors
  if (errors.length > 0) {
    log('\nCritical Issues:', colors.red + colors.bright);
    errors.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.message}`, colors.red);
      log(`   Details: ${issue.details}`, colors.dim);
      log(`   Fix: ${issue.fix}`, colors.green);
    });
  }
  
  // Show warnings
  if (warnings.length > 0) {
    log('\nWarnings:', colors.yellow + colors.bright);
    warnings.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.message}`, colors.yellow);
      log(`   Details: ${issue.details}`, colors.dim);
      log(`   Fix: ${issue.fix}`, colors.green);
    });
  }
  
  // Show info
  if (infos.length > 0) {
    log('\nInformational Items:', colors.cyan + colors.bright);
    infos.forEach((issue, index) => {
      log(`\n${index + 1}. ${issue.message}`, colors.cyan);
      log(`   Details: ${issue.details}`, colors.dim);
      log(`   Recommendation: ${issue.fix}`, colors.green);
    });
  }
  
  // Show optimizations
  if (optimizations.length > 0) {
    log('\nOptimization Opportunities:', colors.magenta + colors.bright);
    optimizations.forEach((opt, index) => {
      log(`\n${index + 1}. ${opt.message}`, colors.magenta);
      log(`   Details: ${opt.details}`, colors.dim);
      log(`   Recommendation: ${opt.fix}`, colors.green);
    });
  }
  
  // Summary
  log('\n-------------------------------------------------------------------', colors.dim);
  if (errors.length === 0) {
    if (warnings.length === 0) {
      log('✨ Your project looks ready for Vercel deployment!', colors.green + colors.bright);
    } else {
      log('🟡 Your project should work on Vercel, but has some warnings to address.', colors.yellow + colors.bright);
    }
  } else {
    log('🔴 Your project has critical issues that need to be fixed before deploying to Vercel.', colors.red + colors.bright);
  }
  
  // Next steps
  log('\nNext Steps:', colors.bright);
  if (errors.length > 0) {
    log('1. Fix the critical issues listed above', colors.red);
    log('2. Run this script again to verify the fixes', colors.yellow);
    log('3. Deploy to Vercel once all critical issues are resolved', colors.green);
  } else if (warnings.length > 0) {
    log('1. Consider addressing the warnings listed above', colors.yellow);
    log('2. Deploy to Vercel', colors.green);
    log('3. Monitor your deployment for any issues', colors.cyan);
  } else {
    log('1. Deploy to Vercel', colors.green);
    log('2. Consider implementing the optimization opportunities', colors.magenta);
    log('3. Monitor your deployment for any issues', colors.cyan);
  }
}

// Run the main function
main();
