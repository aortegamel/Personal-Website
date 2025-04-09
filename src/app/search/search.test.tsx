import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from './page';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(''),
  }),
}));

// Mock the contentlayer/generated module
jest.mock('contentlayer/generated', () => ({
  allPosts: [
    {
      title: 'Test Post',
      url: '/posts/test-post',
      date: '2023-01-01',
      excerpt: 'This is a test post',
      categories: ['test'],
      tags: ['test'],
      type: 'post',
    },
  ],
  allProjects: [
    {
      name: 'Test Project',
      url: '/projects/test-project',
      description: 'This is a test project',
      tech_stack: ['React', 'Next.js'],
      features: ['Feature 1', 'Feature 2'],
      type: 'project',
    },
  ],
}));

describe('SearchPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders the search page with the correct title', () => {
    render(<SearchPage />);
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Dive deep into the abyss to discover articles and projects')).toBeInTheDocument();
  });

  it('displays the search input and button', () => {
    render(<SearchPage />);
    expect(screen.getByPlaceholderText('Search posts and projects...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('performs a search when the form is submitted', async () => {
    render(<SearchPage />);
    
    // Get the search input and button
    const searchInput = screen.getByPlaceholderText('Search posts and projects...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Enter a search query
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Submit the form
    fireEvent.click(searchButton);
    
    // Wait for the search results to appear
    await waitFor(() => {
      expect(screen.getByText(/treasures discovered for/i)).toBeInTheDocument();
    });
    
    // Check that the search results are displayed
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('displays a message when no results are found', async () => {
    render(<SearchPage />);
    
    // Get the search input and button
    const searchInput = screen.getByPlaceholderText('Search posts and projects...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Enter a search query that won't match anything
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Submit the form
    fireEvent.click(searchButton);
    
    // Wait for the no results message to appear
    await waitFor(() => {
      expect(screen.getByText(/No treasures found for/i)).toBeInTheDocument();
    });
  });

  it('displays a loading indicator while searching', async () => {
    render(<SearchPage />);
    
    // Get the search input and button
    const searchInput = screen.getByPlaceholderText('Search posts and projects...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Enter a search query
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Submit the form
    fireEvent.click(searchButton);
    
    // Check that the loading indicator is displayed
    expect(screen.getByText('Searching the depths...')).toBeInTheDocument();
    
    // Wait for the search results to appear
    await waitFor(() => {
      expect(screen.queryByText('Searching the depths...')).not.toBeInTheDocument();
    });
  });
});
