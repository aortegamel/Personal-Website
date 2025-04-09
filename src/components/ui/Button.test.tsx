import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

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

describe('Button Component', () => {
  it('renders a button element by default', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders an anchor element when href is provided', () => {
    render(<Button href="/test">Click me</Button>);
    const link = screen.getByRole('link', { name: /click me/i });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies the default variant and size classes', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-deepSea-shallow');
    expect(button).toHaveClass('hover:bg-deepSea-middle');
    expect(button).toHaveClass('h-10');
  });

  it('applies the bitcoin variant classes', () => {
    render(<Button variant="bitcoin">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-bitcoin-500');
    expect(button).toHaveClass('hover:bg-bitcoin-600');
    expect(button).toHaveClass('shadow-bitcoin');
  });

  it('applies the outline variant classes', () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-abyss-400/30');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies the ghost variant classes', () => {
    render(<Button variant="ghost">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('hover:bg-deepSea-middle/10');
    expect(button).toHaveClass('text-abyss-100');
  });

  it('applies the link variant classes', () => {
    render(<Button variant="link">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('text-bitcoin-400');
    expect(button).toHaveClass('hover:text-bitcoin-300');
    expect(button).toHaveClass('underline-offset-4');
  });

  it('applies different size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('h-8');

    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass('h-12');

    render(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button', { name: /icon/i })).toHaveClass('h-9');
  });

  it('applies additional className prop', () => {
    render(<Button className="test-class">Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toHaveClass('test-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDisabled();
  });

  it('opens in a new tab when external is true', () => {
    render(<Button href="/test" external>External Link</Button>);
    const link = screen.getByRole('link', { name: /external link/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
