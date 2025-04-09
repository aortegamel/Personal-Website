import { test, expect } from '@playwright/test';
import { Grid } from '../../../src/components/layout/Grid';
import { renderWithProviders } from '../../test-utils';

test.describe('Grid Component', () => {
  test('renders a grid with default props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Grid>
      )
    );
    
    const grid = component.locator('div').first();
    await expect(grid).toBeVisible();
    await expect(grid).toHaveClass(/grid/);
    await expect(grid).toHaveClass(/grid-cols-1/); // Default responsive is true, so starts with 1 column
    await expect(grid).toHaveClass(/sm:grid-cols-2/); // Responsive breakpoint for small screens
    await expect(grid).toHaveClass(/md:grid-cols-3/); // Default cols is 3
    await expect(grid).toHaveClass(/gap-6/); // Default gap is 'md'
    
    // Check that children are rendered
    const items = component.locator('div > div');
    await expect(items).toHaveCount(4); // 1 for test-container, 1 for Grid, and 3 for items
    await expect(items.nth(1)).toHaveText('Item 1');
    await expect(items.nth(2)).toHaveText('Item 2');
    await expect(items.nth(3)).toHaveText('Item 3');
  });

  test('applies different column counts', async ({ mount }) => {
    // 1 column
    const oneColComponent = await mount(
      renderWithProviders(<Grid cols={1}>One Column</Grid>)
    );
    await expect(oneColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(oneColComponent.locator('div').first()).not.toHaveClass(/sm:grid-cols-2/);
    
    // 2 columns
    const twoColComponent = await mount(
      renderWithProviders(<Grid cols={2}>Two Columns</Grid>)
    );
    await expect(twoColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(twoColComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    
    // 3 columns (default)
    const threeColComponent = await mount(
      renderWithProviders(<Grid cols={3}>Three Columns</Grid>)
    );
    await expect(threeColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(threeColComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    await expect(threeColComponent.locator('div').first()).toHaveClass(/md:grid-cols-3/);
    
    // 4 columns
    const fourColComponent = await mount(
      renderWithProviders(<Grid cols={4}>Four Columns</Grid>)
    );
    await expect(fourColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(fourColComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    await expect(fourColComponent.locator('div').first()).toHaveClass(/md:grid-cols-3/);
    await expect(fourColComponent.locator('div').first()).toHaveClass(/lg:grid-cols-4/);
    
    // 5 columns
    const fiveColComponent = await mount(
      renderWithProviders(<Grid cols={5}>Five Columns</Grid>)
    );
    await expect(fiveColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(fiveColComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    await expect(fiveColComponent.locator('div').first()).toHaveClass(/md:grid-cols-3/);
    await expect(fiveColComponent.locator('div').first()).toHaveClass(/lg:grid-cols-4/);
    await expect(fiveColComponent.locator('div').first()).toHaveClass(/xl:grid-cols-5/);
    
    // 6 columns
    const sixColComponent = await mount(
      renderWithProviders(<Grid cols={6}>Six Columns</Grid>)
    );
    await expect(sixColComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(sixColComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    await expect(sixColComponent.locator('div').first()).toHaveClass(/md:grid-cols-3/);
    await expect(sixColComponent.locator('div').first()).toHaveClass(/lg:grid-cols-4/);
    await expect(sixColComponent.locator('div').first()).toHaveClass(/xl:grid-cols-5/);
    await expect(sixColComponent.locator('div').first()).toHaveClass(/2xl:grid-cols-6/);
  });

  test('applies different gap sizes', async ({ mount }) => {
    // No gap
    const noGapComponent = await mount(
      renderWithProviders(<Grid gap="none">No Gap</Grid>)
    );
    await expect(noGapComponent.locator('div').first()).toHaveClass(/gap-0/);
    
    // Small gap
    const smallGapComponent = await mount(
      renderWithProviders(<Grid gap="sm">Small Gap</Grid>)
    );
    await expect(smallGapComponent.locator('div').first()).toHaveClass(/gap-3/);
    
    // Medium gap (default)
    const mediumGapComponent = await mount(
      renderWithProviders(<Grid gap="md">Medium Gap</Grid>)
    );
    await expect(mediumGapComponent.locator('div').first()).toHaveClass(/gap-6/);
    
    // Large gap
    const largeGapComponent = await mount(
      renderWithProviders(<Grid gap="lg">Large Gap</Grid>)
    );
    await expect(largeGapComponent.locator('div').first()).toHaveClass(/gap-8/);
  });

  test('handles responsive prop', async ({ mount }) => {
    // Responsive (default)
    const responsiveComponent = await mount(
      renderWithProviders(<Grid responsive={true} cols={3}>Responsive Grid</Grid>)
    );
    await expect(responsiveComponent.locator('div').first()).toHaveClass(/grid-cols-1/);
    await expect(responsiveComponent.locator('div').first()).toHaveClass(/sm:grid-cols-2/);
    await expect(responsiveComponent.locator('div').first()).toHaveClass(/md:grid-cols-3/);
    
    // Non-responsive
    const nonResponsiveComponent = await mount(
      renderWithProviders(<Grid responsive={false} cols={3}>Non-responsive Grid</Grid>)
    );
    await expect(nonResponsiveComponent.locator('div').first()).toHaveClass(/grid-cols-3/);
    await expect(nonResponsiveComponent.locator('div').first()).not.toHaveClass(/grid-cols-1/);
    await expect(nonResponsiveComponent.locator('div').first()).not.toHaveClass(/sm:grid-cols-2/);
    await expect(nonResponsiveComponent.locator('div').first()).not.toHaveClass(/md:grid-cols-3/);
  });

  test('applies additional className prop', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(<Grid className="test-class">Grid with Custom Class</Grid>)
    );
    
    const grid = component.locator('div').first();
    await expect(grid).toHaveClass(/test-class/);
  });
});
