import { test, expect } from '@playwright/test';
import Footer from '../../../src/components/Footer';
import { renderWithProviders } from '../../test-utils';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: any) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

test.describe('Footer Component', () => {
  test('renders footer with copyright notice', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Footer />)
    );
    
    // Check copyright notice
    const copyright = component.locator('p');
    await expect(copyright).toBeVisible();
    
    // Get current year
    const currentYear = new Date().getFullYear();
    await expect(copyright).toHaveText(`© ${currentYear} Angleito. All rights reserved.`);
  });

  test('renders social links', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Footer />)
    );
    
    // Check GitHub link
    const githubLink = component.locator('a').filter({ hasText: 'GitHub' });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/Angleito');
    await expect(githubLink).toHaveAttribute('target', '_blank');
    
    // Check Email link
    const emailLink = component.locator('a').filter({ hasText: 'Email' });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:arainey555@gmail.com');
  });

  test('has correct styling', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Footer />)
    );
    
    // Check footer element
    const footer = component.locator('footer');
    await expect(footer).toHaveClass(/bg-gray-100/);
    await expect(footer).toHaveClass(/py-8/);
    await expect(footer).toHaveClass(/mt-12/);
    await expect(footer).toHaveClass(/border-t/);
    
    // Check container
    const container = component.locator('div').first();
    await expect(container).toHaveClass(/container/);
    await expect(container).toHaveClass(/mx-auto/);
    
    // Check links container
    const linksContainer = component.locator('div').nth(1);
    await expect(linksContainer).toHaveClass(/flex/);
    await expect(linksContainer).toHaveClass(/justify-center/);
    
    // Check links
    const links = component.locator('a');
    await expect(links.first()).toHaveClass(/text-blue-600/);
    await expect(links.first()).toHaveClass(/hover:text-blue-800/);
  });

  test('has separator between links', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Footer />)
    );
    
    // Check separator
    const separator = component.locator('span');
    await expect(separator).toBeVisible();
    await expect(separator).toHaveText('|');
    await expect(separator).toHaveClass(/text-gray-400/);
  });
});
