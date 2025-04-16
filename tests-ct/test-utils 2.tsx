import React from 'react';
import { expect } from '@playwright/test';

/**
 * Renders a component with the necessary providers for testing
 */
export function renderWithProviders(component: React.ReactElement) {
  return (
    <div className="test-container">
      {component}
    </div>
  );
}

/**
 * Custom assertions for component testing
 */
export const customExpect = {
  ...expect,
  
  // Check if an element has a specific Tailwind class
  toHaveTailwindClass: async (element: any, className: string) => {
    const classAttribute = await element.getAttribute('class');
    expect(classAttribute?.split(' ')).toContain(className);
  },
  
  // Check if an element has a specific Tailwind class that starts with a prefix
  toHaveTailwindClassStartingWith: async (element: any, prefix: string) => {
    const classAttribute = await element.getAttribute('class');
    const hasClassWithPrefix = classAttribute?.split(' ').some(cls => cls.startsWith(prefix));
    expect(hasClassWithPrefix).toBeTruthy();
  },
};
