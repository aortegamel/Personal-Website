import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  // Define viewport sizes to test
  const viewports = [
    { width: 1920, height: 1080, name: 'desktop-large' },
    { width: 1366, height: 768, name: 'desktop-small' },
    { width: 1024, height: 768, name: 'tablet-landscape' },
    { width: 768, height: 1024, name: 'tablet-portrait' },
    { width: 428, height: 926, name: 'mobile-large' },
    { width: 375, height: 667, name: 'mobile-medium' },
    { width: 320, height: 568, name: 'mobile-small' }
  ];
  
  // Pages to test
  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/posts', name: 'posts-listing' },
    { path: '/projects', name: 'projects-listing' },
    { path: '/search', name: 'search' },
    { path: '/categories', name: 'categories' }
  ];
  
  // Test each page at each viewport size
  for (const page of pages) {
    test(`${page.name} is responsive across all viewport sizes`, async ({ browser }) => {
      for (const viewport of viewports) {
        // Create a new context with the viewport size
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        });
        
        // Create a new page in the context
        const pageObj = await context.newPage();
        
        // Navigate to the page
        await pageObj.goto(`http://localhost:3000${page.path}`);
        await pageObj.waitForLoadState('networkidle');
        
        // Take a screenshot of the full page
        await pageObj.screenshot({ 
          path: `test-results/responsive/${page.name}-${viewport.name}.png`, 
          fullPage: true 
        });
        
        // Check that key elements are visible
        // Header should always be visible
        const header = pageObj.locator('header');
        await expect(header).toBeVisible();
        
        // Main content should always be visible
        const main = pageObj.locator('main, div.container, div.max-w-4xl');
        await expect(main).toBeVisible();
        
        // Close the context when done
        await context.close();
      }
    });
  }
  
  test('dynamic content pages are responsive', async ({ browser }) => {
    // First get a post and project URL
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Get a post URL
    await page.goto('http://localhost:3000/posts');
    await page.waitForLoadState('networkidle');
    const postLink = page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first();
    await postLink.click();
    const postUrl = page.url();
    
    // Get a project URL
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    const projectLink = page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first();
    await projectLink.click();
    const projectUrl = page.url();
    
    await context.close();
    
    // Now test these dynamic pages at different viewport sizes
    const dynamicPages = [
      { url: postUrl, name: 'post-detail' },
      { url: projectUrl, name: 'project-detail' }
    ];
    
    for (const dynamicPage of dynamicPages) {
      for (const viewport of viewports) {
        // Create a new context with the viewport size
        const dynamicContext = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        });
        
        // Create a new page in the context
        const dynamicPageObj = await dynamicContext.newPage();
        
        // Navigate to the page
        await dynamicPageObj.goto(dynamicPage.url);
        await dynamicPageObj.waitForLoadState('networkidle');
        
        // Take a screenshot of the full page
        await dynamicPageObj.screenshot({ 
          path: `test-results/responsive/${dynamicPage.name}-${viewport.name}.png`, 
          fullPage: true 
        });
        
        // Check that key elements are visible
        // Header should always be visible
        const header = dynamicPageObj.locator('header');
        await expect(header).toBeVisible();
        
        // Title should always be visible
        const title = dynamicPageObj.getByRole('heading').first();
        await expect(title).toBeVisible();
        
        // Content should always be visible
        const content = dynamicPageObj.locator('article, div.max-w-4xl');
        await expect(content).toBeVisible();
        
        // Close the context when done
        await dynamicContext.close();
      }
    }
  });
  
  test('interactive elements are usable at all viewport sizes', async ({ browser }) => {
    // Test the search functionality at different viewport sizes
    for (const viewport of viewports) {
      // Create a new context with the viewport size
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      
      // Create a new page in the context
      const page = await context.newPage();
      
      // Navigate to the search page
      await page.goto('http://localhost:3000/search');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot before interaction
      await page.screenshot({ 
        path: `test-results/responsive/search-before-${viewport.name}.png`, 
        fullPage: true 
      });
      
      // Interact with the search form
      await page.getByPlaceholder('Search posts and projects...').fill('test');
      await page.getByRole('button', { name: 'Search' }).click();
      
      // Wait for search results or no results message
      await page.waitForSelector('text=/results found for|No results found for/', { state: 'visible' });
      
      // Take a screenshot after interaction
      await page.screenshot({ 
        path: `test-results/responsive/search-after-${viewport.name}.png`, 
        fullPage: true 
      });
      
      // Close the context when done
      await context.close();
    }
  });
  
  test('navigation menu is usable at all viewport sizes', async ({ browser }) => {
    for (const viewport of viewports) {
      // Create a new context with the viewport size
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height }
      });
      
      // Create a new page in the context
      const page = await context.newPage();
      
      // Navigate to the homepage
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot of the header
      const header = page.locator('header');
      await header.screenshot({ 
        path: `test-results/responsive/header-${viewport.name}.png`
      });
      
      // Check if there's a hamburger menu for mobile
      const hamburgerMenu = page.locator('button[aria-label="Menu"], button.hamburger');
      if (await hamburgerMenu.count() > 0) {
        // Take a screenshot before clicking
        await page.screenshot({ 
          path: `test-results/responsive/nav-before-expand-${viewport.name}.png`,
          fullPage: false
        });
        
        // Click the hamburger menu
        await hamburgerMenu.click();
        await page.waitForTimeout(500); // Wait for animation
        
        // Take a screenshot after clicking
        await page.screenshot({ 
          path: `test-results/responsive/nav-after-expand-${viewport.name}.png`,
          fullPage: false
        });
      }
      
      // Try to click on the Projects link
      const projectsLink = page.getByRole('link', { name: 'Projects' });
      if (await projectsLink.isVisible()) {
        await projectsLink.click();
        await expect(page).toHaveURL(/\/projects/);
        
        // Take a screenshot after navigation
        await page.screenshot({ 
          path: `test-results/responsive/after-nav-click-${viewport.name}.png`,
          fullPage: true
        });
      }
      
      // Close the context when done
      await context.close();
    }
  });
});