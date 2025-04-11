import { chromium, devices } from '@playwright/test';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import path from 'path';
import net from 'net';
import http from 'http';

// Configuration
const config = {
  headless: true, // Set to false if you want to see the browser
  screenshotsDir: path.join(process.cwd(), 'mcp-screenshots'),
  logsDir: path.join(process.cwd(), 'browser-logs'),
  reportsDir: path.join(process.cwd(), 'mcp-reports'),
  defaultTimeout: 45000, // 45 seconds
  devices: ['Desktop Chrome', 'iPhone 12'] // Devices to test
};

// Ensure directories exist
[config.screenshotsDir, config.logsDir, config.reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function findAvailablePort(startPort: number = 3000, maxPort: number = 3010): Promise<number> {
  return new Promise((resolve, reject) => {
    function checkPort(port: number) {
      const server = net.createServer();
      server.listen(port, () => {
        server.close(() => {
          resolve(port);
        });
      });
      server.on('error', () => {
        if (port >= maxPort) {
          reject(new Error('No available ports found'));
        } else {
          checkPort(port + 1);
        }
      });
    }
    checkPort(startPort);
  });
}

async function checkServerAvailable(host: string, port: number, timeout: number = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();

    function tryConnect() {
      const req = http.request({
        method: 'GET',
        host: host,
        port: port,
        timeout: timeout
      }, () => {
        resolve(true);
      });

      req.on('error', () => {
        if (Date.now() - start > timeout) {
          resolve(false);
        } else {
          setTimeout(tryConnect, 500);
        }
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    }

    tryConnect();
  });
}

async function startDevServer(): Promise<{ server: ChildProcessWithoutNullStreams, port: number }> {
  // Find an available port
  const port = await findAvailablePort();

  return new Promise((resolve, reject) => {
    console.log(`Attempting to start dev server on port ${port}`);

    const devServer = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true,
      env: {
        ...process.env,
        PORT: port.toString(),
        NODE_OPTIONS: '--max_old_space_size=4096' // Increase memory limit
      }
    });

    const startTimeout = setTimeout(() => {
      devServer.kill();
      reject(new Error(`Dev server failed to start on port ${port} within 30 seconds`));
    }, 45000);

    const readyHandler = (data: Buffer) => {
      const output = data.toString();
      console.log('Dev Server Output:', output);

      if (output.includes('ready') || output.includes('started server') || output.includes(`http://localhost:${port}`)) {
        clearTimeout(startTimeout);
        devServer.stdout?.off('data', readyHandler);
        resolve({ server: devServer, port });
      }
    };

    devServer.stdout?.on('data', readyHandler);

    devServer.stderr?.on('data', (data) => {
      const errorOutput = data.toString();
      console.error('Dev Server Error:', errorOutput);
    });

    devServer.on('error', (error) => {
      clearTimeout(startTimeout);
      reject(error);
    });

    devServer.on('exit', (code, signal) => {
      console.log(`Dev server exited with code ${code} and signal ${signal}`);
    });
  });
}

/**
 * Model Context Protocol (MCP) Browser Tool
 * This class provides methods for AI assistants to interact with web browsers
 * in a headless mode, allowing for autonomous testing and debugging.
 */
class MCPBrowserTool {
  private devServer: ChildProcessWithoutNullStreams | null = null;
  private serverPort: number = 3000;
  private browser: any = null;
  private context: any = null;
  private page: any = null;
  private sessionId: string;
  private logs: string[] = [];
  private consoleLog: string[] = [];
  private networkLog: string[] = [];
  private accessibilityIssues: string[] = [];
  private errors: string[] = [];

  constructor() {
    this.sessionId = new Date().toISOString().replace(/[:.]/g, '-');
    this.log('MCP Browser Tool initialized');
  }

