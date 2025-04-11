# Comprehensive Testing Framework

This project uses a strict, comprehensive testing framework to ensure production readiness. The testing framework runs automatically as a pre-commit hook to prevent committing code with issues.

## Key Features

- **Headless Browser Testing**: Uses Playwright to test the application in a headless Chrome browser
- **Strict Mode**: All tests must pass before code can be committed
- **Comprehensive Checks**:
  - Visual element presence (header, footer, navigation, main content)
  - Console errors and warnings
  - Network issues
  - Accessibility issues
  - Performance metrics
  - React hydration errors
  - Broken images
- **Detailed Reports**: Generates JSON reports and screenshots for each test run

## How It Works

1. When you attempt to commit code, the pre-commit hook runs automatically
2. The hook starts a development server
3. The testing framework runs tests against all key pages
4. If any issues are found, the commit is blocked
5. Detailed reports are saved to the `test-results` directory

## Running Tests Manually

You can run the tests manually with:

```bash
npm run test:headless
```

## Test Results

Test results are saved to the `test-results` directory and include:
- Screenshots of each page
- JSON reports with detailed information about any issues
- A summary report of all tests

## Strict Mode

This testing framework operates in strict mode, which means:
- **ALL** issues must be fixed before committing
- This includes warnings, accessibility issues, and performance issues
- The goal is to ensure production-ready code at all times

## Modifying Tests

The testing framework is configured in:
- `scripts/vercel-monitor.js` - The main testing script
- `.husky/pre-commit` - The pre-commit hook

## Adding New Tests

To add a new test, modify the `tests` array in the `runAllTests` function in `scripts/vercel-monitor.js`:

```javascript
const tests = [
  { name: 'homepage', url: 'http://localhost:3000' },
  { name: 'about-page', url: 'http://localhost:3000/about' },
  // Add your new test here
  { name: 'new-feature', url: 'http://localhost:3000/new-feature' },
];
```

## Troubleshooting

If your commit is blocked due to test failures:

1. Check the console output for details about the issues
2. Review the JSON reports in the `test-results` directory
3. Fix all reported issues
4. Try committing again

Remember: The strict testing framework is designed to maintain high code quality and ensure a smooth user experience.
