import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('measure page load times', async ({ page }) => {
    // Define the pages to test
    const pagesToTest = [
      { url: '/', name: 'homepage' },
      { url: '/posts', name: 'posts-listing' },
      { url: '/projects', name: 'projects-listing' },
      { url: '/search', name: 'search' },
      { url: '/categories', name: 'categories' }
    ];
    
    // Test each page
    for (const pageInfo of pagesToTest) {
      // Start measuring time
      const startTime = Date.now();
      
      // Navigate to the page
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      
      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Calculate load time
      const loadTime = Date.now() - startTime;
      
      // Log the load time
      console.log(`${pageInfo.name} load time: ${loadTime}ms`);
      
      // Take a screenshot for reference
      await page.screenshot({ 
        path: `test-results/performance/${pageInfo.name}-loaded.png`, 
        fullPage: true 
      });
      
      // Assert that the load time is reasonable (adjust thresholds as needed)
      expect(loadTime).toBeLessThan(5000); // 5 seconds is a reasonable threshold
    }
  });
  
  test('measure time to first contentful paint', async ({ page }) => {
    // Enable performance metrics
    await page.evaluate(() => {
      window.performance.mark('test-start');
    });
    
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Wait for the first heading to be visible (as a proxy for first contentful paint)
    await page.waitForSelector('h1');
    
    // Mark the end time and calculate duration
    const fcpTime = await page.evaluate(() => {
      window.performance.mark('test-end');
      const measurement = window.performance.measure('test-duration', 'test-start', 'test-end');
      return measurement.duration;
    });
    
    // Log the FCP time
    console.log(`First contentful paint time: ${fcpTime}ms`);
    
    // Assert that the FCP time is reasonable
    expect(fcpTime).toBeLessThan(3000); // 3 seconds is a reasonable threshold
  });
  
  test('measure time to interactive', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Start measuring time
    const startTime = Date.now();
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Wait for interactive elements to be available
    await page.waitForSelector('a[href="/posts"]');
    
    // Calculate time to interactive
    const timeToInteractive = Date.now() - startTime;
    
    // Log the time to interactive
    console.log(`Time to interactive: ${timeToInteractive}ms`);
    
    // Assert that the time to interactive is reasonable
    expect(timeToInteractive).toBeLessThan(4000); // 4 seconds is a reasonable threshold
  });
  
  test('measure search response time', async ({ page }) => {
    // Navigate to the search page
    await page.goto('http://localhost:3000/search');
    
    // Enter a search query
    await page.getByPlaceholder('Search posts and projects...').fill('the');
    
    // Start measuring time
    const startTime = Date.now();
    
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Wait for search results to appear
    await page.waitForSelector('text=/results found for|No results found for/', { state: 'visible' });
    
    // Calculate search response time
    const searchTime = Date.now() - startTime;
    
    // Log the search response time
    console.log(`Search response time: ${searchTime}ms`);
    
    // Take a screenshot for reference
    await page.screenshot({ 
      path: 'test-results/performance/search-results.png', 
      fullPage: true 
    });
    
    // Assert that the search response time is reasonable
    expect(searchTime).toBeLessThan(2000); // 2 seconds is a reasonable threshold
  });
  
  test('measure navigation response time', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000');
    
    // Define navigation actions to test
    const navigationActions = [
      { action: () => page.getByRole('link', { name: 'Projects' }).click(), name: 'home-to-projects' },
      { action: () => page.getByRole('link', { name: 'Articles' }).click(), name: 'projects-to-articles' },
      { action: () => page.getByRole('link', { name: 'Search' }).click(), name: 'articles-to-search' },
      { action: () => page.getByRole('link', { name: 'Home' }).click(), name: 'search-to-home' }
    ];
    
    // Test each navigation action
    for (const navAction of navigationActions) {
      // Start measuring time
      const startTime = Date.now();
      
      // Perform the navigation action
      await navAction.action();
      
      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Calculate navigation time
      const navigationTime = Date.now() - startTime;
      
      // Log the navigation time
      console.log(`${navAction.name} navigation time: ${navigationTime}ms`);
      
      // Take a screenshot for reference
      await page.screenshot({ 
        path: `test-results/performance/${navAction.name}.png`, 
        fullPage: true 
      });
      
      // Assert that the navigation time is reasonable
      expect(navigationTime).toBeLessThan(2000); // 2 seconds is a reasonable threshold
    }
  });
  
  test('measure post detail page load time', async ({ page }) => {
    // Navigate to the posts page
    await page.goto('http://localhost:3000/posts');
    
    // Find the first post
    const firstPost = page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first();
    
    // Start measuring time
    const startTime = Date.now();
    
    // Click on the first post
    await firstPost.click();
    
    // Wait for the post detail page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Calculate load time
    const loadTime = Date.now() - startTime;
    
    // Log the load time
    console.log(`Post detail page load time: ${loadTime}ms`);
    
    // Take a screenshot for reference
    await page.screenshot({ 
      path: 'test-results/performance/post-detail-loaded.png', 
      fullPage: true 
    });
    
    // Assert that the load time is reasonable
    expect(loadTime).toBeLessThan(3000); // 3 seconds is a reasonable threshold
  });
});
