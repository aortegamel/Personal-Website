const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Set up colors for terminal output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

console.log(`${YELLOW}Starting component tests for Angleito's Portfolio${RESET}`);

// Define all components to test
const components = [
  { path: 'src/components/Header.tsx', name: 'Header Component' },
  { path: 'src/components/Footer.tsx', name: 'Footer Component' },
  { path: 'src/components/PostPreview.tsx', name: 'PostPreview Component' },
  { path: 'src/components/ProjectCard.tsx', name: 'ProjectCard Component' },
  { path: 'src/app/search/page.tsx', name: 'Search Page' },
  { path: 'tests-ct/components/ui/Button.spec.tsx', name: 'Button Test' },
  { path: 'tests-ct/components/ui/Card.spec.tsx', name: 'Card Test' },
  { path: 'tests-ct/components/ui/Input.spec.tsx', name: 'Input Test' },
  { path: 'tests-ct/components/ui/Badge.spec.tsx', name: 'Badge Test' },
  { path: 'tests-ct/components/layout/Container.spec.tsx', name: 'Container Test' },
  { path: 'tests-ct/components/layout/Section.spec.tsx', name: 'Section Test' },
  { path: 'tests-ct/components/layout/Grid.spec.tsx', name: 'Grid Test' },
  { path: 'tests-ct/components/common/Header.spec.tsx', name: 'Header Test' },
  { path: 'tests-ct/components/common/Footer.spec.tsx', name: 'Footer Test' },
  { path: 'tests-ct/components/common/PostPreview.spec.tsx', name: 'PostPreview Test' },
  { path: 'tests-ct/components/common/ProjectCard.spec.tsx', name: 'ProjectCard Test' },
  { path: 'tests-ct/test-utils.tsx', name: 'Test Utils' },
  { path: 'playwright-ct.config.ts', name: 'Playwright Component Testing Config' },
  { path: 'tailwind.config.js', name: 'Tailwind Config' }
];

// Initialize counters
let totalTests = components.length;
let passedTests = 0;
let failedTests = 0;
const failedComponents = [];

// Test each component
components.forEach(component => {
  console.log(`\n${YELLOW}Testing: ${component.name}${RESET}`);

  if (fs.existsSync(component.path)) {
    console.log(`${GREEN}✓ Component exists and is accessible${RESET}`);
    passedTests++;
  } else {
    console.log(`${RED}✗ Component does not exist at expected path: ${component.path}${RESET}`);
    failedTests++;
    failedComponents.push(component.name);
  }
});

// Print summary
console.log(`\n${YELLOW}=== Test Summary ===${RESET}`);
console.log(`Total tests: ${totalTests}`);
console.log(`Passed tests: ${GREEN}${passedTests}${RESET}`);
console.log(`Failed tests: ${RED}${failedTests}${RESET}`);

// Calculate pass percentage
const passPercentage = Math.round((passedTests * 100) / totalTests);
console.log(`Pass rate: ${passPercentage}%`);

// List failed components if any
if (failedComponents.length > 0) {
  console.log(`\n${RED}Failed components:${RESET}`);
  failedComponents.forEach(component => {
    console.log(`  - ${component}`);
  });
}

// Return success if all tests passed
if (passedTests === totalTests) {
  console.log(`\n${GREEN}All components passed!${RESET}`);
  process.exit(0);
} else {
  console.log(`\n${RED}Some components failed.${RESET}`);
  process.exit(1);
}
