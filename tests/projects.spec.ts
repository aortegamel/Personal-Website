import { test, expect } from '@playwright/test';

test.describe('Projects Tests', () => {
  test('projects listing page displays correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    
    // Check page title
    await expect(page).toHaveTitle(/Projects/);
    
    // Take a screenshot of the projects listing page
    await page.screenshot({ path: 'test-results/projects-listing.png', fullPage: true });
    
    // Check for heading
    const heading = page.getByRole('heading', { name: 'My Projects' });
    await expect(heading).toBeVisible();
    
    // Check that projects are displayed
    const projectCards = page.locator('.bg-white.shadow-md.rounded-lg');
    const projectCount = await projectCards.count();
    expect(projectCount).toBeGreaterThan(0);
    
    // Check that each project has a title, description, and tech stack
    for (let i = 0; i < projectCount; i++) {
      const project = projectCards.nth(i);
      await expect(project.getByRole('heading')).toBeVisible();
      await expect(project.locator('p')).toBeVisible();
      
      // Check for tech stack tags
      const techTags = project.locator('.bg-blue-100');
      const techTagCount = await techTags.count();
      expect(techTagCount).toBeGreaterThan(0);
      
      // Take a screenshot of this project card
      await project.screenshot({ path: `test-results/project-card-${i}.png` });
    }
  });
  
  test('project detail page displays correctly', async ({ page }) => {
    // First go to projects page to get a project link
    await page.goto('http://localhost:3000/projects');
    
    // Click on the first project
    const firstProjectHeading = page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first();
    const projectTitle = await firstProjectHeading.textContent();
    await firstProjectHeading.click();
    
    // Check we're on a project detail page
    await expect(page).toHaveURL(/\/projects\/[\w-]+/);
    
    // Take a screenshot of the project detail page
    await page.screenshot({ path: 'test-results/project-detail.png', fullPage: true });
    
    // Check project components
    const title = page.getByRole('heading').first();
    await expect(title).toBeVisible();
    expect(await title.textContent()).toBe(projectTitle);
    
    // Check for tech stack
    const techStackHeading = page.getByRole('heading', { name: 'Tech Stack' });
    await expect(techStackHeading).toBeVisible();
    
    // Take a screenshot of the tech stack section
    await techStackHeading.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/project-tech-stack.png' });
    
    // Check for tech stack tags
    const techTags = page.locator('.bg-gray-100.text-gray-800');
    const techTagCount = await techTags.count();
    expect(techTagCount).toBeGreaterThan(0);
    
    // Check for GitHub link if present
    const githubLink = page.getByRole('link', { name: 'GitHub Repository' });
    if (await githubLink.count() > 0) {
      await expect(githubLink).toBeVisible();
      
      // Take a screenshot of the GitHub link
      await githubLink.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'test-results/project-github-link.png' });
    }
    
    // Check for description section
    const descriptionHeading = page.getByRole('heading', { name: 'Description' });
    await expect(descriptionHeading).toBeVisible();
    
    // Take a screenshot of the description section
    await descriptionHeading.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-results/project-description.png' });
    
    // Check for content
    const content = page.locator('.prose');
    await expect(content).toBeVisible();
    
    // Check for features section if present
    const featuresHeading = page.getByRole('heading', { name: 'Features' });
    if (await featuresHeading.count() > 0) {
      await expect(featuresHeading).toBeVisible();
      
      // Check for feature list items
      const featureItems = page.locator('li.text-gray-700');
      const featureCount = await featureItems.count();
      expect(featureCount).toBeGreaterThan(0);
      
      // Take a screenshot of the features section
      await featuresHeading.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'test-results/project-features.png' });
    }
    
    // Check for contact section if present
    const contactHeading = page.getByRole('heading', { name: 'Contact' });
    if (await contactHeading.count() > 0) {
      await expect(contactHeading).toBeVisible();
      
      // Take a screenshot of the contact section
      await contactHeading.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'test-results/project-contact.png' });
    }
  });
  
  test('GitHub links on project detail page work correctly', async ({ page }) => {
    // First go to projects page to get a project link
    await page.goto('http://localhost:3000/projects');
    
    // Click on the first project
    await page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first().click();
    
    // Check for GitHub link
    const githubLink = page.getByRole('link', { name: 'GitHub Repository' });
    
    if (await githubLink.count() > 0) {
      // Get the href attribute of the GitHub link
      const href = await githubLink.getAttribute('href');
      
      // Verify the href is a valid GitHub URL
      expect(href).toBeTruthy();
      if (href) {
        expect(href.startsWith('https://github.com/')).toBeTruthy();
      }
      
      // We won't actually click the link as it would navigate away from our site
      // Instead, we'll just verify it has the correct attributes
      expect(await githubLink.getAttribute('target')).toBe('_blank');
      expect(await githubLink.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });
  
  test('projects pages are responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];
    
    // Test projects listing page
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3000/projects');
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot for this viewport size
      await page.screenshot({ path: `test-results/projects-listing-${viewport.name}.png`, fullPage: true });
    }
    
    // Test project detail page
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Go to projects page and click on first project
      await page.goto('http://localhost:3000/projects');
      await page.getByRole('heading').filter({ hasText: /^(?!My Projects)/ }).first().click();
      await page.waitForLoadState('networkidle');
      
      // Take a screenshot for this viewport size
      await page.screenshot({ path: `test-results/project-detail-${viewport.name}.png`, fullPage: true });
    }
  });
});