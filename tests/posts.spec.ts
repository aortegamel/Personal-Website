import { test, expect } from '@playwright/test';

test.describe('Blog Posts Tests', () => {
  test('posts listing page displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/posts');
    
    // Check page title
    await expect(page).toHaveTitle(/Blog Posts/);
    
    // Take a screenshot of the posts listing page
    await page.screenshot({ path: 'test-results/posts-listing.png', fullPage: true });
    
    // Check for heading
    const heading = page.getByRole('heading', { name: 'Blog Posts' });
    await expect(heading).toBeVisible();
    
    // Check that posts are displayed
    const postLinks = page.getByRole('link').filter({ hasText: 'Read More' });
    const postCount = await postLinks.count();
    expect(postCount).toBeGreaterThan(0);
    
    // Check that each post has a title, date, and category
    const posts = page.locator('.bg-white.shadow-md.rounded-lg');
    const count = await posts.count();
    
    for (let i = 0; i < count; i++) {
      const post = posts.nth(i);
      await expect(post.getByRole('heading')).toBeVisible();
      await expect(post.locator('.text-gray-500')).toBeVisible();
      
      // Take a screenshot of this post card
      await post.screenshot({ path: `test-results/post-card-${i}.png` });
    }
  });
  
  test('post detail page displays correctly', async ({ page }) => {
    // First go to posts page to get a post link
    await page.goto('http://localhost:3000/posts');
    
    // Click on the first post
    const firstPostHeading = page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first();
    const postTitle = await firstPostHeading.textContent();
    await firstPostHeading.click();
    
    // Check we're on a post detail page
    await expect(page).toHaveURL(/\/posts\/[\w-]+/);
    
    // Take a screenshot of the post detail page
    await page.screenshot({ path: 'test-results/post-detail.png', fullPage: true });
    
    // Check post components
    const title = page.getByRole('heading').first();
    await expect(title).toBeVisible();
    
    // Check for date and categories
    const metadata = page.locator('.text-gray-500');
    await expect(metadata).toBeVisible();
    
    // Check for content
    const content = page.locator('.prose');
    await expect(content).toBeVisible();
    
    // Check for PDF download link
    const pdfLink = page.getByRole('link', { name: 'Download as PDF' });
    await expect(pdfLink).toBeVisible();
    
    // Take a screenshot of the PDF download section
    await pdfLink.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/post-pdf-download.png' });
    
    // Check for navigation between posts
    const navLinks = page.locator('.flex.justify-between a');
    const navLinksCount = await navLinks.count();
    
    if (navLinksCount > 0) {
      // Take a screenshot of the post navigation
      await navLinks.first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'test-results/post-navigation.png' });
      
      // Click on a navigation link if available
      await navLinks.first().click();
      
      // Verify we navigated to another post
      await expect(page).toHaveURL(/\/posts\/[\w-]+/);
      const newTitle = page.getByRole('heading').first();
      await expect(newTitle).toBeVisible();
      const newTitleText = await newTitle.textContent();
      expect(newTitleText).not.toBe(postTitle);
      
      // Take a screenshot of the new post
      await page.screenshot({ path: 'test-results/post-navigation-result.png', fullPage: true });
    }
  });
  
  test('category links on post detail page work correctly', async ({ page }) => {
    // First go to posts page to get a post link
    await page.goto('http://localhost:3000/posts');
    
    // Click on the first post
    await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().click();
    
    // Check for category links
    const categoryLinks = page.getByRole('link').filter({ hasText: /^(?!Home|About|Projects|Articles|Categories|Search|Download as PDF|Read more)/ });
    const categoryCount = await categoryLinks.count();
    
    if (categoryCount > 0) {
      // Get the text of the first category
      const categoryText = await categoryLinks.first().textContent();
      
      // Click on the first category
      await categoryLinks.first().click();
      
      // Verify we navigated to the category page
      await expect(page).toHaveURL(/\/categories\/[\w-]+/);
      
      // Take a screenshot of the category page
      await page.screenshot({ path: 'test-results/category-page.png', fullPage: true });
      
      // Check that the category name is displayed on the page
      if (categoryText) {
        const normalizedCategoryText = categoryText.trim().toLowerCase();
        const pageContent = await page.textContent('body');
        expect(pageContent.toLowerCase()).toContain(normalizedCategoryText);
      }
    }
  });
  
  test('posts pages are responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    // Test posts listing page
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000/posts');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot for this viewport size
      await page.screenshot({ path: `test-results/posts-listing-${viewport.name}.png`, fullPage: true });
    }
    
    // Test post detail page
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Go to posts page and click on first post
      await page.goto('http://localhost:3000/posts');
      await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().click();
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot for this viewport size
      await page.screenshot({ path: `test-results/post-detail-${viewport.name}.png`, fullPage: true });
    }
  });
});