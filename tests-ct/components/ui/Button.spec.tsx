import { test, expect } from '@playwright/test';
import { Button } from '../../../src/components/ui/Button';
import { renderWithProviders } from '../../test-utils';

test.describe('Button Component', () => {
  test('renders a button element by default', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button>Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Click me');
  });

  test('renders an anchor element when href is provided', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button href="/test">Click me</Button>)
    );
    
    const link = component.locator('a');
    await expect(link).toBeVisible();
    await expect(link).toHaveText('Click me');
    await expect(link).toHaveAttribute('href', '/test');
  });

  test('applies the default variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button>Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toHaveClass(/bg-deepSea-shallow/);
    await expect(button).toHaveClass(/hover:bg-deepSea-middle/);
    await expect(button).toHaveClass(/text-white/);
  });

  test('applies the bitcoin variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button variant="bitcoin">Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toHaveClass(/bg-bitcoin-500/);
    await expect(button).toHaveClass(/hover:bg-bitcoin-600/);
    await expect(button).toHaveClass(/shadow-bitcoin/);
  });

  test('applies the outline variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button variant="outline">Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toHaveClass(/border/);
    await expect(button).toHaveClass(/border-abyss-400/);
    await expect(button).toHaveClass(/bg-transparent/);
  });

  test('applies different size classes', async ({ mount }) => {
    // Small size
    const smallComponent = await mount(
      renderWithProviders(<Button size="sm">Small</Button>)
    );
    await expect(smallComponent.locator('button')).toHaveClass(/h-8/);
    
    // Large size
    const largeComponent = await mount(
      renderWithProviders(<Button size="lg">Large</Button>)
    );
    await expect(largeComponent.locator('button')).toHaveClass(/h-12/);
    
    // Icon size
    const iconComponent = await mount(
      renderWithProviders(<Button size="icon">Icon</Button>)
    );
    await expect(iconComponent.locator('button')).toHaveClass(/h-9/);
    await expect(iconComponent.locator('button')).toHaveClass(/w-9/);
  });

  test('applies additional className prop', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button className="test-class">Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toHaveClass(/test-class/);
  });

  test('handles disabled state', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button disabled>Click me</Button>)
    );
    
    const button = component.locator('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveClass(/disabled:opacity-50/);
  });

  test('opens in a new tab when external is true', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Button href="/test" external>External Link</Button>)
    );
    
    const link = component.locator('a');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
