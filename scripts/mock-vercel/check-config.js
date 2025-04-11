#!/usr/bin/env node

/**
 * Vercel Configuration Checker
 * 
 * This script checks your project's configuration for Vercel compatibility
 * and provides recommendations for fixing issues.
 */

const fs = require('fs');
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

// Check package.json
function checkPackageJson() {
  logInfo('Checking package.json...');
  
  const issues = [];
  
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      logError('package.json not found');
      return [{ severity: 'error', message: 'package.json not found in project root' }];
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for type: module
    if (packageJson.type === 'module') {
      issues.push({ 
        severity: 'warning', 
        message: 'Package.json has "type": "module" which can cause issues with Next.js configuration',
        fix: 'Remove "type": "module" or ensure you use .mjs extension for Next.js config'
      });
    }
    
    // Check for build script
    if (!packageJson.scripts || !packageJson.scripts.build) {
      issues.push({ 
        severity: 'error', 
        message: 'No "build" script found in package.json',
        fix: 'Add a build script, e.g., "build": "next build"'
      });
    }
    
    // Check for next.js
    if (!packageJson.dependencies || !packageJson.dependencies.next) {
      issues.push({ 
        severity: 'error', 
        message: 'Next.js not found in dependencies',
        fix: 'Add Next.js to dependencies: npm install next'
      });
    } else {
      logSuccess(`Next.js version: ${packageJson.dependencies.next}`);
    }
    
    // Check for react and react-dom
    if (!packageJson.dependencies || !packageJson.dependencies.react || !packageJson.dependencies['react-dom']) {
      issues.push({ 
        severity: 'error', 
        message: 'React and/or React DOM not found in dependencies',
        fix: 'Add React to dependencies: npm install react react-dom'
      });
    }
    
    // Check for contentlayer
    if ((packageJson.dependencies && packageJson.dependencies.contentlayer) || 
        (packageJson.devDependencies && packageJson.devDependencies.contentlayer)) {
      logInfo('Contentlayer detected');
      
      // Check for contentlayer config
      const contentlayerConfigPath = path.join(process.cwd(), 'contentlayer.config.js');
      const contentlayerConfigTsPath = path.join(process.cwd(), 'contentlayer.config.ts');
      
      if (!fs.existsSync(contentlayerConfigPath) && !fs.existsSync(contentlayerConfigTsPath)) {
        issues.push({ 
          severity: 'warning', 
          message: 'Contentlayer is installed but no contentlayer.config.js/ts file found',
          fix: 'Create a contentlayer.config.js file in the project root'
        });
      }
      
      // Check for next-contentlayer
      if (!packageJson.dependencies || !packageJson.dependencies['next-contentlayer']) {
        issues.push({ 
          severity: 'warning', 
          message: 'Contentlayer is installed but next-contentlayer is missing',
          fix: 'Install next-contentlayer: npm install next-contentlayer'
        });
      }
    }
    
    // Check for vercel-specific scripts
    if (!packageJson.scripts || !packageJson.scripts['vercel-build']) {
      logInfo('No "vercel-build" script found. This is optional but can be useful for Vercel-specific build steps.');
    }
    
    // Report results
    if (issues.length === 0) {
      logSuccess('package.json looks good for Vercel deployment');
    } else {
      const errors = issues.filter(issue => issue.severity === 'error');
      const warnings = issues.filter(issue => issue.severity === 'warning');
      
      if (errors.length > 0) {
        logError(`Found ${errors.length} critical issues in package.json`);
      }
      
      if (warnings.length > 0) {
        logWarning(`Found ${warnings.length} potential issues in package.json`);
      }
    }
    
    return issues;
  } catch (error) {
    logError(`Error checking package.json: ${error.message}`);
    return [{ severity: 'error', message: `Error checking package.json: ${error.message}` }];
  }
}