  /**
   * Log a message and save it to the session log
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    this.logs.push(logEntry);
    fs.appendFileSync(path.join(config.logsDir, 'mcp-session.log'), logEntry + '\n');
  }

  /**
   * Start the development server
   */
  async startServer(): Promise<number> {
    try {
      this.log('Starting development server...');
      const serverInfo = await startDevServer();
      this.devServer = serverInfo.server;
      this.serverPort = serverInfo.port;

      // Wait for server to be fully available
      const serverAvailable = await checkServerAvailable('localhost', this.serverPort, config.defaultTimeout);
      if (!serverAvailable) {
        throw new Error(`Dev server did not become available on port ${this.serverPort} in time`);
      }

      this.log(`Development server started on port ${this.serverPort}`);
      return this.serverPort;
    } catch (error) {
      this.log(`Failed to start development server: ${error}`);
      throw error;
    }
  }

  /**
   * Initialize the browser
   */
  async initializeBrowser(): Promise<void> {
    try {
      this.log('Launching browser...');
      this.browser = await chromium.launch({
        headless: config.headless,
        logger: {
          isEnabled: (_name: string, severity: string) => severity === 'verbose',
          log: (_name: string, severity: string, message: string, args: any) => {
            const logEntry = `${new Date().toISOString()} - ${severity}: ${message} ${args ? JSON.stringify(args) : ''}`;
            fs.appendFileSync(path.join(config.logsDir, 'browser-verbose.log'), logEntry + '\n');
          }
        }
      });

      this.log('Browser launched successfully');
    } catch (error) {
      this.log(`Failed to launch browser: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new browser context and page
   */
  async createPage(deviceName: string = 'Desktop Chrome'): Promise<void> {
    try {
      if (!this.browser) {
        await this.initializeBrowser();
      }

      this.log(`Creating new page with device: ${deviceName}`);

      // Use device emulation if specified
      const deviceConfig = devices[deviceName] || {};
      this.context = await this.browser.newContext(deviceConfig);
      this.page = await this.context.newPage();

      // Set up event listeners
      this.setupEventListeners();

      this.log('Page created successfully');
    } catch (error) {
      this.log(`Failed to create page: ${error}`);
      throw error;
    }
  }

  /**
   * Set up event listeners for the page
   */
  private setupEventListeners(): void {
    if (!this.page) return;

    // Capture console logs
    this.page.on('console', (msg: any) => {
      const logEntry = `${new Date().toISOString()} - ${msg.type()}: ${msg.text()}`;
      this.consoleLog.push(logEntry);
      fs.appendFileSync(path.join(config.logsDir, 'console.log'), logEntry + '\n');

      // Track errors separately
      if (msg.type() === 'error') {
        this.errors.push(msg.text());
      }
    });

    // Capture page errors
    this.page.on('pageerror', (error: Error) => {
      const logEntry = `${new Date().toISOString()} - PAGE ERROR: ${error.message}`;
      this.errors.push(error.message);
      fs.appendFileSync(path.join(config.logsDir, 'errors.log'), logEntry + '\n');
    });

    // Capture network requests
    this.page.on('request', (request: any) => {
      const logEntry = `${new Date().toISOString()} - REQUEST: ${request.method()} ${request.url()}`;
      this.networkLog.push(logEntry);
      fs.appendFileSync(path.join(config.logsDir, 'network.log'), logEntry + '\n');
    });

    this.page.on('response', (response: any) => {
      const logEntry = `${new Date().toISOString()} - RESPONSE: ${response.status()} ${response.url()}`;
      this.networkLog.push(logEntry);
      fs.appendFileSync(path.join(config.logsDir, 'network.log'), logEntry + '\n');

      // Track failed responses
      if (response.status() >= 400) {
        this.errors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    this.page.on('requestfailed', (request: any) => {
      const logEntry = `${new Date().toISOString()} - REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText || 'Unknown error'}`;
      this.errors.push(logEntry);
      fs.appendFileSync(path.join(config.logsDir, 'errors.log'), logEntry + '\n');
    });
  }

  /**
   * Navigate to a URL
   */
  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      await this.createPage();
    }

    try {
      this.log(`Navigating to: ${url}`);
      const response = await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: config.defaultTimeout
      });

      // Log page details
      const pageTitle = await this.page.title();
      const pageUrl = this.page.url();
      const logDetails = `
Page Details:
- Title: ${pageTitle}
- URL: ${pageUrl}
- Status: ${response?.status()}
`;

      this.log(`Page loaded: ${pageTitle}`);
      fs.writeFileSync(path.join(config.logsDir, 'page-details.log'), logDetails);

      // Take a screenshot after navigation
      await this.takeScreenshot(`navigation-${new URL(url).hostname}`);
    } catch (error) {
      this.log(`Failed to navigate to ${url}: ${error}`);
      throw error;
    }
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(name: string = 'screenshot'): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    try {
      const filename = `${this.sessionId}-${name}-${Date.now()}.png`;
      const filepath = path.join(config.screenshotsDir, filename);

      await this.page.screenshot({ path: filepath, fullPage: true });
      this.log(`Screenshot saved: ${filepath}`);
      return filepath;
    } catch (error) {
      this.log(`Failed to take screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Run accessibility checks on the page
   */
  async runAccessibilityChecks(): Promise<string[]> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    try {
      this.log('Running accessibility checks...');
      this.accessibilityIssues = [];

      // Check for images without alt text
      const elements = await this.page.$$('*');
      for (const element of elements) {
        // Check for images without alt text
        if (await element.evaluate((el: any) => el.tagName === 'IMG' && !el.getAttribute('alt'))) {
          const src = await element.evaluate((el: any) => el.getAttribute('src'));
          this.accessibilityIssues.push(`Missing alt text for image: ${src}`);
        }

        // Check for empty links
        if (await element.evaluate((el: any) => el.tagName === 'A' && !el.textContent.trim() && !el.querySelector('img') && !el.getAttribute('aria-label'))) {
          const href = await element.evaluate((el: any) => el.getAttribute('href'));
          this.accessibilityIssues.push(`Empty link: ${href}`);
        }

        // Check for heading hierarchy
        if (await element.evaluate((el: any) => el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6')) {
          const level = await element.evaluate((el: any) => parseInt(el.tagName.substring(1)));
          const text = await element.evaluate((el: any) => el.textContent.trim());
          if (!text) {
            this.accessibilityIssues.push(`Empty heading: ${await element.evaluate((el: any) => el.outerHTML)}`);
          }
        }
      }

      // Check for color contrast (basic check)
      const contrastIssues = await this.page.evaluate(() => {
        const issues: string[] = [];
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          const color = style.color;
          const bgColor = style.backgroundColor;
          // This is a very basic check - a real implementation would calculate contrast ratios
          if (color === 'rgb(255, 255, 255)' && bgColor === 'rgb(255, 255, 255)') {
            issues.push(`Potential contrast issue: ${el.tagName} with white text on white background`);
          }
        });
        return issues;
      });

      this.accessibilityIssues.push(...contrastIssues);

      // Save accessibility issues to file
      fs.writeFileSync(
        path.join(config.logsDir, 'accessibility.log'),
        this.accessibilityIssues.join('\n')
      );

      this.log(`Found ${this.accessibilityIssues.length} accessibility issues`);
      return this.accessibilityIssues;
    } catch (error) {
      this.log(`Failed to run accessibility checks: ${error}`);
      throw error;
    }
  }

