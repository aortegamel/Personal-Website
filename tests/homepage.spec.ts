import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('homepage has correct title and structure', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check page title
    await expect(page).toHaveTitle(/Angleito's Portfolio/);
    
    // Take a screenshot of the entire homepage
    await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });
    
    // Check for main sections
    const welcomeSection = page.getByRole('heading', { name: 'Welcome to My Portfolio' });
    const recentPostsSection = page.getByRole('heading', { name: 'Recent Posts' });
    const projectsSection = page.getByRole('heading', { name: 'Projects' });
    
    await expect(welcomeSection).toBeVisible();
    await expect(recentPostsSection).toBeVisible();
    await expect(projectsSection).toBeVisible();
    
    // Take screenshots of specific sections
    await welcomeSection.screenshot({ path: 'test-results/homepage-welcome-section.png' });
    await page.getByText('Recent Posts').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/homepage-recent-posts-section.png' });
    await page.getByText('Projects').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/homepage-projects-section.png' });
  });
  
  test('homepage has correct number of recent posts', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for recent posts
    const postLinks = page.getByRole('link', { name: /Read More/ });
    const postCount = await postLinks.count();
    expect(postCount).toBeGreaterThan(0);
    expect(postCount).toBeLessThanOrEqual(3);
    
    // Take a screenshot of the posts section
    await page.getByRole('heading', { name: 'Recent Posts' }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/homepage-posts.png' });
  });
  
  test('homepage has projects displayed', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for project links
    const projectLinks = page.getByRole('link', { name: /View Project/ });
    const projectCount = await projectLinks.count();
    expect(projectCount).toBeGreaterThan(0);
    
    // Take a screenshot of the projects section
    await page.getByRole('heading', { name: 'Projects' }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/homepage-projects.png' });
  });
  
  test('navigation links work correctly from homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check navigation links
    const navLinks = [
      { text: 'Home', url: '/' },
      { text: 'About', url: '/about' },
      { text: 'Projects', url: '/projects' },
      { text: 'Articles', url: '/posts' },
      { text: 'Categories', url: '/categories' },
      { text: 'Search', url: '/search' }
    ];
    
    for (const link of navLinks) {
      await page.getByRole('link', { name: link.text }).first().click();
      await expect(page).toHaveURL(new RegExp(link.url));
      await page.screenshot({ path: `test-results/navigation-${link.text.toLowerCase()}.png` });
      if (link.text !== 'Home') {
        await page.getByRole('link', { name: 'Home' }).click();
        await expect(page).toHaveURL('http://localhost:3000/');
      }
    }
  });
  
  test('homepage is responsive', async ({ page }) => {
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
      
      // Take a screenshot for this viewport size
      await page.screenshot({ path: `test-results/homepage-${viewport.name}.png`, fullPage: true });
      
      // Check that key elements are visible
      await expect(page.getByRole('heading', { name: 'Welcome to My Portfolio' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Recent Posts' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    }
  });
});