import { test, expect } from '@playwright/test';
import { Section } from '../../../src/components/layout/Section';
import { renderWithProviders } from '../../test-utils';

test.describe('Section Component', () => {
  test('renders a section with default props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Section>Section Content</Section>
      )
    );
    
    const section = component.locator('section');
    await expect(section).toBeVisible();
    await expect(section).toHaveText('Section Content');
    await expect(section).toHaveClass(/py-12/);
    
    // Should have a Container inside by default
    const container = component.locator('div').nth(1); // First div is test-container, second is Container
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/max-w-screen-lg/); // Default containerSize is 'lg'
  });

  test('renders with different HTML elements based on as prop', async ({ mount }) => {
    // Default is 'section'
    const sectionComponent = await mount(
      renderWithProviders(<Section>Section Element</Section>)
    );
    await expect(sectionComponent.locator('section')).toBeVisible();
    
    // Div element
    const divComponent = await mount(
      renderWithProviders(<Section as="div">Div Element</Section>)
    );
    await expect(divComponent.locator('div').nth(1)).toHaveText('Div Element');
    
    // Article element
    const articleComponent = await mount(
      renderWithProviders(<Section as="article">Article Element</Section>)
    );
    await expect(articleComponent.locator('article')).toBeVisible();
    
    // Aside element
    const asideComponent = await mount(
      renderWithProviders(<Section as="aside">Aside Element</Section>)
    );
    await expect(asideComponent.locator('aside')).toBeVisible();
  });

  test('handles withContainer prop', async ({ mount }) => {
    // With container (default)
    const withContainerComponent = await mount(
      renderWithProviders(<Section withContainer={true}>With Container</Section>)
    );
    const container = withContainerComponent.locator('div').nth(1);
    await expect(container).toBeVisible();
    await expect(container).toHaveClass(/w-full/);
    await expect(container).toHaveClass(/mx-auto/);
    
    // Without container
    const withoutContainerComponent = await mount(
      renderWithProviders(<Section withContainer={false}>Without Container</Section>)
    );
    // The text should be directly inside the section
    await expect(withoutContainerComponent.locator('section')).toHaveText('Without Container');
    // There should be no container div
    await expect(withoutContainerComponent.locator('div').nth(1)).not.toBeVisible();
  });

  test('applies containerSize prop to the inner Container', async ({ mount }) => {
    // Small container
    const smallContainerComponent = await mount(
      renderWithProviders(<Section containerSize="sm">Small Container</Section>)
    );
    await expect(smallContainerComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-sm/);
    
    // Medium container
    const mediumContainerComponent = await mount(
      renderWithProviders(<Section containerSize="md">Medium Container</Section>)
    );
    await expect(mediumContainerComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-md/);
    
    // Large container (default)
    const largeContainerComponent = await mount(
      renderWithProviders(<Section containerSize="lg">Large Container</Section>)
    );
    await expect(largeContainerComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-lg/);
    
    // Extra large container
    const xlContainerComponent = await mount(
      renderWithProviders(<Section containerSize="xl">XL Container</Section>)
    );
    await expect(xlContainerComponent.locator('div').nth(1)).toHaveClass(/max-w-screen-xl/);
    
    // Full container
    const fullContainerComponent = await mount(
      renderWithProviders(<Section containerSize="full">Full Container</Section>)
    );
    await expect(fullContainerComponent.locator('div').nth(1)).toHaveClass(/max-w-none/);
  });

  test('applies containerClassName prop to the inner Container', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Section containerClassName="container-test-class">Container with Custom Class</Section>
      )
    );
    
    const container = component.locator('div').nth(1);
    await expect(container).toHaveClass(/container-test-class/);
  });

  test('applies additional className prop to the section element', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Section className="section-test-class">Section with Custom Class</Section>
      )
    );
    
    const section = component.locator('section');
    await expect(section).toHaveClass(/section-test-class/);
  });

  test('renders children correctly', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <Section>
          <h1>Heading</h1>
          <p>Paragraph</p>
        </Section>
      )
    );
    
    await expect(component.locator('h1')).toBeVisible();
    await expect(component.locator('h1')).toHaveText('Heading');
    await expect(component.locator('p')).toBeVisible();
    await expect(component.locator('p')).toHaveText('Paragraph');
  });
});
