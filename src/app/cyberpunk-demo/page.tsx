'use client';

import React from 'react';
import { 
  CyberToggleButton, 
  CyberToggleCompact,
  useCyberTheme,
  GlitchText,
  CyberPanel,
  CyberButton
} from '@/components/ui';

export default function CyberpunkDemoPage() {
  const { theme } = useCyberTheme();

  return (
    <div className="min-h-screen py-12">
      {/* Floating Toggle Button (always visible) */}
      <CyberToggleButton 
        position="bottom-right" 
        floating={true}
        showLabel={true}
      />

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          {theme.enabled ? (
            <GlitchText 
              as="h1" 
              className="text-5xl font-cyber-heading text-cyber-cyan"
              intensity={3}
            >
              CYBERPUNK MODE ACTIVE
            </GlitchText>
          ) : (
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Cyberpunk Demo Page
            </h1>
          )}
          
          <p className={theme.enabled ? 'text-cyber-text-primary font-cyber-body' : 'text-gray-600 dark:text-gray-300'}>
            Toggle the cyberpunk mode using any of the buttons below
          </p>
        </div>

        {/* Toggle Button Showcase */}
        <CyberPanel 
          variant={theme.enabled ? 'hud' : 'default'}
          title="Toggle Button Options"
          subtitle="Different ways to add the cyberpunk toggle to your site"
          showCorners={theme.enabled}
          className="space-y-8"
        >
          {/* Standard Toggle Buttons */}
          <div className="space-y-4">
            <h3 className={theme.enabled ? 'text-cyber-cyan font-cyber-heading' : 'text-xl font-semibold'}>
              Standard Toggle Buttons
            </h3>
            
            <div className="flex flex-wrap gap-4 items-center">
              <CyberToggleButton 
                floating={false} 
                showLabel={true}
                className="relative"
              />
              
              <CyberToggleButton 
                floating={false} 
                showLabel={false}
                className="relative"
              />
              
              <CyberToggleCompact />
            </div>
          </div>

          {/* Custom Labels */}
          <div className="space-y-4">
            <h3 className={theme.enabled ? 'text-cyber-cyan font-cyber-heading' : 'text-xl font-semibold'}>
              Custom Labels
            </h3>
            
            <div className="flex flex-wrap gap-4 items-center">
              <CyberToggleButton 
                floating={false} 
                label={{
                  on: 'Deactivate Cyber Mode',
                  off: 'Activate Cyber Mode'
                }}
                className="relative"
              />
              
              <CyberToggleButton 
                floating={false} 
                label={{
                  on: 'Matrix ON',
                  off: 'Enter the Matrix'
                }}
                className="relative"
              />
            </div>
          </div>

          {/* Usage Code */}
          <div className="space-y-4">
            <h3 className={theme.enabled ? 'text-cyber-cyan font-cyber-heading' : 'text-xl font-semibold'}>
              Implementation Code
            </h3>
            
            <pre className={`
              p-4 rounded-lg overflow-x-auto text-sm
              ${theme.enabled 
                ? 'bg-cyber-black/50 border border-cyber-ui text-cyber-text-primary font-cyber-body' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
              }
            `}>
{`// Floating button (bottom-right corner)
<CyberToggleButton 
  position="bottom-right" 
  floating={true}
  showLabel={true}
/>

// Inline button with custom label
<CyberToggleButton 
  floating={false}
  label={{
    on: 'Cyber Mode ON',
    off: 'Enable Cyber Mode'
  }}
/>

// Compact toggle switch
<CyberToggleCompact />

// Access theme state
const { theme, toggleCyberpunk } = useCyberTheme();`}
            </pre>
          </div>
        </CyberPanel>

        {/* Current Theme Info */}
        <CyberPanel 
          variant={theme.enabled ? 'neon' : 'default'}
          title="Current Theme Settings"
          showCorners={theme.enabled}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className={theme.enabled ? 'text-cyber-text-secondary font-cyber-body text-sm' : 'text-gray-500 text-sm'}>
                Mode
              </p>
              <p className={theme.enabled ? 'text-cyber-cyan font-cyber-heading text-lg' : 'text-xl font-semibold'}>
                {theme.enabled ? 'CYBER' : 'STANDARD'}
              </p>
            </div>
            
            <div className="text-center">
              <p className={theme.enabled ? 'text-cyber-text-secondary font-cyber-body text-sm' : 'text-gray-500 text-sm'}>
                Theme
              </p>
              <p className={theme.enabled ? 'text-cyber-cyan font-cyber-heading text-lg' : 'text-xl font-semibold'}>
                {theme.theme.toUpperCase()}
              </p>
            </div>
            
            <div className="text-center">
              <p className={theme.enabled ? 'text-cyber-text-secondary font-cyber-body text-sm' : 'text-gray-500 text-sm'}>
                Intensity
              </p>
              <p className={theme.enabled ? 'text-cyber-cyan font-cyber-heading text-lg' : 'text-xl font-semibold'}>
                {theme.intensity}/5
              </p>
            </div>
            
            <div className="text-center">
              <p className={theme.enabled ? 'text-cyber-text-secondary font-cyber-body text-sm' : 'text-gray-500 text-sm'}>
                Effects
              </p>
              <p className={theme.enabled ? 'text-cyber-cyan font-cyber-heading text-lg' : 'text-xl font-semibold'}>
                {theme.showScanlines ? 'ON' : 'OFF'}
              </p>
            </div>
          </div>
        </CyberPanel>

        {/* Example Buttons */}
        <div className="text-center space-y-4">
          <p className={theme.enabled ? 'text-cyber-text-primary font-cyber-body' : 'text-gray-600 dark:text-gray-300'}>
            See how standard buttons transform in cyber mode:
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {theme.enabled ? (
              <>
                <CyberButton variant="cyber" size="lg">
                  Cyber Button
                </CyberButton>
                <CyberButton variant="cyber-magenta" size="lg">
                  Magenta Button
                </CyberButton>
                <CyberButton variant="cyber-green" size="lg">
                  Matrix Button
                </CyberButton>
              </>
            ) : (
              <>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Standard Button
                </button>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Purple Button
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Green Button
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}