// Check Next.js configuration
function checkNextConfig() {
  logInfo('Checking Next.js configuration...');
  
  const issues = [];
  
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const nextConfigMjsPath = path.join(process.cwd(), 'next.config.mjs');
    const nextConfigTsPath = path.join(process.cwd(), 'next.config.ts');
    const nextConfigCjsPath = path.join(process.cwd(), 'next.config.cjs');
    
    // Check if any config file exists
    if (!fs.existsSync(nextConfigPath) && 
        !fs.existsSync(nextConfigMjsPath) && 
        !fs.existsSync(nextConfigTsPath) &&
        !fs.existsSync(nextConfigCjsPath)) {
      logWarning('No Next.js configuration file found. Using default configuration.');
      return issues;
    }
    
    // Check each config file
    if (fs.existsSync(nextConfigPath)) {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for module.exports vs export default
      if (!content.includes('module.exports') && content.includes('export default')) {
        issues.push({ 
          severity: 'error', 
          message: 'next.config.js uses ES modules syntax (export default) but should use CommonJS (module.exports)',
          fix: 'Change "export default" to "module.exports =" or rename the file to next.config.mjs'
        });
      }
      
      // Check for output: 'export'
      if (content.includes('output:') && 
          (content.includes('output: "export"') || content.includes("output: 'export'"))) {
        issues.push({ 
          severity: 'error', 
          message: 'Next.js is configured with "output: export" which is not compatible with Vercel\'s server-side rendering',
          fix: 'Remove the "output: export" option for Vercel deployment'
        });
      }
      
      // Check for basePath
      if (content.includes('basePath:')) {
        issues.push({ 
          severity: 'warning', 
          message: 'basePath is set in next.config.js which might cause routing issues on Vercel',
          fix: 'Consider removing basePath for Vercel deployment or ensure it\'s configured correctly'
        });
      }
    }
    
    if (fs.existsSync(nextConfigMjsPath)) {
      const content = fs.readFileSync(nextConfigMjsPath, 'utf8');
      
      // Check for output: 'export'
      if (content.includes('output:') && 
          (content.includes('output: "export"') || content.includes("output: 'export'"))) {
        issues.push({ 
          severity: 'error', 
          message: 'Next.js is configured with "output: export" in next.config.mjs which is not compatible with Vercel\'s server-side rendering',
          fix: 'Remove the "output: export" option for Vercel deployment'
        });
      }
      
      // Check for basePath
      if (content.includes('basePath:')) {
        issues.push({ 
          severity: 'warning', 
          message: 'basePath is set in next.config.mjs which might cause routing issues on Vercel',
          fix: 'Consider removing basePath for Vercel deployment or ensure it\'s configured correctly'
        });
      }
    }
    
    // Report results
    if (issues.length === 0) {
      logSuccess('Next.js configuration looks good for Vercel deployment');
    } else {
      const errors = issues.filter(issue => issue.severity === 'error');
      const warnings = issues.filter(issue => issue.severity === 'warning');
      
      if (errors.length > 0) {
        logError(`Found ${errors.length} critical issues in Next.js configuration`);
      }
      
      if (warnings.length > 0) {
        logWarning(`Found ${warnings.length} potential issues in Next.js configuration`);
      }
    }
    
    return issues;
  } catch (error) {
    logError(`Error checking Next.js configuration: ${error.message}`);
    return [{ severity: 'error', message: `Error checking Next.js configuration: ${error.message}` }];
  }
}

// Check Vercel configuration
function checkVercelConfig() {
  logInfo('Checking Vercel configuration...');
  
  const issues = [];
  
  try {
    const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
    
    if (!fs.existsSync(vercelJsonPath)) {
      logInfo('No vercel.json found. Using default Vercel configuration.');
      return issues;
    }
    
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    
    // Check for builds configuration
    if (vercelJson.builds) {
      logInfo('Custom builds configuration found in vercel.json');
      
      // Check if builds is using @vercel/next
      const hasNextBuilder = vercelJson.builds.some(build => 
        build.use === '@vercel/next' || 
        (build.src && build.src.includes('package.json'))
      );
      
      if (!hasNextBuilder) {
        issues.push({ 
          severity: 'warning', 
          message: 'No Next.js builder found in vercel.json builds configuration',
          fix: 'Add a build configuration for Next.js: { "src": "package.json", "use": "@vercel/next" }'
        });
      }
    }
    
    // Check for routes configuration
    if (vercelJson.routes) {
      logInfo(`Found ${vercelJson.routes.length} route configurations in vercel.json`);
    }
    
    // Check for redirects configuration
    if (vercelJson.redirects) {
      logInfo(`Found ${vercelJson.redirects.length} redirect configurations in vercel.json`);
    }
    
    // Check for headers configuration
    if (vercelJson.headers) {
      logInfo(`Found ${vercelJson.headers.length} header configurations in vercel.json`);
    }
    
    // Report results
    if (issues.length === 0) {
      logSuccess('vercel.json looks good for Vercel deployment');
    } else {
      const errors = issues.filter(issue => issue.severity === 'error');
      const warnings = issues.filter(issue => issue.severity === 'warning');
      
      if (errors.length > 0) {
        logError(`Found ${errors.length} critical issues in vercel.json`);
      }
      
      if (warnings.length > 0) {
        logWarning(`Found ${warnings.length} potential issues in vercel.json`);
      }
    }
    
    return issues;
  } catch (error) {
    logError(`Error checking vercel.json: ${error.message}`);
    return [{ severity: 'error', message: `Error checking vercel.json: ${error.message}` }];
  }
}

