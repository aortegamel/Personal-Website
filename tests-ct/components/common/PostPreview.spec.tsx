import { test, expect } from '@playwright/test';
import PostPreview from '../../../src/components/PostPreview';
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

test.describe('PostPreview Component', () => {
  const mockPost = {
    title: 'Test Post Title',
    date: 'January 1, 2023',
    excerpt: 'This is a test excerpt for the post preview component.',
    slug: 'test-post',
    categories: ['Technology', 'Web Development']
  };

  test('renders post preview with all props', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <PostPreview
          title={mockPost.title}
          date={mockPost.date}
          excerpt={mockPost.excerpt}
          slug={mockPost.slug}
          categories={mockPost.categories}
        />
      )
    );
    
    // Check title
    const title = component.locator('h3');
    await expect(title).toBeVisible();
    await expect(title).toHaveText(mockPost.title);
    
    // Check date
    const date = component.locator('p').first();
    await expect(date).toBeVisible();
    await expect(date).toHaveText(mockPost.date);
    
    // Check categories
    const categoryLinks = component.locator('a').filter({ hasText: /Technology|Web Development/ });
    await expect(categoryLinks).toHaveCount(2);
    await expect(categoryLinks.first()).toHaveText('Technology');
    await expect(categoryLinks.nth(1)).toHaveText('Web Development');
    
    // Check excerpt
    const excerpt = component.locator('p').nth(1);
    await expect(excerpt).toBeVisible();
    await expect(excerpt).toHaveText(mockPost.excerpt);
    
    // Check "Read More" link
    const readMoreLink = component.locator('a').filter({ hasText: 'Read More →' });
    await expect(readMoreLink).toBeVisible();
    await expect(readMoreLink).toHaveAttribute('href', `/posts/${mockPost.slug}`);
  });

  test('renders post preview without categories', async ({ mount }) => {
    const postWithoutCategories = {
      ...mockPost,
      categories: undefined
    };

    const component = await mount(
      renderWithProviders(
        <PostPreview
          title={postWithoutCategories.title}
          date={postWithoutCategories.date}
          excerpt={postWithoutCategories.excerpt}
          slug={postWithoutCategories.slug}
        />
      )
    );
    
    // Check that categories section is not rendered
    const categoryLinks = component.locator('a').filter({ hasText: /Technology|Web Development/ });
    await expect(categoryLinks).toHaveCount(0);
    
    // Other elements should still be present
    await expect(component.locator('h3')).toHaveText(postWithoutCategories.title);
    await expect(component.locator('p').first()).toHaveText(postWithoutCategories.date);
    await expect(component.locator('p').nth(1)).toHaveText(postWithoutCategories.excerpt);
  });

  test('renders post preview with empty categories array', async ({ mount }) => {
    const postWithEmptyCategories = {
      ...mockPost,
      categories: []
    };

    const component = await mount(
      renderWithProviders(
        <PostPreview
          title={postWithEmptyCategories.title}
          date={postWithEmptyCategories.date}
          excerpt={postWithEmptyCategories.excerpt}
          slug={postWithEmptyCategories.slug}
          categories={postWithEmptyCategories.categories}
        />
      )
    );
    
    // Check that categories section is not rendered
    const categoryLinks = component.locator('a').filter({ hasText: /Technology|Web Development/ });
    await expect(categoryLinks).toHaveCount(0);
    
    // Other elements should still be present
    await expect(component.locator('h3')).toHaveText(postWithEmptyCategories.title);
    await expect(component.locator('p').first()).toHaveText(postWithEmptyCategories.date);
    await expect(component.locator('p').nth(1)).toHaveText(postWithEmptyCategories.excerpt);
  });

  test('links have correct hrefs', async ({ mount }) => {
    const component = await mount(
      renderWithProviders(
        <PostPreview
          title={mockPost.title}
          date={mockPost.date}
          excerpt={mockPost.excerpt}
          slug={mockPost.slug}
          categories={mockPost.categories}
        />
      )
    );
    
    // Title link should point to post
    const titleLink = component.locator('h3 a');
    await expect(titleLink).toHaveAttribute('href', `/posts/${mockPost.slug}`);
    
    // Category links should point to category pages
    const technologyLink = component.locator('a').filter({ hasText: 'Technology' });
    await expect(technologyLink).toHaveAttribute('href', '/categories/Technology');
    
    const webDevLink = component.locator('a').filter({ hasText: 'Web Development' });
    await expect(webDevLink).toHaveAttribute('href', '/categories/Web Development');
    
    // Read more link should point to post
    const readMoreLink = component.locator('a').filter({ hasText: 'Read More →' });
    await expect(readMoreLink).toHaveAttribute('href', `/posts/${mockPost.slug}`);
  });
});
