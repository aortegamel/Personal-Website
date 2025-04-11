# MCP Browser Tool

This tool provides Model Context Protocol (MCP) capabilities for browser testing and debugging. It allows AI assistants to autonomously interact with web browsers in a headless mode to test and debug web applications.

## Features

- **Headless Browser Testing**: Run tests in a headless Chrome browser without a visible UI
- **Multi-Device Testing**: Test on both desktop and mobile device emulations
- **Accessibility Checks**: Automatically check for common accessibility issues
- **Visual Element Verification**: Verify the presence of key page elements
- **Screenshot Capture**: Take screenshots for visual verification
- **Comprehensive Reporting**: Generate detailed reports of test results
- **Error Detection**: Automatically detect and log console errors, network issues, and more
- **Local and Remote Testing**: Test both local development server and deployed applications

## Usage

### Testing Local Development Server

```bash
npm run connect-browser-mcp
```

This will:
1. Start a local development server on an available port
2. Run tests on both desktop and mobile emulations
3. Generate screenshots and reports
4. Automatically clean up resources when done

### Testing Deployed Application

```bash
npm run connect-browser-mcp https://your-deployed-app.vercel.app
```

This will:
1. Run tests against the specified URL
2. Test on both desktop and mobile emulations
3. Generate screenshots and reports
4. Automatically clean up resources when done

## Output

The tool generates several types of output:

- **Screenshots**: Saved in the `mcp-screenshots` directory
- **Logs**: Saved in the `browser-logs` directory
- **Reports**: Saved in the `mcp-reports` directory as JSON files

## How It Works

The MCP Browser Tool uses Playwright to control a headless Chrome browser. It provides a high-level API for common browser interactions and testing tasks. The tool is designed to be used by AI assistants to autonomously test and debug web applications.

### Key Components

1. **MCPBrowserTool Class**: The main class that provides methods for browser interaction
2. **Device Emulation**: Tests on both desktop and mobile device emulations
3. **Accessibility Checks**: Checks for common accessibility issues like missing alt text
4. **Visual Element Verification**: Verifies the presence of key page elements like header, footer, etc.
5. **Error Detection**: Automatically detects and logs console errors, network issues, etc.
6. **Reporting**: Generates comprehensive reports of test results

## Extending the Tool

You can extend the tool by adding new methods to the `MCPBrowserTool` class. For example, you could add methods for:

- Form submission testing
- Performance testing
- SEO checks
- And more!

## Troubleshooting

If you encounter issues with the tool, check the logs in the `browser-logs` directory for details. Common issues include:

- **Port conflicts**: The tool will automatically find an available port, but if all ports are in use, it may fail
- **Timeout errors**: If the page takes too long to load, the tool may time out
- **Missing dependencies**: Make sure you have installed all required dependencies

## Dependencies

- Playwright
- Node.js (v14 or higher recommended)
