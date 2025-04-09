import { test, expect } from '@playwright/test';
import Header from '../../../src/components/Header';
import { renderWithProviders } from '../../test-utils';

// Mock next/link and next/navigation
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

test.describe('Header Component', () => {
  test('renders header with logo and navigation', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // Check logo
    const logo = component.locator('h1');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText("Angleito's Portfolio");
    
    // Check navigation links
    const navLinks = component.locator('nav a');
    await expect(navLinks).toHaveCount(6);
    
    // Check specific links
    await expect(navLinks.nth(0)).toHaveText('Home');
    await expect(navLinks.nth(0)).toHaveAttribute('href', '/');
    
    await expect(navLinks.nth(1)).toHaveText('About');
    await expect(navLinks.nth(1)).toHaveAttribute('href', '/about');
    
    await expect(navLinks.nth(2)).toHaveText('Projects');
    await expect(navLinks.nth(2)).toHaveAttribute('href', '/projects');
    
    await expect(navLinks.nth(3)).toHaveText('Articles');
    await expect(navLinks.nth(3)).toHaveAttribute('href', '/posts');
    
    await expect(navLinks.nth(4)).toHaveText('Categories');
    await expect(navLinks.nth(4)).toHaveAttribute('href', '/categories');
    
    await expect(navLinks.nth(5)).toHaveText('Search');
    await expect(navLinks.nth(5)).toHaveAttribute('href', '/search');
  });

  test('hamburger menu button is visible on mobile', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // Check hamburger menu button
    const menuButton = component.locator('button[aria-label="Menu"]');
    await expect(menuButton).toBeVisible();
    
    // Check that it has the md:hidden class for responsive behavior
    await expect(menuButton).toHaveClass(/md:hidden/);
  });

  test('mobile menu is hidden by default', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // Check that the nav element has the hidden class
    const nav = component.locator('nav');
    await expect(nav).toHaveClass(/hidden/);
    await expect(nav).toHaveClass(/md:block/); // But visible on desktop
  });

  test('clicking hamburger menu toggles mobile menu', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // Check initial state
    const nav = component.locator('nav');
    await expect(nav).toHaveClass(/hidden/);
    
    // Click hamburger menu
    const menuButton = component.locator('button[aria-label="Menu"]');
    await menuButton.click();
    
    // Check that menu is now visible
    await expect(nav).not.toHaveClass(/hidden/);
    await expect(nav).toHaveClass(/block/);
    
    // Click again to hide
    await menuButton.click();
    
    // Check that menu is hidden again
    await expect(nav).toHaveClass(/hidden/);
    await expect(nav).not.toHaveClass(/block/);
  });

  test('active link has the correct style', async ({ mount }) => {
    // Mock usePathname to return '/about'
    jest.mock('next/navigation', () => ({
      usePathname: () => '/about',
    }));
    
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // The About link should have the active class
    const aboutLink = component.locator('a').filter({ hasText: 'About' });
    await expect(aboutLink).toHaveClass(/bg-blue-700/);
    
    // Other links should not have the active class
    const homeLink = component.locator('a').filter({ hasText: 'Home' });
    await expect(homeLink).not.toHaveClass(/bg-blue-700/);
  });

  test('clicking a nav link closes the mobile menu', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Header />)
    );
    
    // Open the mobile menu
    const menuButton = component.locator('button[aria-label="Menu"]');
    await menuButton.click();
    
    // Check that menu is visible
    const nav = component.locator('nav');
    await expect(nav).toHaveClass(/block/);
    
    // Click a nav link
    const aboutLink = component.locator('a').filter({ hasText: 'About' });
    await aboutLink.click();
    
    // Check that menu is now hidden
    await expect(nav).toHaveClass(/hidden/);
  });
});
