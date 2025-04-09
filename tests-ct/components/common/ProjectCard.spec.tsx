import { test, expect } from '@playwright/test';
import ProjectCard from '../../../src/components/ProjectCard';
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

test.describe('ProjectCard Component', () => {
  const mockProject = {
    name: 'Test Project',
    description: 'This is a test description for the project card component.',
    techStack: ['React', 'Next.js', 'Tailwind CSS'],
    slug: 'test-project'
  };

  test('renders project card with all props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <ProjectCard
          name={mockProject.name}
          description={mockProject.description}
          techStack={mockProject.techStack}
          slug={mockProject.slug}
        />
      )
    );
    
    // Check name
    const name = component.locator('h3');
    await expect(name).toBeVisible();
    await expect(name).toHaveText(mockProject.name);
    
    // Check description
    const description = component.locator('p');
    await expect(description).toBeVisible();
    await expect(description).toHaveText(mockProject.description);
    
    // Check tech stack heading
    const techStackHeading = component.locator('h4');
    await expect(techStackHeading).toBeVisible();
    await expect(techStackHeading).toHaveText('Tech Stack');
    
    // Check tech stack items
    const techStackItems = component.locator('span');
    await expect(techStackItems).toHaveCount(3);
    await expect(techStackItems.nth(0)).toHaveText('React');
    await expect(techStackItems.nth(1)).toHaveText('Next.js');
    await expect(techStackItems.nth(2)).toHaveText('Tailwind CSS');
    
    // Check "View Project" link
    const viewProjectLink = component.locator('a').filter({ hasText: 'View Project →' });
    await expect(viewProjectLink).toBeVisible();
    await expect(viewProjectLink).toHaveAttribute('href', `/projects/${mockProject.slug}`);
  });

  test('links have correct hrefs', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <ProjectCard
          name={mockProject.name}
          description={mockProject.description}
          techStack={mockProject.techStack}
          slug={mockProject.slug}
        />
      )
    );
    
    // Name link should point to project
    const nameLink = component.locator('h3 a');
    await expect(nameLink).toHaveAttribute('href', `/projects/${mockProject.slug}`);
    
    // View project link should point to project
    const viewProjectLink = component.locator('a').filter({ hasText: 'View Project →' });
    await expect(viewProjectLink).toHaveAttribute('href', `/projects/${mockProject.slug}`);
  });

  test('renders project card with empty tech stack', async ({ mount }) => {
    const projectWithEmptyTechStack = {
      ...mockProject,
      techStack: []
    };

    const component = await mount(
      renderWithProviders(
        <ProjectCard
          name={projectWithEmptyTechStack.name}
          description={projectWithEmptyTechStack.description}
          techStack={projectWithEmptyTechStack.techStack}
          slug={projectWithEmptyTechStack.slug}
        />
      )
    );
    
    // Tech stack heading should still be visible
    const techStackHeading = component.locator('h4');
    await expect(techStackHeading).toBeVisible();
    await expect(techStackHeading).toHaveText('Tech Stack');
    
    // But there should be no tech stack items
    const techStackItems = component.locator('span');
    await expect(techStackItems).toHaveCount(0);
    
    // Other elements should still be present
    await expect(component.locator('h3')).toHaveText(projectWithEmptyTechStack.name);
    await expect(component.locator('p')).toHaveText(projectWithEmptyTechStack.description);
  });

  test('renders project card with long description', async ({ mount }) => {
    const projectWithLongDescription = {
      ...mockProject,
      description: 'This is a very long description that should still be displayed properly in the project card component. It contains multiple sentences and should wrap correctly within the card layout without causing any visual issues or text overflow problems.'
    };

    const component = await mount(
      renderWithProviders(
        <ProjectCard
          name={projectWithLongDescription.name}
          description={projectWithLongDescription.description}
          techStack={projectWithLongDescription.techStack}
          slug={projectWithLongDescription.slug}
        />
      )
    );
    
    // Description should contain the full text
    const description = component.locator('p');
    await expect(description).toHaveText(projectWithLongDescription.description);
  });

  test('renders project card with many tech stack items', async ({ mount }) => {
    const projectWithManyTechItems = {
      ...mockProject,
      techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'GraphQL']
    };

    const component = await mount(
      renderWithProviders(
        <ProjectCard
          name={projectWithManyTechItems.name}
          description={projectWithManyTechItems.description}
          techStack={projectWithManyTechItems.techStack}
          slug={projectWithManyTechItems.slug}
        />
      )
    );
    
    // All tech stack items should be rendered
    const techStackItems = component.locator('span');
    await expect(techStackItems).toHaveCount(8);
    
    // Check a few of them
    await expect(techStackItems.nth(0)).toHaveText('React');
    await expect(techStackItems.nth(3)).toHaveText('TypeScript');
    await expect(techStackItems.nth(7)).toHaveText('GraphQL');
  });
});