  /**
   * Check for visual elements on the page
   */
  async checkVisualElements(): Promise<Record<string, boolean>> {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    try {
      this.log('Checking for visual elements...');
      const elements = {
        header: await this.page.isVisible('header'),
        footer: await this.page.isVisible('footer'),
        main: await this.page.isVisible('main'),
        navigation: await this.page.isVisible('nav')
      };

      const logEntry = Object.entries(elements)
        .map(([name, exists]) => `${name}: ${exists ? 'Present' : 'Missing'}`)
        .join('\n');

      fs.writeFileSync(path.join(config.logsDir, 'visual-elements.log'), logEntry);
      this.log(`Visual elements check: ${logEntry.replace(/\n/g, ', ')}`);

      return elements;
    } catch (error) {
      this.log(`Failed to check visual elements: ${error}`);
      throw error;
    }
  }

  /**
   * Generate a comprehensive report
   */
  async generateReport(): Promise<string> {
    const report = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      url: this.page?.url() || 'N/A',
      title: await this.page?.title() || 'N/A',
      visualElements: await this.checkVisualElements(),
      errors: this.errors,
      accessibilityIssues: this.accessibilityIssues,
      consoleLogCount: this.consoleLog.length,
      networkRequestCount: this.networkLog.length,
      screenshots: fs.readdirSync(config.screenshotsDir)
        .filter(file => file.startsWith(this.sessionId))
        .map(file => path.join(config.screenshotsDir, file))
    };

