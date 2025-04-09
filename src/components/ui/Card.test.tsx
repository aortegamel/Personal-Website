import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';

describe('Card Component', () => {
  it('renders a card with default variant', () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-deepSea-middle/30');
    expect(card).toHaveClass('border-abyss-400/20');
  });

  it('applies the solid variant classes', () => {
    render(<Card variant="solid">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('bg-deepSea-deep');
    expect(card).toHaveClass('border-abyss-700/50');
  });

  it('applies the glass variant classes', () => {
    render(<Card variant="glass">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('bg-deepSea-surface/30');
    expect(card).toHaveClass('backdrop-blur-md');
  });

  it('applies the highlight variant classes', () => {
    render(<Card variant="highlight">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('bg-deepSea-middle/40');
    expect(card).toHaveClass('border-bitcoin-500/30');
    expect(card).toHaveClass('shadow-bitcoin');
  });

  it('applies hover effect classes', () => {
    render(<Card hover="glow">Card Content</Card>);
    const card = screen.getByText('Card Content');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('hover:shadow-bitcoin');

    render(<Card hover="scale">Card Content</Card>);
    const scaleCard = screen.getByText('Card Content');
    expect(scaleCard).toHaveClass('hover:scale-[1.02]');

    render(<Card hover="border">Card Content</Card>);
    const borderCard = screen.getByText('Card Content');
    expect(borderCard).toHaveClass('hover:border-bitcoin-500/50');
  });

  it('applies additional className prop', () => {
    render(<Card className="test-class">Card Content</Card>);
    expect(screen.getByText('Card Content')).toHaveClass('test-class');
  });

  it('renders CardHeader component', () => {
    render(
      <Card>
        <CardHeader>Header Content</CardHeader>
      </Card>
    );
    const header = screen.getByText('Header Content');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('p-6');
  });

  it('renders CardTitle component', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = screen.getByText('Card Title');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
    expect(title).toHaveClass('text-xl');
    expect(title).toHaveClass('font-bold');
  });

  it('renders CardDescription component', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>
    );
    const description = screen.getByText('Card Description');
    expect(description).toBeInTheDocument();
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('text-abyss-200');
  });

  it('renders CardContent component', () => {
    render(
      <Card>
        <CardContent>Content Area</CardContent>
      </Card>
    );
    const content = screen.getByText('Content Area');
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass('p-6');
  });

  it('renders CardFooter component', () => {
    render(
      <Card>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );
    const footer = screen.getByText('Footer Content');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('p-6');
    expect(footer).toHaveClass('pt-0');
  });

  it('renders a complete card with all subcomponents', () => {
    render(
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
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Main content goes here')).toBeInTheDocument();
    expect(screen.getByText('Action Button')).toBeInTheDocument();
  });
});
