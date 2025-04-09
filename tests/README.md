# Playwright Visual Testing Suite for Next.js Portfolio

This directory contains a comprehensive set of Playwright tests for visually debugging and testing the Next.js portfolio site that was migrated from Jekyll.

## Test Files Overview

### 1. Homepage Tests (`homepage.spec.ts`)
- Tests the homepage structure and content
- Verifies recent posts and projects sections
- Tests navigation links from the homepage
- Checks responsive design at different viewport sizes

### 2. Posts Tests (`posts.spec.ts`)
- Tests the blog posts listing page
- Tests individual post detail pages
- Verifies category links and navigation
- Checks responsive design for post pages

### 3. Projects Tests (`projects.spec.ts`)
- Tests the projects listing page
- Tests individual project detail pages
- Verifies GitHub links and project features
- Checks responsive design for project pages

### 4. Search Tests (`search.spec.ts`)
- Tests the search functionality
- Verifies search results display correctly
- Tests search with various queries
- Checks responsive design for the search page

### 5. Navigation Tests (`navigation.spec.ts`)
- Tests site-wide navigation
- Verifies header and footer functionality
- Tests navigation between related content
- Checks 404 page behavior

### 6. Responsive Design Tests (`responsive.spec.ts`)
- Tests all pages across multiple viewport sizes
- Verifies dynamic content pages are responsive
- Tests interactive elements at all viewport sizes
- Verifies navigation menu responsiveness

### 7. Visual Regression Tests (`visual.spec.ts`)
- Checks for visual consistency across pages
- Verifies typography consistency
- Tests colors and styling
- Checks spacing and alignment
- Tests hover states and interactive elements

### 8. Performance Tests (`performance.spec.ts`)
- Measures page load times
- Tests time to first contentful paint
- Measures time to interactive
- Tests search response time
- Measures navigation response time

## Running the Tests

To run all tests:

```bash
npx playwright test
```

To run a specific test file:

```bash
npx playwright test tests/homepage.spec.ts
```

To run tests in headed mode (to see the browser):

```bash
npx playwright test --headed
```

## Test Results

Test results and screenshots are saved in the `test-results` directory. The screenshots document:

1. Overall page layout
2. Interactive elements
3. Responsive behavior
4. Any visual issues or inconsistencies

## Visual Testing Approach

The tests use a combination of techniques for visual debugging:

1. **Screenshot Capture**: Taking screenshots of full pages and specific elements
2. **Responsive Testing**: Testing at multiple viewport sizes (desktop, tablet, mobile)
3. **Interactive Element Testing**: Testing hover states, clicks, and form interactions
4. **Performance Measurement**: Measuring load times and responsiveness
5. **Visual Consistency Checks**: Verifying consistent styling across pages

## Findings and Recommendations

After running the tests, review the screenshots and test results to identify:

1. Visual bugs or inconsistencies
2. Performance issues
3. Responsive design problems
4. User experience improvements

Document any issues found and prioritize them for fixing based on severity and impact on user experience.