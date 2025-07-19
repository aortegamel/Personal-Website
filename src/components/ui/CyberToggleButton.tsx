'use client';

import React from 'react';
import { useCyberTheme } from './CyberThemeProvider';
import { cn } from '@/lib/utils';

interface CyberToggleButtonProps {
  /**
   * Position of the floating button
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'none';
  /**
   * Whether to show as a floating button
   */
  floating?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show label text
   */
  showLabel?: boolean;
  /**
   * Custom label text
   */
  label?: {
    on: string;
    off: string;
  };
}

/**
 * CyberToggleButton Component
 * 
 * A visually prominent cyberpunk toggle button that can be placed anywhere.
 * Features animated transitions and clear visual feedback for the current state.
 */
export const CyberToggleButton: React.FC<CyberToggleButtonProps> = ({
  position = 'bottom-right',
  floating = true,
  className = '',
  showLabel = true,
  label = {
    on: 'Cyber Mode ON',
    off: 'Enable Cyber Mode'
  }
}) => {
  const { theme, toggleCyberpunk } = useCyberTheme();

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'none': ''
  };

  const baseClasses = cn(
    'group relative inline-flex items-center justify-center',
    'px-6 py-3 rounded-lg',
    'font-medium transition-all duration-300',
    'transform hover:scale-105',
    'cursor-pointer select-none',
    'backdrop-filter backdrop-blur-md',
    floating && position !== 'none' ? 'fixed z-50' : '',
    floating && position !== 'none' ? positionClasses[position] : '',
    className
  );

  const buttonClasses = theme.enabled
    ? cn(
        baseClasses,
        'bg-cyber-cyan/20 border-2 border-cyber-cyan',
        'text-cyber-cyan shadow-lg shadow-cyber-cyan/30',
        'hover:bg-cyber-cyan/30 hover:shadow-xl hover:shadow-cyber-cyan/50',
        'animate-cyber-pulse'
      )
    : cn(
        baseClasses,
        'bg-gray-900/80 border-2 border-gray-600',
        'text-gray-200 shadow-lg shadow-black/30',
        'hover:border-gray-500 hover:text-white hover:shadow-xl'
      );

  return (
    <button
      onClick={toggleCyberpunk}
      className={buttonClasses}
      aria-label={theme.enabled ? 'Disable cyberpunk mode' : 'Enable cyberpunk mode'}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        {theme.enabled && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/0 via-cyber-cyan/20 to-cyber-cyan/0 animate-cyber-scan" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent" />
          </>
        )}
      </div>

      {/* Icon */}
      <div className="relative flex items-center gap-3">
        <div className="relative w-6 h-6">
          {theme.enabled ? (
            // Cyber ON icon
            <svg 
              className="w-6 h-6 animate-spin-slow" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
              <circle cx="12" cy="10" r="3" strokeWidth={2} fill="none" />
            </svg>
          ) : (
            // Cyber OFF icon
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          )}
        </div>

        {/* Label */}
        {showLabel && (
          <span className="relative font-cyber-body text-sm font-medium">
            {theme.enabled ? label.on : label.off}
          </span>
        )}

        {/* Status Indicator */}
        <div className={cn(
          'relative w-3 h-3 rounded-full transition-all duration-300',
          theme.enabled 
            ? 'bg-cyber-green shadow-lg shadow-cyber-green/50 animate-cyber-pulse' 
            : 'bg-gray-500'
        )} />
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {theme.enabled && (
          <>
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyber-cyan" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyber-cyan" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyber-cyan" />
          </>
        )}
      </div>
    </button>
  );
};

/**
 * Compact version of the toggle button
 */
export const CyberToggleCompact: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { theme, toggleCyberpunk } = useCyberTheme();

  return (
    <button
      onClick={toggleCyberpunk}
      className={cn(
        'relative w-14 h-7 rounded-full transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        theme.enabled 
          ? 'bg-cyber-cyan/30 border border-cyber-cyan focus:ring-cyber-cyan' 
          : 'bg-gray-700 border border-gray-600 focus:ring-gray-500',
        className
      )}
      aria-label={theme.enabled ? 'Disable cyberpunk mode' : 'Enable cyberpunk mode'}
    >
      <div
        className={cn(
          'absolute top-0.5 left-0.5 w-6 h-6 rounded-full',
          'transform transition-all duration-300',
          'shadow-lg',
          theme.enabled 
            ? 'translate-x-7 bg-cyber-cyan shadow-cyber-cyan/50' 
            : 'translate-x-0 bg-gray-400'
        )}
      >
        {theme.enabled && (
          <div className="absolute inset-0 rounded-full animate-ping bg-cyber-cyan opacity-30" />
        )}
      </div>
    </button>
  );
};

export default CyberToggleButton;