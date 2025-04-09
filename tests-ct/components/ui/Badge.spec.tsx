import { test, expect } from '@playwright/test';
import { Badge } from '../../../src/components/ui/Badge';
import { renderWithProviders } from '../../test-utils';

test.describe('Badge Component', () => {
  test('renders a badge with default variant', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge>Default Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('Default Badge');
    await expect(badge).toHaveClass(/bg-deepSea-deep/);
    await expect(badge).toHaveClass(/text-abyss-100/);
  });

  test('applies the primary variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge variant="primary">Primary Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/bg-deepSea-shallow/);
    await expect(badge).toHaveClass(/text-white/);
  });

  test('applies the secondary variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge variant="secondary">Secondary Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/bg-deepSea-middle/);
    await expect(badge).toHaveClass(/text-abyss-100/);
  });

  test('applies the bitcoin variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge variant="bitcoin">Bitcoin Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/bg-bitcoin-500/);
    await expect(badge).toHaveClass(/text-deepSea-abyss/);
  });

  test('applies the outline variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge variant="outline">Outline Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/border/);
    await expect(badge).toHaveClass(/border-abyss-400/);
    await expect(badge).toHaveClass(/text-abyss-100/);
  });

  test('applies the category variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge variant="category">Category Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/bg-deepSea-deep/);
    await expect(badge).toHaveClass(/text-bitcoin-400/);
  });

  test('applies additional className prop', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge className="test-class">Badge with Custom Class</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/test-class/);
  });

  test('applies common badge styles to all variants', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Badge>Test Badge</Badge>)
    );
    
    const badge = component.locator('div').first();
    await expect(badge).toHaveClass(/inline-flex/);
    await expect(badge).toHaveClass(/items-center/);
    await expect(badge).toHaveClass(/rounded-full/);
    await expect(badge).toHaveClass(/px-2.5/);
    await expect(badge).toHaveClass(/py-0.5/);
    await expect(badge).toHaveClass(/text-xs/);
    await expect(badge).toHaveClass(/font-medium/);
    await expect(badge).toHaveClass(/transition-colors/);
  });
});
