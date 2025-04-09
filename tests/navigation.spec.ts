import { test, expect } from '@playwright/test';

test.describe('Navigation and Site-wide Tests', () => {
  test('header navigation links work correctly', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check that all navigation links are visible
    const navLinks = [
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Projects', url: '/projects' },
      { text: 'Articles', url: '/posts' },
      { text: 'Categories', url: '/categories' },
      { text: 'Search', url: '/search' }
    ];
    
    // Take a screenshot of the header
    const header = page.locator('header');
    await header.screenshot({ path: 'test-results/header.png' });
    
    // Test each navigation link
    for (const link of navLinks) {
      // Find the link
      const navLink = page.getByRole('link', { name: link.text }).first();
      await expect(navLink).toBeVisible();
      
      // Click the link
      await navLink.click();
      
      // Check that we navigated to the correct URL
      await expect(page).toHaveURL(new RegExp(link.url));
      
      // Take a screenshot of the page
      await page.screenshot({ path: `test-results/navigation-to-${link.text.toLowerCase()}.png`, fullPage: true });
    }
  });
  
  test('footer links and content are correct', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Scroll to the footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    
    // Take a screenshot of the footer
    await footer.screenshot({ path: 'test-results/footer.png' });
    
    // Check footer content is visible
    await expect(footer).toBeVisible();
    
    // Check for copyright text
    const copyrightText = footer.getByText(/©|Copyright/);
    await expect(copyrightText).toBeVisible();
    
    // Check for any social media links if they exist
    const socialLinks = footer.locator('a[href^="https://"]');
    const socialLinksCount = await socialLinks.count();
    
    if (socialLinksCount > 0) {
      // Take a screenshot of the social links
      await socialLinks.first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'test-results/footer-social-links.png' });
      
      // Check that each social link has the correct attributes
      for (let i = 0; i < socialLinksCount; i++) {
        const link = socialLinks.nth(i);
        expect(await link.getAttribute('target')).toBe('_blank');
        expect(await link.getAttribute('rel')).toContain('noopener');
      }
    }
  });
  
  test('navigation between related content works', async ({ page }) => {
    // Test navigation from homepage to posts page
    await page.goto('http://localhost:3000');
    await page.getByRole('link', { name: 'View All Posts →' }).click();
    await expect(page).toHaveURL('http://localhost:3000/posts');
    await page.screenshot({ path: 'test-results/navigation-home-to-posts.png', fullPage: true });
    
    // Test navigation from homepage to projects page
    await page.goto('http://localhost:3000');
    await page.getByRole('link', { name: 'View All Projects →' }).click();
    await expect(page).toHaveURL('http://localhost:3000/projects');
    await page.screenshot({ path: 'test-results/navigation-home-to-projects.png', fullPage: true });
    
    // Test navigation from posts listing to post detail
    await page.goto('http://localhost:3000/posts');
    const firstPostTitle = await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().textContent();
    await page.getByRole('heading').filter({ hasText: /^(?!Blog Posts)/ }).first().click();
    await expect(page).toHaveURL(/\/posts\/[\w-]+/);
    
    // Check that the post title matches
    if (firstPostTitle) {
      const detailTitle = await page.getByRole('heading').first().textContent();
      expect(detailTitle).toBe(firstPostTitle);
    }
    await page.screenshot({ path: 'test-results/navigation-posts-to-detail.png', fullPage: true });
    
    // Test navigation from projects listing to project detail
    await page.goto('http://localhost:3000/projects');
    const firstProjectTitle = await page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first().textContent();
    await page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first().click();
    await expect(page).toHaveURL(/\/projects\/[\w-]+/);
    
    // Check that the project title matches
    if (firstProjectTitle) {
      const detailTitle = await page.getByRole('heading').first().textContent();
      expect(detailTitle).toBe(firstProjectTitle);
    }
    await page.screenshot({ path: 'test-results/navigation-projects-to-detail.png', fullPage: true });
  });
  
  test('404 page works correctly', async ({ page }) => {
    // Navigate to a non-existent page
    await page.goto('http://localhost:3000/non-existent-page');
    
    // Take a screenshot of the 404 page
    await page.screenshot({ path: 'test-results/404-page.png', fullPage: true });
    
    // Check for 404 indicators in the content
    const pageContent = await page.textContent('body');
    const has404Indicator = pageContent.includes('404') || 
                            pageContent.includes('not found') || 
                            pageContent.includes('Not Found');
    
    expect(has404Indicator).toBeTruthy();
    
    // Check if there's a link back to home
    const homeLink = page.getByRole('link', { name: /home|back|return/i });
    if (await homeLink.count() > 0) {
      await homeLink.click();
      await expect(page).toHaveURL('http://localhost:3000/');
      await page.screenshot({ path: 'test-results/404-to-home.png', fullPage: true });
    }
  });
  
  test('header is responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot of the header
      const header = page.locator('header');
      await header.screenshot({ path: `test-results/header-${viewport.name}.png` });
      
      // Check that the site title is visible
      const siteTitle = header.getByText("Angleito's Portfolio");
      await expect(siteTitle).toBeVisible();
      
      // For mobile, check if there's a hamburger menu or if navigation is still visible
      if (viewport.width <= 375) {
        // If there's a hamburger menu, click it to expand the navigation
        const hamburgerMenu = page.locator('button[aria-label="Menu"]');
        if (await hamburgerMenu.count() > 0) {
          await hamburgerMenu.click();
          await page.waitForTimeout(500); // Wait for animation
          await page.screenshot({ path: `test-results/header-${viewport.name}-expanded.png` });
        }
      }
      
      // Check that at least some navigation links are visible
      const navLinks = page.locator('header').getByRole('link');
      const visibleLinks = await navLinks.count();
      expect(visibleLinks).toBeGreaterThan(0);
    }
  });
  
  test('footer is responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Scroll to the footer
      const footer = page.locator('footer');
      await footer.scrollIntoViewIfNeeded();
      
      // Take a screenshot of the footer
      await footer.screenshot({ path: `test-results/footer-${viewport.name}.png` });
      
      // Check that the footer content is visible
      await expect(footer).toBeVisible();
    }
  });
});