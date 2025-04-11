#!/usr/bin/env node

/**
 * Mock Vercel Deployment
 * 
 * This script simulates the Vercel deployment process by:
 * 1. Running the configuration check
 * 2. Building the project
 * 3. Starting a local server to test the build
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');

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

// Find an available port
function findAvailablePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const server = http.createServer();
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next one
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
}

// Start a server to test the build
async function startServer(buildDir, port) {
  return new Promise((resolve, reject) => {
    try {
      // Check if the build directory exists
      if (!fs.existsSync(buildDir)) {
        reject(new Error(`Build directory not found: ${buildDir}`));
        return;
      }
      
      // Start the server
      logInfo(`Starting server on port ${port}...`);
      
      // Use the appropriate command based on the build output
      let serverProcess;
      
      if (fs.existsSync(path.join(buildDir, 'server.js'))) {
        // Next.js server build
        serverProcess = spawn('node', ['server.js'], { cwd: buildDir });
      } else {
        // Static build (using a simple HTTP server)
        const handler = (req, res) => {
          let filePath = path.join(buildDir, req.url === '/' ? 'index.html' : req.url);
          
          // Handle directory requests
          if (!path.extname(filePath)) {
            filePath = path.join(filePath, 'index.html');
          }
          
          fs.readFile(filePath, (err, data) => {
            if (err) {
              res.writeHead(404);
              res.end('File not found');
              return;
            }
            
            // Set content type based on file extension
            const ext = path.extname(filePath);
            let contentType = 'text/html';
            
            switch (ext) {
              case '.js':
                contentType = 'text/javascript';
                break;
              case '.css':
                contentType = 'text/css';
                break;
              case '.json':
                contentType = 'application/json';
                break;
              case '.png':
                contentType = 'image/png';
                break;
              case '.jpg':
              case '.jpeg':
                contentType = 'image/jpeg';
                break;
              case '.svg':
                contentType = 'image/svg+xml';
                break;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
          });
        };
        
        const server = http.createServer(handler);
        server.listen(port);
        serverProcess = { server };
      }
      
      logSuccess(`Server started on http://localhost:${port}`);
      logInfo('Press Ctrl+C to stop the server');
      
      resolve(serverProcess);
    } catch (error) {
      reject(error);
    }
  });
}

// Main function
async function main() {
  log('Mock Vercel Deployment', colors.green + colors.bright);
  log('This script simulates the Vercel deployment process', colors.dim);
  log('-------------------------------------------------------------------', colors.dim);
  
  try {
    // Step 1: Run the configuration check
    logInfo('Step 1: Checking configuration...');
    execute('node ' + path.join(__dirname, 'check-config.js'));
    
    // Ask the user if they want to continue
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const response = await new Promise(resolve => {
      readline.question('\nDo you want to continue with the build? (y/n) ', resolve);
    });
    
    if (response.toLowerCase() !== 'y') {
      log('Deployment cancelled', colors.yellow);
      readline.close();
      return;
    }
    
    readline.close();
    
    // Step 2: Run the build
    log('-------------------------------------------------------------------', colors.dim);
    logInfo('Step 2: Building the project...');
    execute('node ' + path.join(__dirname, 'build.js'));
    
    // Step 3: Start a server to test the build
    log('-------------------------------------------------------------------', colors.dim);
    logInfo('Step 3: Starting a server to test the build...');
    
    // Find the build output directory
    let buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      buildDir = path.join(process.cwd(), 'out');
      
      if (!fs.existsSync(buildDir)) {
        logError('Build output directory not found. Make sure the build completed successfully.');
        return;
      }
    }
    
    // Find an available port
    const port = await findAvailablePort();
    
    // Start the server
    const serverProcess = await startServer(buildDir, port);
    
    // Keep the process running until the user terminates it
    process.on('SIGINT', () => {
      log('\nStopping server...', colors.dim);
      
      if (serverProcess.server) {
        serverProcess.server.close();
      } else {
        serverProcess.kill();
      }
      
      logSuccess('Server stopped');
      process.exit(0);
    });
  } catch (error) {
    logError(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  logError(`Unhandled error: ${error.message}`);
  process.exit(1);
});
