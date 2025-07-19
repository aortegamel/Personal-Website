'use client';

import React, { useState } from 'react';
import { 
  CyberpunkEffects,
  GlitchText,
  CyberButton,
  CyberPanel,
  CyberHUD,
  CyberParticleButton,
  CyberParticleField
} from '@/components/ui';

interface CyberpunkDemoProps {
  /**
   * Whether to enable cyberpunk mode
   */
  enabled?: boolean;
  /**
   * Theme for cyberpunk effects
   */
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  /**
   * Intensity of effects (1-5)
   */
  intensity?: 1 | 2 | 3 | 4 | 5;
}

/**
 * CyberpunkDemo Component
 * 
 * Comprehensive demonstration of how to integrate all cyberpunk elements
 * into a cohesive interface. Shows proper layering, theming, and interaction
 * between different cyberpunk components.
 * 
 * Features:
 * - Complete cyberpunk layout with HUD, panels, and effects
 * - Theme switching and intensity controls
 * - Proper z-index layering and performance considerations
 * - Integration examples for all cyberpunk components
 * - Responsive design with mobile considerations
 */
export const CyberpunkDemo: React.FC<CyberpunkDemoProps> = ({
  enabled = true,
  theme = 'cyan',
  intensity = 3,
}) => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [showHUD, setShowHUD] = useState(true);
  const [showParticles, setShowParticles] = useState(true);

  if (!enabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Standard Interface</h1>
          <p className="text-gray-300">Cyberpunk effects are disabled.</p>
        </div>
      </div>
    );
  }

  const themes = ['cyan', 'magenta', 'green', 'orange', 'matrix'] as const;

  const hudSections = [
    {
      id: 'user-stats',
      title: 'USER STATS',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">Level</span>
            <span className="text-cyber-cyan">42</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">XP</span>
            <span className="text-cyber-cyan">8,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-text-secondary">Rank</span>
            <span className="text-cyber-cyan">ELITE</span>
          </div>
        </div>
      ),
      position: 'bottom-left' as const,
    },
    {
      id: 'mission-data',
      title: 'MISSION DATA',
      content: (
        <div className="space-y-2">
          <div className="text-cyber-green text-sm">OBJECTIVE: COMPLETE</div>
          <div className="text-cyber-orange text-sm">WARNING: DETECTED</div>
          <div className="text-cyber-cyan text-sm">STATUS: ACTIVE</div>
        </div>
      ),
      position: 'bottom-right' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden">
      {/* Background Particle Field */}
      {showParticles && (
        <CyberParticleField
          className="absolute inset-0"
          theme={currentTheme}
          intensity={currentIntensity}
          particleCount={40}
          showDataFlow={true}
          showTerminalNodes={true}
          showScannerNodes={currentIntensity > 3}
        />
      )}

      {/* Global Cyberpunk Effects */}
      <CyberpunkEffects
        enabled={true}
        theme={currentTheme}
        intensity={currentIntensity}
        showScanlines={true}
        showGrid={currentIntensity > 2}
        showHUD={false} // We'll use custom HUD below
      />

      {/* HUD Overlay */}
      {showHUD && (
        <CyberHUD
          enabled={true}
          theme={currentTheme}
          sections={hudSections}
          showSystemStatus={true}
          showDataReadouts={true}
          showCornerOverlays={true}
        />
      )}

      {/* Main Content */}
      <div className="relative z-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="mb-12 text-center">
            <GlitchText
              as="h1"
              className="text-6xl font-cyber-heading text-cyber-cyan mb-4"
              intensity={currentIntensity}
              enabled={true}
            >
              CYBERPUNK INTERFACE
            </GlitchText>
            <p className="text-cyber-text-secondary font-cyber-body text-lg">
              Deep Sea Cyberpunk • Neural Network Active • System Online
            </p>
          </header>

          {/* Control Panel */}
          <CyberPanel
            variant="hud"
            size="lg"
            className="mb-8"
            title="SYSTEM CONTROLS"
            subtitle="Configure interface parameters"
            status="online"
            showCorners={true}
            showScanline={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-cyber-text-secondary font-cyber-body text-sm mb-3">
                  COLOR THEME
                </label>
                <div className="space-y-2">
                  {themes.map((themeOption) => (
                    <CyberButton
                      key={themeOption}
                      variant={currentTheme === themeOption ? 'cyber-filled' : 'cyber-ghost'}
                      size="sm"
                      onClick={() => setCurrentTheme(themeOption)}
                      className="w-full justify-start"
                    >
                      {themeOption.toUpperCase()}
                    </CyberButton>
                  ))}
                </div>
              </div>

              {/* Intensity Control */}
              <div>
                <label className="block text-cyber-text-secondary font-cyber-body text-sm mb-3">
                  INTENSITY LEVEL
                </label>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <CyberButton
                      key={level}
                      variant={currentIntensity === level ? 'cyber-filled' : 'cyber-ghost'}
                      size="sm"
                      onClick={() => setCurrentIntensity(level as 1 | 2 | 3 | 4 | 5)}
                      intensity={level > 3 ? 'high' : 'low'}
                      className="w-full"
                    >
                      LEVEL {level}
                    </CyberButton>
                  ))}
                </div>
              </div>

              {/* Effect Toggles */}
              <div>
                <label className="block text-cyber-text-secondary font-cyber-body text-sm mb-3">
                  EFFECT TOGGLES
                </label>
                <div className="space-y-2">
                  <CyberButton
                    variant={showHUD ? 'cyber-green' : 'cyber-ghost'}
                    size="sm"
                    onClick={() => setShowHUD(!showHUD)}
                    className="w-full"
                  >
                    HUD {showHUD ? 'ON' : 'OFF'}
                  </CyberButton>
                  <CyberButton
                    variant={showParticles ? 'cyber-green' : 'cyber-ghost'}
                    size="sm"
                    onClick={() => setShowParticles(!showParticles)}
                    className="w-full"
                  >
                    PARTICLES {showParticles ? 'ON' : 'OFF'}
                  </CyberButton>
                </div>
              </div>
            </div>
          </CyberPanel>

          {/* Feature Showcase Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Typography Panel */}
            <CyberPanel
              variant="neon"
              title="TYPOGRAPHY"
              status="active"
              showCorners={true}
            >
              <div className="space-y-4">
                <div className="font-cyber-heading text-cyber-cyan">
                  Orbitron Heading Font
                </div>
                <div className="font-cyber-body text-cyber-text-primary">
                  Roboto Mono Body Text
                </div>
                <GlitchText className="text-cyber-magenta" intensity={2}>
                  Glitch Text Effect
                </GlitchText>
              </div>
            </CyberPanel>

            {/* Interactive Elements */}
            <CyberPanel
              variant="matrix"
              title="INTERACTIVE"
              status="active"
              glitch="subtle"
            >
              <div className="space-y-4">
                <CyberParticleButton
                  theme={currentTheme}
                  intensity={currentIntensity}
                  className="w-full"
                >
                  <CyberButton variant="cyber" size="sm" className="w-full">
                    PARTICLE BUTTON
                  </CyberButton>
                </CyberParticleButton>
                
                <CyberButton
                  variant="cyber-magenta"
                  size="sm"
                  className="w-full"
                  showCorners={true}
                  intensity="medium"
                >
                  HUD BUTTON
                </CyberButton>
              </div>
            </CyberPanel>

            {/* Data Display */}
            <CyberPanel
              variant="alert"
              title="DATA STREAM"
              status="warning"
              corners="medium"
            >
              <div className="space-y-2 font-cyber-body text-sm">
                <div className="flex justify-between">
                  <span>BANDWIDTH:</span>
                  <span className="text-cyber-green">98.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>LATENCY:</span>
                  <span className="text-cyber-cyan">12ms</span>
                </div>
                <div className="flex justify-between">
                  <span>FIREWALL:</span>
                  <span className="text-cyber-orange">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span>ENCRYPTION:</span>
                  <span className="text-cyber-green">256-BIT</span>
                </div>
              </div>
            </CyberPanel>
          </div>

          {/* Integration Instructions */}
          <CyberPanel
            variant="default"
            size="lg"
            title="INTEGRATION GUIDE"
            subtitle="How to apply cyberpunk elements to your interface"
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-cyber-cyan font-cyber-heading text-lg mb-4">
                  Basic Implementation
                </h3>
                <pre className="bg-cyber-black/50 p-4 rounded border border-cyber-ui text-cyber-text-primary font-cyber-body text-sm overflow-x-auto">
{`// Wrap your app with cyberpunk effects
<CyberpunkEffects theme="cyan" intensity={3}>
  <YourContent />
</CyberpunkEffects>

// Add HUD overlay
<CyberHUD 
  enabled={true}
  showSystemStatus={true}
  sections={customSections}
/>`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-cyber-cyan font-cyber-heading text-lg mb-4">
                  Component Usage
                </h3>
                <pre className="bg-cyber-black/50 p-4 rounded border border-cyber-ui text-cyber-text-primary font-cyber-body text-sm overflow-x-auto">
{`// Replace standard components
<CyberButton variant="cyber">
  Action Button
</CyberButton>

<CyberPanel variant="hud" title="Panel">
  Content here
</CyberPanel>

<GlitchText intensity={3}>
  Animated Text
</GlitchText>`}
                </pre>
              </div>
            </div>
          </CyberPanel>
        </div>
      </div>
    </div>
  );
};

export default CyberpunkDemo;