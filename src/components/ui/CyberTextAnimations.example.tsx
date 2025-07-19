'use client';

import React, { useState } from 'react';
import {
  CyberTextAnimations,
  TypingAnimation,
  MatrixText,
  CorruptionText,
  TerminalText,
  HolographicText,
  type CyberTheme,
  type IntensityLevel,
  type AnimationType
} from './CyberTextAnimations';

/**
 * Example component demonstrating all CyberTextAnimations features
 * This file serves as both documentation and testing for the animations
 */

export const CyberTextAnimationsDemo: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<CyberTheme>('cyan');
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel>(3);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('typing');

  const sampleText = 'SYSTEM ONLINE - NEURAL LINK ESTABLISHED';
  const sampleCommands = [
    'initialize --system',
    'scan --network',
    'connect --secure',
    'SYSTEM ONLINE - NEURAL LINK ESTABLISHED'
  ];

  return (
    <div className="p-8 space-y-8 bg-cyber-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cyber-heading text-cyber-neon-cyan mb-4">
            CyberTextAnimations Demo
          </h1>
          <p className="text-cyber-text-secondary font-cyber-body">
            Advanced cyberpunk text effects with configurable themes and intensity levels
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-cyber-panel rounded-lg border border-cyber-ui-border">
          <div>
            <label className="block text-cyber-text-primary font-cyber-body text-sm mb-2">
              Theme:
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value as CyberTheme)}
              className="w-full p-2 bg-cyber-darker text-cyber-text-primary border border-cyber-ui-border rounded font-cyber-body"
            >
              <option value="cyan">Cyan</option>
              <option value="magenta">Magenta</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
              <option value="matrix">Matrix</option>
            </select>
          </div>

          <div>
            <label className="block text-cyber-text-primary font-cyber-body text-sm mb-2">
              Intensity:
            </label>
            <select
              value={selectedIntensity}
              onChange={(e) => setSelectedIntensity(Number(e.target.value) as IntensityLevel)}
              className="w-full p-2 bg-cyber-darker text-cyber-text-primary border border-cyber-ui-border rounded font-cyber-body"
            >
              <option value={1}>1 - Subtle</option>
              <option value={2}>2 - Low</option>
              <option value={3}>3 - Medium</option>
              <option value={4}>4 - High</option>
              <option value={5}>5 - Extreme</option>
            </select>
          </div>

          <div>
            <label className="block text-cyber-text-primary font-cyber-body text-sm mb-2">
              Animation:
            </label>
            <select
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as AnimationType)}
              className="w-full p-2 bg-cyber-darker text-cyber-text-primary border border-cyber-ui-border rounded font-cyber-body"
            >
              <option value="typing">Typing</option>
              <option value="matrix">Matrix Rain</option>
              <option value="corruption">Data Corruption</option>
              <option value="terminal">Terminal</option>
              <option value="holographic">Holographic</option>
            </select>
          </div>
        </div>

        {/* Main Demo */}
        <div className="bg-cyber-darker p-6 rounded-lg border border-cyber-ui-border mb-8">
          <h3 className="text-cyber-text-primary font-cyber-heading text-lg mb-4">
            Main Component Demo:
          </h3>
          <div className="text-center">
            <CyberTextAnimations
              text={sampleText}
              animation={selectedAnimation}
              theme={selectedTheme}
              intensity={selectedIntensity}
              loop={true}
              key={`${selectedAnimation}-${selectedTheme}-${selectedIntensity}`}
            />
          </div>
        </div>

        {/* Individual Component Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Typing Animation */}
          <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-ui-border">
            <h4 className="text-cyber-neon-cyan font-cyber-heading mb-3">Typing Animation</h4>
            <TypingAnimation
              text="Initializing quantum processor..."
              theme="cyan"
              intensity={3}
              loop={true}
              typingSpeed={80}
              showCursor={true}
              cursorChar="█"
            />
          </div>

          {/* Corruption Text */}
          <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-ui-border">
            <h4 className="text-cyber-neon-magenta font-cyber-heading mb-3">Data Corruption</h4>
            <CorruptionText
              text="SECURE DATA TRANSMISSION"
              theme="magenta"
              intensity={4}
              loop={true}
              corruptionRate={0.4}
              stabilizeDelay={2000}
            />
          </div>

          {/* Terminal Text */}
          <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-ui-border">
            <h4 className="text-cyber-neon-green font-cyber-heading mb-3">Terminal Interface</h4>
            <TerminalText
              text="Access granted to mainframe"
              theme="green"
              intensity={3}
              commands={['sudo access --mainframe', 'authenticate --biometric', 'decrypt --neural']}
              loop={true}
              prompt="root@cyber:~$ "
            />
          </div>

          {/* Holographic Text */}
          <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-ui-border">
            <h4 className="text-cyber-neon-orange font-cyber-heading mb-3">Holographic Display</h4>
            <div className="text-center">
              <HolographicText
                text="NEURAL INTERFACE"
                theme="orange"
                intensity={5}
                loop={true}
                shimmerSpeed={1500}
                colorShift={true}
                distortionIntensity={1.5}
              />
            </div>
          </div>
        </div>

        {/* Matrix Rain Demo */}
        <div className="mt-8">
          <h4 className="text-cyber-neon-green font-cyber-heading mb-4 text-center">Matrix Digital Rain</h4>
          <div className="h-64 rounded-lg overflow-hidden border border-cyber-ui-border">
            <MatrixText
              text="THE MATRIX HAS YOU"
              theme="matrix"
              intensity={4}
              rainSpeed={80}
              density={0.9}
              cascadeHeight={25}
              loop={true}
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-cyber-darker p-6 rounded-lg border border-cyber-ui-border">
          <h3 className="text-cyber-text-primary font-cyber-heading text-lg mb-4">
            Usage Examples:
          </h3>
          <div className="space-y-4 font-cyber-body text-sm">
            <div className="bg-cyber-black p-3 rounded border border-cyber-ui-border">
              <p className="text-cyber-neon-cyan mb-2">Basic Usage:</p>
              <code className="text-cyber-text-secondary">
                {`<CyberTextAnimations 
  text="Your text here" 
  animation="typing" 
  theme="cyan" 
  intensity={3} 
/>`}
              </code>
            </div>
            
            <div className="bg-cyber-black p-3 rounded border border-cyber-ui-border">
              <p className="text-cyber-neon-magenta mb-2">Individual Components:</p>
              <code className="text-cyber-text-secondary">
                {`<TypingAnimation text="Hello World" theme="magenta" loop={true} />
<MatrixText text="THE MATRIX" theme="matrix" intensity={5} />
<HolographicText text="HOLOGRAM" theme="cyan" colorShift={true} />`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CyberTextAnimationsDemo;