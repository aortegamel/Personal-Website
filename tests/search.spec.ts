import { test, expect } from '@playwright/test';

test.describe('Search Functionality Tests', () => {
  test('search page loads correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Check page title
    await expect(page).toHaveTitle(/Search/);
    
    // Take a screenshot of the search page
    await page.screenshot({ path: 'test-results/search-page.png', fullPage: true });
    
    // Check for heading
    const heading = page.getByRole('heading', { name: 'Search' });
    await expect(heading).toBeVisible();
    
    // Check for search input and button
    const searchInput = page.getByPlaceholder('Search posts and projects...');
    await expect(searchInput).toBeVisible();
    
    const searchButton = page.getByRole('button', { name: 'Search' });
    await expect(searchButton).toBeVisible();
    
    // Take a screenshot of the search form
    await page.screenshot({ path: 'test-results/search-form.png' });
  });
  
  test('search with no query shows empty state', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Click search without entering a query
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Check that no results are shown
    const results = page.locator('.space-y-6');
    await expect(results).not.toBeVisible();
    
    // Take a screenshot of the empty state
    await page.screenshot({ path: 'test-results/search-empty.png', fullPage: true });
  });
  
  test('search with query that has results', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Enter a search query that should have results (using a common term)
    await page.getByPlaceholder('Search posts and projects...').fill('the');
    
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for search results to load
    await page.waitForSelector('text="results found for"', { state: 'visible' });
    
    // Take a screenshot of the search results
    await page.screenshot({ path: 'test-results/search-results.png', fullPage: true });
    
    // Check that results are displayed
    const resultsText = page.locator('text=/results found for/');
    await expect(resultsText).toBeVisible();
    
    // Check that result items are displayed
    const resultItems = page.locator('.border-b.border-gray-200');
    const resultCount = await resultItems.count();
    expect(resultCount).toBeGreaterThan(0);
    
    // Take a screenshot of the first result
    await resultItems.first().screenshot({ path: 'test-results/search-first-result.png' });
  });
  
  test('search with query that has no results', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Enter a search query that should not have results
    await page.getByPlaceholder('Search posts and projects...').fill('xyznonexistentterm123');
    
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for no results message
    await page.waitForSelector('text="No results found for"', { state: 'visible' });
    
    // Take a screenshot of the no results state
    await page.screenshot({ path: 'test-results/search-no-results.png', fullPage: true });
    
    // Check that no results message is displayed
    const noResultsText = page.locator('text=/No results found for/');
    await expect(noResultsText).toBeVisible();
  });
  
  test('search results link to correct pages', async ({ page }) => {
    await page.goto('http://localhost:3000/search');
    
    // Enter a search query that should have results
    await page.getByPlaceholder('Search posts and projects...').fill('the');
    
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for search results to load
    await page.waitForSelector('text="results found for"', { state: 'visible' });
    
    // Get the first result title
    const firstResultTitle = page.locator('.text-xl.font-bold a').first();
    const titleText = await firstResultTitle.textContent();
    
    // Click on the first result
    await firstResultTitle.click();
    
    // Check that we navigated to the correct page
    await expect(page).toHaveURL(/\/(posts|projects)\/[\w-]+/);
    
    // Take a screenshot of the destination page
    await page.screenshot({ path: 'test-results/search-result-destination.png', fullPage: true });
    
    // Check that the page title contains the result title
    if (titleText) {
      const heading = page.getByRole('heading').first();
      const headingText = await heading.textContent();
      expect(headingText).toBe(titleText);
    }
  });
  
  test('search with URL parameter works', async ({ page }) => {
    // Go to search page with a query parameter
    await page.goto('http://localhost:3000/search?q=test');
    
    // Check that the search input has the query value
    const searchInput = page.getByPlaceholder('Search posts and projects...');
    await expect(searchInput).toHaveValue('test');
    
    // Check that search results are displayed automatically
    await page.waitForSelector('text=/results found for|No results found for/', { state: 'visible' });
    
    // Take a screenshot of the search results from URL parameter
    await page.screenshot({ path: 'test-results/search-from-url-param.png', fullPage: true });
  });
  
  test('search page is responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Load search page
      await page.goto('http://localhost:3000/search');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot of the empty search page
      await page.screenshot({ path: `test-results/search-page-${viewport.name}.png`, fullPage: true });
      
      // Perform a search
      await page.getByPlaceholder('Search posts and projects...').fill('the');
      await page.getByRole('button', { name: 'Search' }).click();
      
      // Wait for search results
      await page.waitForSelector('text=/results found for|No results found for/', { state: 'visible' });
      
      // Take a screenshot of the search results
      await page.screenshot({ path: `test-results/search-results-${viewport.name}.png`, fullPage: true });
    }
  });
});