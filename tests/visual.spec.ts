import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('check for visual consistency across pages', async ({ page }) => {
    // Define the pages to check
    const pagesToCheck = [
      { url: '/', name: 'homepage' },
      { url: '/posts', name: 'posts-listing' },
      { url: '/projects', name: 'projects-listing' },
      { url: '/search', name: 'search' },
      { url: '/categories', name: 'categories' }
    ];
    
    // Visit each page and take screenshots of key elements
    for (const pageInfo of pagesToCheck) {
      await page.goto(`http://localhost:3000${pageInfo.url}`);
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot of the full page
      await page.screenshot({ 
        path: `test-results/visual/${pageInfo.name}-full.png`, 
        fullPage: true 
      });
      
      // Take a screenshot of the header
      const header = page.locator('header');
      await header.screenshot({ 
        path: `test-results/visual/${pageInfo.name}-header.png`
      });
      
      // Take a screenshot of the main content area
      const main = page.locator('main, div.container, div.max-w-4xl').first();
      await main.screenshot({ 
        path: `test-results/visual/${pageInfo.name}-main.png`
      });
      
      // Take a screenshot of the footer if it exists
      const footer = page.locator('footer');
      if (await footer.count() > 0) {
        await footer.scrollIntoViewIfNeeded();
        await footer.screenshot({ 
          path: `test-results/visual/${pageInfo.name}-footer.png`
        });
      }
    }
  });
  
  test('check for consistent typography', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshots of different typography elements
    
    // Headings
    const h1 = page.getByRole('heading', { level: 1 }).first();
    if (await h1.count() > 0) {
      await h1.screenshot({ path: 'test-results/visual/typography-h1.png' });
    }
    
    const h2 = page.getByRole('heading', { level: 2 }).first();
    if (await h2.count() > 0) {
      await h2.screenshot({ path: 'test-results/visual/typography-h2.png' });
    }
    
    const h3 = page.getByRole('heading', { level: 3 }).first();
    if (await h3.count() > 0) {
      await h3.screenshot({ path: 'test-results/visual/typography-h3.png' });
    }
    
    // Paragraph text
    const paragraph = page.locator('p').first();
    if (await paragraph.count() > 0) {
      await paragraph.screenshot({ path: 'test-results/visual/typography-paragraph.png' });
    }
    
    // Links
    const link = page.getByRole('link').first();
    if (await link.count() > 0) {
      await link.screenshot({ path: 'test-results/visual/typography-link.png' });
    }
    
    // Now visit a post detail page to check content typography
    await page.goto('http://localhost:3000/posts');
    await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().click();
    
    // Take screenshots of the post content typography
    const postTitle = page.getByRole('heading').first();
    await postTitle.screenshot({ path: 'test-results/visual/typography-post-title.png' });
    
    const postContent = page.locator('.prose');
    await postContent.screenshot({ path: 'test-results/visual/typography-post-content.png' });
  });
  
  test('check for consistent colors and styling', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshots of elements with different colors/styles
    
    // Header background
    const header = page.locator('header');
    await header.screenshot({ path: 'test-results/visual/color-header-bg.png' });
    
    // Primary buttons
    const primaryButton = page.getByRole('link', { name: 'View All Posts →' });
    if (await primaryButton.count() > 0) {
      await primaryButton.screenshot({ path: 'test-results/visual/color-primary-button.png' });
    }
    
    // Cards/boxes
    await page.goto('http://localhost:3000/posts');
    const card = page.locator('.bg-white.shadow-md').first();
    if (await card.count() > 0) {
      await card.screenshot({ path: 'test-results/visual/color-card.png' });
    }
    
    // Tags/badges
    await page.goto('http://localhost:3000/projects');
    const tag = page.locator('.bg-blue-100').first();
    if (await tag.count() > 0) {
      await tag.screenshot({ path: 'test-results/visual/color-tag.png' });
    }
    
    // Search page elements
    await page.goto('http://localhost:3000/search');
    const searchButton = page.getByRole('button', { name: 'Search' });
    if (await searchButton.count() > 0) {
      await searchButton.screenshot({ path: 'test-results/visual/color-search-button.png' });
    }
    
    const searchInput = page.getByPlaceholder('Search posts and projects...');
    if (await searchInput.count() > 0) {
      await searchInput.screenshot({ path: 'test-results/visual/color-search-input.png' });
    }
  });
  
  test('check for consistent spacing and alignment', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshots of sections to check spacing and alignment
    
    // Recent posts section
    const recentPostsSection = page.locator('section').filter({ hasText: 'Recent Posts' });
    await recentPostsSection.screenshot({ path: 'test-results/visual/spacing-recent-posts.png' });
    
    // Projects section
    const projectsSection = page.locator('section').filter({ hasText: 'Projects' });
    await projectsSection.screenshot({ path: 'test-results/visual/spacing-projects.png' });
    
    // Post cards grid
    await page.goto('http://localhost:3000/posts');
    const postsGrid = page.locator('.grid');
    await postsGrid.screenshot({ path: 'test-results/visual/spacing-posts-grid.png' });
    
    // Projects grid
    await page.goto('http://localhost:3000/projects');
    const projectsGrid = page.locator('.grid');
    await projectsGrid.screenshot({ path: 'test-results/visual/spacing-projects-grid.png' });
    
    // Post detail page spacing
    await page.goto('http://localhost:3000/posts');
    await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().click();
    const postArticle = page.locator('article');
    await postArticle.screenshot({ path: 'test-results/visual/spacing-post-article.png' });
  });
  
  test('check for visual issues on hover states', async ({ page }) => {
    // Visit the homepage
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check hover states for navigation links
    const navLink = page.getByRole('link', { name: 'Projects' });
    
    // Take screenshot before hover
    await navLink.screenshot({ path: 'test-results/visual/hover-nav-before.png' });
    
    // Hover over the link and take screenshot
    await navLink.hover();
    await page.waitForTimeout(500); // Wait for any hover animations
    await navLink.screenshot({ path: 'test-results/visual/hover-nav-after.png' });
    
    // Check hover states for buttons
    const button = page.getByRole('link', { name: 'View All Posts →' });
    
    // Take screenshot before hover
    await button.screenshot({ path: 'test-results/visual/hover-button-before.png' });
    
    // Hover over the button and take screenshot
    await button.hover();
    await page.waitForTimeout(500); // Wait for any hover animations
    await button.screenshot({ path: 'test-results/visual/hover-button-after.png' });
    
    // Check hover states for cards
    await page.goto('http://localhost:3000/posts');
    const card = page.locator('.bg-white.shadow-md').first();
    
    // Take screenshot before hover
    await card.screenshot({ path: 'test-results/visual/hover-card-before.png' });
    
    // Hover over the card and take screenshot
    await card.hover();
    await page.waitForTimeout(500); // Wait for any hover animations
    await card.screenshot({ path: 'test-results/visual/hover-card-after.png' });
  });
  
  test('check for visual consistency of interactive elements', async ({ page }) => {
    // Visit the search page to test form elements
    await page.goto('http://localhost:3000/search');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the search form
    const searchForm = page.locator('form');
    await searchForm.screenshot({ path: 'test-results/visual/interactive-search-form.png' });
    
    // Focus the input and take screenshot
    const searchInput = page.getByPlaceholder('Search posts and projects...');
    await searchInput.click();
    await searchInput.screenshot({ path: 'test-results/visual/interactive-search-input-focus.png' });
    
    // Fill the input and take screenshot
    await searchInput.fill('test');
    await searchInput.screenshot({ path: 'test-results/visual/interactive-search-input-filled.png' });
    
    // Click the button and take screenshot
    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click();
    
    // Wait for search results or no results message
    await page.waitForSelector('text=/results found for|No results found for/', { state: 'visible' });
    
    // Take screenshot of search results
    await page.screenshot({ 
      path: 'test-results/visual/interactive-search-results.png',
      fullPage: true
    });
  });
});