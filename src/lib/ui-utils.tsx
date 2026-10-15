import React from 'react';

// Badge component (simple implementation for now)
const Badge = ({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'tech';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap';
  const variantClasses = {
    default: 'bg-abyss-800/50 text-abyss-100 border border-abyss-700/50',
    category: 'bg-bitcoin-500/10 text-bitcoin-400 border border-bitcoin-500/30',
    tech: 'bg-deepSea-middle/30 text-abyss-200 border border-abyss-600/30',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Pure function to truncate lists with custom "more" text
export const truncateList = <T,>(
  items: T[],
  limit: number,
  formatMore: (count: number) => string = (count) => `+${count} more`
): { displayed: T[]; moreText?: string } => {
  if (items.length <= limit) {
    return { displayed: items };
  }

  return {
    displayed: items.slice(0, limit),
    moreText: formatMore(items.length - limit)
  };
};

// Pure function to render badges
export const renderBadges = (
  items: string[],
  variant: 'default' | 'category' | 'tech' = 'default',
  limit?: number,
  className?: string
) => {
  const { displayed, moreText } = limit
    ? truncateList(items, limit)
    : { displayed: items, moreText: undefined };

  return (
    <>
      {displayed.map((item) => (
        <Badge key={item} variant={variant} className={className}>
          {item}
        </Badge>
      ))}
      {moreText && (
        <Badge variant={variant} className={className}>
          {moreText}
        </Badge>
      )}
    </>
  );
};

// Pure function to render tech stack
export const renderTechStack = (
  techStack: string[],
  options: {
    variant?: 'tech' | 'category';
    limit?: number;
    className?: string;
    showLabel?: boolean;
  } = {}
) => {
  const { variant = 'tech', limit, className, showLabel = false } = options;

  if (!techStack.length) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {showLabel && <span className="text-sm text-gray-600 dark:text-gray-400">Tech:</span>}
      {renderBadges(techStack, variant, limit, className)}
    </div>
  );
};

// Functional variant renderer
export type VariantRenderer<T, V extends string> = {
  [K in V]: (props: T) => React.ReactElement;
};

export const createVariantRenderer = <T, V extends string>(
  variants: VariantRenderer<T, V>,
  defaultVariant: V
) => {
  return (props: T & { variant?: V }) => {
    const variant = props.variant || defaultVariant;
    const Renderer = variants[variant];

    if (!Renderer) {
      console.warn(`Unknown variant: ${variant}, using default: ${defaultVariant}`);
      return variants[defaultVariant](props);
    }

    return Renderer(props);
  };
};

// Compose multiple class names functionally
export const composeClasses = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(' ');

// Higher-order function for creating hover effects
export const withHoverEffect = <T extends { className?: string }>(
  Component: React.FC<T>,
  hoverClass: string
) => {
  return (props: T) => (
    <Component
      {...props}
      className={composeClasses(props.className, hoverClass)}
    />
  );
};