// Check for .vercelignore
function checkVercelIgnore() {
  logInfo('Checking .vercelignore...');
  
  const issues = [];
  
  try {
    const vercelIgnorePath = path.join(process.cwd(), '.vercelignore');
    
    if (!fs.existsSync(vercelIgnorePath)) {
      logInfo('No .vercelignore found. Consider creating one to exclude unnecessary files from deployment.');
      return issues;
    }
    
    const vercelIgnore = fs.readFileSync(vercelIgnorePath, 'utf8');
    const ignoreLines = vercelIgnore.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    logInfo(`Found ${ignoreLines.length} ignore patterns in .vercelignore`);
    
    // Check for common patterns
    const commonPatterns = [
      'node_modules',
      '.git',
      '.github',
      '.next/cache',
      'README.md',
      '*.log'
    ];
    
    const missingPatterns = commonPatterns.filter(pattern => 
      !ignoreLines.some(line => line.includes(pattern))
    );
    
    if (missingPatterns.length > 0) {
      issues.push({ 
        severity: 'info', 
        message: `Consider adding these common patterns to .vercelignore: ${missingPatterns.join(', ')}`,
        fix: `Add these patterns to .vercelignore: ${missingPatterns.join(', ')}`
      });
    }
    
    // Report results
    if (issues.length === 0) {
      logSuccess('.vercelignore looks good');
    } else {
      logInfo(`Found ${issues.length} suggestions for .vercelignore`);
    }
    
    return issues;
  } catch (error) {
    logError(`Error checking .vercelignore: ${error.message}`);
    return [{ severity: 'error', message: `Error checking .vercelignore: ${error.message}` }];
  }
}

// Check for environment variables
function checkEnvironmentVariables() {
  logInfo('Checking environment variables...');
  
  const issues = [];
  
  try {
    const envFiles = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      '.env.development.local',
      '.env.production.local'
    ];
    
    const foundEnvFiles = envFiles.filter(file => fs.existsSync(path.join(process.cwd(), file)));
    
    if (foundEnvFiles.length > 0) {
      logInfo(`Found ${foundEnvFiles.length} environment files: ${foundEnvFiles.join(', ')}`);
      
      issues.push({ 
        severity: 'info', 
        message: 'Environment files found. Remember to configure these variables in the Vercel dashboard.',
        fix: 'Add all required environment variables to your Vercel project settings'
      });
    } else {
      logInfo('No environment files found');
    }
    
    return issues;
  } catch (error) {
    logError(`Error checking environment variables: ${error.message}`);
    return [{ severity: 'error', message: `Error checking environment variables: ${error.message}` }];
  }
}

// Main function
function main() {
  log('Vercel Configuration Checker', colors.green + colors.bright);
  log('This script checks your project\'s configuration for Vercel compatibility', colors.dim);
  log('-------------------------------------------------------------------', colors.dim);
  
  // Run all checks
  const packageJsonIssues = checkPackageJson();
  log('-------------------------------------------------------------------', colors.dim);
  
  const nextConfigIssues = checkNextConfig();
  log('-------------------------------------------------------------------', colors.dim);
  
  const vercelConfigIssues = checkVercelConfig();
  log('-------------------------------------------------------------------', colors.dim);
  
  const vercelIgnoreIssues = checkVercelIgnore();
  log('-------------------------------------------------------------------', colors.dim);
  
  const envIssues = checkEnvironmentVariables();
  log('-------------------------------------------------------------------', colors.dim);
  
  // Combine all issues
  const allIssues = [
    ...packageJsonIssues,
    ...nextConfigIssues,
    ...vercelConfigIssues,
    ...vercelIgnoreIssues,
    ...envIssues
  ];
  
  // Report summary
  const errorCount = allIssues.filter(issue => issue.severity === 'error').length;
  const warningCount = allIssues.filter(issue => issue.severity === 'warning').length;
  const infoCount = allIssues.filter(issue => issue.severity === 'info').length;
  
  log('Summary:', colors.bright);
  log(`${errorCount} critical issues`, errorCount > 0 ? colors.red : colors.green);
  log(`${warningCount} warnings`, warningCount > 0 ? colors.yellow : colors.green);
  log(`${infoCount} suggestions`, colors.cyan);
  
  if (errorCount > 0 || warningCount > 0) {
    log('\nIssues that need attention:', colors.bright);
    
    // Show errors first
    allIssues
      .filter(issue => issue.severity === 'error' || issue.severity === 'warning')
      .forEach((issue, index) => {
        const color = issue.severity === 'error' ? colors.red : colors.yellow;
        log(`\n${index + 1}. ${issue.message}`, color);
        if (issue.fix) {
          log(`   Fix: ${issue.fix}`, colors.green);
        }
      });
  }
  
  if (infoCount > 0) {
    log('\nSuggestions for improvement:', colors.bright);
    
    // Show info
    allIssues
      .filter(issue => issue.severity === 'info')
      .forEach((issue, index) => {
        log(`\n${index + 1}. ${issue.message}`, colors.cyan);
        if (issue.fix) {
          log(`   Suggestion: ${issue.fix}`, colors.green);
        }
      });
  }
  
  if (errorCount === 0 && warningCount === 0) {
    log('\n✨ Your project looks ready for Vercel deployment!', colors.green + colors.bright);
  } else if (errorCount === 0) {
    log('\n🟡 Your project should work on Vercel, but could be improved.', colors.yellow + colors.bright);
  } else {
    log('\n🔴 Your project has issues that need to be fixed before deploying to Vercel.', colors.red + colors.bright);
  }
}

// Run the main function
main();
