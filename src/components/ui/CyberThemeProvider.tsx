'use client';

import React, { createContext, useContext, useState } from 'react';

interface CyberTheme {
  enabled: boolean;
  theme: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  intensity: 1 | 2 | 3 | 4 | 5;
  showParticles: boolean;
  showScanlines: boolean;
  showGrid: boolean;
  showHUD: boolean;
  showGlitchEffects: boolean;
}

interface CyberThemeContextType {
  theme: CyberTheme;
  updateTheme: (updates: Partial<CyberTheme>) => void;
  toggleCyberpunk: () => void;
  setThemeColor: (color: CyberTheme['theme']) => void;
  setIntensity: (intensity: CyberTheme['intensity']) => void;
}

const defaultTheme: CyberTheme = {
  enabled: false,
  theme: 'cyan',
  intensity: 2,
  showParticles: true,
  showScanlines: true,
  showGrid: true,
  showHUD: false,
  showGlitchEffects: true,
};

const CyberThemeContext = createContext<CyberThemeContextType | undefined>(undefined);

/**
 * Custom hook to access cyberpunk theme context
 */
export function useCyberTheme() {
  const context = useContext(CyberThemeContext);
  if (context === undefined) {
    throw new Error('useCyberTheme must be used within a CyberThemeProvider');
  }
  return context;
}

interface CyberThemeProviderProps {
  children: React.ReactNode;
  /**
   * Initial theme configuration
   */
  initialTheme?: Partial<CyberTheme>;
  /**
   * Whether to persist theme settings to localStorage
   */
  persistTheme?: boolean;
}

/**
 * CyberThemeProvider Component
 * 
 * Provides global cyberpunk theme state management for the entire application.
 * Handles theme persistence, provides convenient methods for theme updates,
 * and ensures consistent theming across all cyberpunk components.
 * 
 * Features:
 * - Global theme state management
 * - Local storage persistence
 * - Theme switching utilities
 * - Context-based theme access
 * - Type-safe theme configuration
 */
export const CyberThemeProvider: React.FC<CyberThemeProviderProps> = ({
  children,
  initialTheme = {},
  persistTheme = true,
}) => {
  const [theme, setTheme] = useState<CyberTheme>(() => {
    // Load from localStorage if persistence is enabled
    if (persistTheme && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cyberpunk-theme');
        if (stored) {
          const parsedTheme = JSON.parse(stored);
          return { ...defaultTheme, ...initialTheme, ...parsedTheme };
        }
      } catch (error) {
        console.warn('Failed to load cyberpunk theme from localStorage:', error);
      }
    }
    
    return { ...defaultTheme, ...initialTheme };
  });

  const updateTheme = (updates: Partial<CyberTheme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    // Persist to localStorage if enabled
    if (persistTheme && typeof window !== 'undefined') {
      try {
        localStorage.setItem('cyberpunk-theme', JSON.stringify(newTheme));
      } catch (error) {
        console.warn('Failed to save cyberpunk theme to localStorage:', error);
      }
    }
  };

  const toggleCyberpunk = () => {
    updateTheme({ enabled: !theme.enabled });
  };

  const setThemeColor = (color: CyberTheme['theme']) => {
    updateTheme({ theme: color });
  };

  const setIntensity = (intensity: CyberTheme['intensity']) => {
    updateTheme({ intensity });
  };

  const contextValue: CyberThemeContextType = {
    theme,
    updateTheme,
    toggleCyberpunk,
    setThemeColor,
    setIntensity,
  };

  return (
    <CyberThemeContext.Provider value={contextValue}>
      {children}
    </CyberThemeContext.Provider>
  );
};

/**
 * Higher-order component that provides cyberpunk theming capabilities
 * to any component
 */
export function withCyberTheme<P extends object>(
  Component: React.ComponentType<P>
) {
  return function CyberThemedComponent(props: P) {
    const cyberTheme = useCyberTheme();
    
    return (
      <Component 
        {...props} 
        cyberTheme={cyberTheme.theme}
        updateCyberTheme={cyberTheme.updateTheme}
      />
    );
  };
}

/**
 * Component wrapper that conditionally applies cyberpunk styling
 */
interface CyberWrapperProps {
  children: React.ReactNode;
  /**
   * Standard (non-cyberpunk) className
   */
  standardClass?: string;
  /**
   * Cyberpunk className
   */
  cyberClass?: string;
  /**
   * Whether to apply cyberpunk styling regardless of global theme
   */
  forceCyber?: boolean;
  /**
   * Minimum intensity required to show cyberpunk styling
   */
  minIntensity?: 1 | 2 | 3 | 4 | 5;
}

export const CyberWrapper: React.FC<CyberWrapperProps> = ({
  children,
  standardClass = '',
  cyberClass = '',
  forceCyber = false,
  minIntensity = 1,
}) => {
  const { theme } = useCyberTheme();
  
  const shouldUseCyber = forceCyber || (theme.enabled && theme.intensity >= minIntensity);
  const className = shouldUseCyber ? cyberClass : standardClass;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * Hook for creating theme-aware CSS classes
 */
export function useCyberClasses(classes: {
  standard: string;
  cyber: string;
  minIntensity?: 1 | 2 | 3 | 4 | 5;
}) {
  const { theme } = useCyberTheme();
  const { standard, cyber, minIntensity = 1 } = classes;
  
  const shouldUseCyber = theme.enabled && theme.intensity >= minIntensity;
  return shouldUseCyber ? cyber : standard;
}

/**
 * Theme toggle component for easy integration
 */
export const CyberThemeToggle: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = true }) => {
  const { theme, toggleCyberpunk } = useCyberTheme();
  
  return (
    <button
      onClick={toggleCyberpunk}
      className={`
        px-4 py-2 rounded-md border transition-all duration-300
        ${theme.enabled 
          ? 'bg-cyber-cyan text-cyber-black border-cyber-cyan shadow-lg shadow-cyber-cyan/30' 
          : 'bg-gray-800 text-gray-200 border-gray-600 hover:border-gray-500'
        }
        ${className}
      `}
    >
      {showLabel && (
        <span className="mr-2">
          {theme.enabled ? 'Cyber Mode' : 'Standard Mode'}
        </span>
      )}
      <span className={theme.enabled ? 'animate-cyber-pulse' : ''}>
        {theme.enabled ? '◉' : '○'}
      </span>
    </button>
  );
};

export default CyberThemeProvider;