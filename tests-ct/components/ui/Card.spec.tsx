import { test, expect } from '@playwright/test';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../src/components/ui/Card';
import { renderWithProviders } from '../../test-utils';

test.describe('Card Component', () => {
  test('renders a card with default variant', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Card>Card Content</Card>)
    );
    
    const card = component.locator('div').first();
    await expect(card).toBeVisible();
    await expect(card).toHaveText('Card Content');
    await expect(card).toHaveClass(/bg-deepSea-middle/);
    await expect(card).toHaveClass(/border-abyss-400/);
  });

  test('applies the solid variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Card variant="solid">Card Content</Card>)
    );
    
    const card = component.locator('div').first();
    await expect(card).toHaveClass(/bg-deepSea-deep/);
    await expect(card).toHaveClass(/border-abyss-700/);
  });

  test('applies the glass variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Card variant="glass">Card Content</Card>)
    );
    
    const card = component.locator('div').first();
    await expect(card).toHaveClass(/bg-deepSea-surface/);
    await expect(card).toHaveClass(/backdrop-blur-md/);
  });

  test('applies the highlight variant classes', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Card variant="highlight">Card Content</Card>)
    );
    
    const card = component.locator('div').first();
    await expect(card).toHaveClass(/bg-deepSea-middle/);
    await expect(card).toHaveClass(/border-bitcoin-500/);
    await expect(card).toHaveClass(/shadow-bitcoin/);
  });

  test('applies hover effect classes', async ({ mount }) => {
    // Glow hover effect
    const glowComponent = await mount(
      renderWithProviders(<Card hover="glow">Card Content</Card>)
    );
    await expect(glowComponent.locator('div').first()).toHaveClass(/transition-all/);
    await expect(glowComponent.locator('div').first()).toHaveClass(/hover:shadow-bitcoin/);

    // Scale hover effect
    const scaleComponent = await mount(
      renderWithProviders(<Card hover="scale">Card Content</Card>)
    );
    await expect(scaleComponent.locator('div').first()).toHaveClass(/hover:scale-\[1.02\]/);

    // Border hover effect
    const borderComponent = await mount(
      renderWithProviders(<Card hover="border">Card Content</Card>)
    );
    await expect(borderComponent.locator('div').first()).toHaveClass(/hover:border-bitcoin-500/);
  });

  test('renders CardHeader component', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardHeader>Header Content</CardHeader>
        </Card>
      )
    );
    
    const header = component.locator('div').nth(1); // First div is Card, second is CardHeader
    await expect(header).toBeVisible();
    await expect(header).toHaveText('Header Content');
    await expect(header).toHaveClass(/p-6/);
    await expect(header).toHaveClass(/pb-0/);
  });

  test('renders CardTitle component', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )
    );
    
    const title = component.locator('h3');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Card Title');
    await expect(title).toHaveClass(/text-xl/);
    await expect(title).toHaveClass(/font-bold/);
    await expect(title).toHaveClass(/font-montserrat/);
  });

  test('renders CardDescription component', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardHeader>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>
      )
    );
    
    const description = component.locator('p');
    await expect(description).toBeVisible();
    await expect(description).toHaveText('Card Description');
    await expect(description).toHaveClass(/text-abyss-200/);
    await expect(description).toHaveClass(/text-sm/);
  });

  test('renders CardContent component', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardContent>Content Area</CardContent>
        </Card>
      )
    );
    
    const content = component.locator('div').nth(1); // First div is Card, second is CardContent
    await expect(content).toBeVisible();
    await expect(content).toHaveText('Content Area');
    await expect(content).toHaveClass(/p-6/);
  });

  test('renders CardFooter component', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardFooter>Footer Content</CardFooter>
        </Card>
      )
    );
    
    const footer = component.locator('div').nth(1); // First div is Card, second is CardFooter
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText('Footer Content');
    await expect(footer).toHaveClass(/p-6/);
    await expect(footer).toHaveClass(/pt-0/);
    await expect(footer).toHaveClass(/flex/);
  });

  test('renders a complete card with all subcomponents', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content goes here</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      )
    );
    
    await expect(component.locator('h3')).toHaveText('Card Title');
    await expect(component.locator('p').first()).toHaveText('Card Description');
    await expect(component.locator('p').nth(1)).toHaveText('Main content goes here');
    await expect(component.locator('button')).toHaveText('Action Button');
  });
});
