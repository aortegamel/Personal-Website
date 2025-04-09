import { test, expect } from '@playwright/test';
import { Container } from '../../../src/components/layout/Container';
import { renderWithProviders } from '../../test-utils';

test.describe('Container Component', () => {
  test('renders a container with default props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Container>Container Content</Container>
      )
    );
    
    const container = component.locator('div').nth(1); // First div is test-container, second is Container
    await expect(container).toBeVisible();
    await expect(container).toHaveText('Container Content');
    await expect(container).toHaveClass(/w-full/);
    await expect(container).toHaveClass(/px-4/);
    await expect(container).toHaveClass(/mx-auto/);
    await expect(container).toHaveClass(/max-w-screen-lg/); // Default size is 'lg'
    await expect(container).toHaveClass(/text-center/); // Default centered is true
  });

  test('applies different size classes', async ({ mount }) => {
    // Small size
    const smallComponent = await mount(
      renderWithProviders(<Container size="sm">Small Container</Container>)
    );
    await expect(smallComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-sm/);
    
    // Medium size
    const mediumComponent = await mount(
      renderWithProviders(<Container size="md">Medium Container</Container>)
    );
    await expect(mediumComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-md/);
    
    // Large size (default)
    const largeComponent = await mount(
      renderWithProviders(<Container size="lg">Large Container</Container>)
    );
    await expect(largeComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-lg/);
    
    // Extra large size
    const xlComponent = await mount(
      renderWithProviders(<Container size="xl">XL Container</Container>)
    );
    await expect(xlComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-xl/);
    
    // Full size
    const fullComponent = await mount(
      renderWithProviders(<Container size="full">Full Container</Container>)
    );
    await expect(fullComponent.locator('div').nth(1)).toHaveClass(/max-w-none/);
  });

  test('handles centered prop', async ({ mount }) => {
    // Centered (default)
    const centeredComponent = await mount(
      renderWithProviders(<Container centered={true}>Centered Container</Container>)
    );
    await expect(centeredComponent.locator('div').nth(1)).toHaveClass(/text-center/);
    
    // Not centered
    const notCenteredComponent = await mount(
      renderWithProviders(<Container centered={false}>Not Centered Container</Container>)
    );
    await expect(notCenteredComponent.locator('div').nth(1)).not.toHaveClass(/text-center/);
  });

  test('applies additional className prop', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Container className="test-class">Container with Custom Class</Container>)
    );
    
    const container = component.locator('div').nth(1);
    await expect(container).toHaveClass(/test-class/);
  });

  test('renders children correctly', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Container>
          <h1>Heading</h1>
          <p>Paragraph</p>
        </Container>
      )
    );
    
    await expect(component.locator('h1')).toBeVisible();
    await expect(component.locator('h1')).toHaveText('Heading');
    await expect(component.locator('p')).toBeVisible();
    await expect(component.locator('p')).toHaveText('Paragraph');
  });
});