    const reportPath = path.join(config.reportsDir, `mcp-report-${this.sessionId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`Report generated: ${reportPath}`);

    return reportPath;
  }

  /**
   * Close all resources
   */
  async close(): Promise<void> {
    try {
      if (this.browser) {
        this.log('Closing browser...');
        await this.browser.close();
        this.browser = null;
        this.context = null;
        this.page = null;
      }

      if (this.devServer) {
        this.log('Stopping development server...');
        this.devServer.kill();
        this.devServer = null;
      }

      this.log('All resources closed');
    } catch (error) {
      this.log(`Error during cleanup: ${error}`);
    }
  }

  /**
   * Run a complete test on the local development server
   */
  async runLocalTest(): Promise<void> {
    try {
      // Start the development server
      const port = await this.startServer();

      // Test on desktop
      await this.createPage('Desktop Chrome');
      await this.navigateTo(`http://localhost:${port}`);
      await this.checkVisualElements();
      await this.runAccessibilityChecks();
      await this.takeScreenshot('desktop-view');

      // Test on mobile
      await this.createPage('iPhone 12');
      await this.navigateTo(`http://localhost:${port}`);
      await this.checkVisualElements();
      await this.takeScreenshot('mobile-view');

      // Generate report
      await this.generateReport();

      this.log('Local test completed successfully');
    } catch (error) {
      this.log(`Local test failed: ${error}`);
      throw error;
    } finally {
      await this.close();
    }
  }

  /**
   * Run a test on the Vercel deployment
   */
  async runVercelTest(url: string = 'https://angleito-github-io.vercel.app'): Promise<void> {
    try {
      // Test on desktop
      await this.createPage('Desktop Chrome');
      await this.navigateTo(url);
      await this.checkVisualElements();
      await this.runAccessibilityChecks();
      await this.takeScreenshot('vercel-desktop');

      // Test on mobile
      await this.createPage('iPhone 12');
      await this.navigateTo(url);
      await this.checkVisualElements();
      await this.takeScreenshot('vercel-mobile');

      // Generate report
      await this.generateReport();

      this.log('Vercel test completed successfully');
    } catch (error) {
      this.log(`Vercel test failed: ${error}`);
      throw error;
    } finally {
      await this.close();
    }
  }
}

async function connectBrowserToMCP() {
  const mcpTool = new MCPBrowserTool();

  try {
    // Check if a URL was provided as a command line argument
    const url = process.argv[2];

    if (url) {
      console.log(`\n🔍 Testing deployment at: ${url}`);
      await mcpTool.runVercelTest(url);
    } else {
      console.log('\n🔍 Testing local development server');
      await mcpTool.runLocalTest();
    }

    console.log('\n✅ MCP Browser Tool test completed successfully');
    console.log(`📊 Reports saved to: ${config.reportsDir}`);
    console.log(`📸 Screenshots saved to: ${config.screenshotsDir}\n`);
  } catch (error) {
    console.error(`\n❌ MCP Browser Tool test failed: ${error}`);
    process.exit(1);
  }
}

connectBrowserToMCP().catch(console.error);