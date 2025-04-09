import { test, expect } from '@playwright/test';
import { Input } from '../../../src/components/ui/Input';
import { renderWithProviders } from '../../test-utils';

test.describe('Input Component', () => {
  test('renders an input element with default props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input placeholder="Enter text" />)
    );
    
    const input = component.locator('input');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  test('applies the default variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input />)
    );
    
    const input = component.locator('input');
    await expect(input).toHaveClass(/bg-deepSea-surface/);
    await expect(input).toHaveClass(/border-abyss-400/);
    await expect(input).toHaveClass(/text-white/);
    await expect(input).toHaveClass(/focus-visible:ring-bitcoin-500/);
  });

  test('applies the solid variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input variant="solid" />)
    );
    
    const input = component.locator('input');
    await expect(input).toHaveClass(/bg-deepSea-deep/);
    await expect(input).toHaveClass(/border-abyss-700/);
    await expect(input).toHaveClass(/text-white/);
  });

  test('applies the ghost variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input variant="ghost" />)
    );
    
    const input = component.locator('input');
    await expect(input).toHaveClass(/bg-transparent/);
    await expect(input).toHaveClass(/border-abyss-400/);
    await expect(input).toHaveClass(/hover:border-abyss-400/);
  });

  test('applies different size classes', async ({ mount }) => {
    // Small size
    const smallComponent = await mount(
      renderWithProviders(<Input size="sm" />)
    );
    await expect(smallComponent.locator('input')).toHaveClass(/h-8/);
    await expect(smallComponent.locator('input')).toHaveClass(/px-3/);
    await expect(smallComponent.locator('input')).toHaveClass(/text-xs/);
    
    // Large size
    const largeComponent = await mount(
      renderWithProviders(<Input size="lg" />)
    );
    await expect(largeComponent.locator('input')).toHaveClass(/h-12/);
    await expect(largeComponent.locator('input')).toHaveClass(/px-6/);
    await expect(largeComponent.locator('input')).toHaveClass(/text-base/);
  });

  test('applies additional className prop', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input className="test-class" />)
    );
    
    const input = component.locator('input');
    await expect(input).toHaveClass(/test-class/);
  });

  test('handles disabled state', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Input disabled />)
    );
    
    const input = component.locator('input');
    await expect(input).toBeDisabled();
    await expect(input).toHaveClass(/disabled:opacity-50/);
    await expect(input).toHaveClass(/disabled:cursor-not-allowed/);
  });

  test('handles different input types', async ({ mount }) => {
    // Text input (default)
    const textComponent = await mount(
      renderWithProviders(<Input type="text" />)
    );
    await expect(textComponent.locator('input')).toHaveAttribute('type', 'text');
    
    // Password input
    const passwordComponent = await mount(
      renderWithProviders(<Input type="password" />)
    );
    await expect(passwordComponent.locator('input')).toHaveAttribute('type', 'password');
    
    // Email input
    const emailComponent = await mount(
      renderWithProviders(<Input type="email" />)
    );
    await expect(emailComponent.locator('input')).toHaveAttribute('type', 'email');
  });

  test('handles value and onChange props', async ({ mount }) => {
    let value = '';
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };

    const component = await mount(
      renderWithProviders(
        <Input 
          value={value} 
          onChange={onChange} 
          data-testid="test-input"
        />
      )
    );
    
    const input = component.locator('input');
    await expect(input).toHaveValue('');
    
    // Note: In Playwright component testing, we can't directly test the onChange handler
    // This would be better tested with a user interaction test or with Jest
  });
});
