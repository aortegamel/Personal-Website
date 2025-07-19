import React from 'react';
import { cn } from '@/lib/utils';
import Section from '../layout/Section';
import { 
  CyberpunkEffects, 
  GlitchText, 
  CyberButton, 
  CyberParticleButton,
  CyberParticleField 
} from '../ui';

interface CyberHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  /**
   * Cyberpunk theme
   */
  theme?: 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
  /**
   * Effect intensity (1-5)
   */
  intensity?: 1 | 2 | 3 | 4 | 5;
  /**
   * Whether to enable cyberpunk mode
   */
  cyberpunkMode?: boolean;
  /**
   * Whether to show particle field background
   */
  showParticles?: boolean;
  /**
   * Whether to show HUD elements
   */
  showHUD?: boolean;
}

/**
 * CyberHero Component
 * 
 * Enhanced hero section demonstrating how to transform existing components
 * with cyberpunk aesthetics while maintaining functionality and accessibility.
 * 
 * This component shows:
 * - Graceful fallback to standard styling when cyberpunk mode is disabled
 * - Integration of multiple cyberpunk effects in a cohesive design
 * - Responsive design that works on all devices
 * - Performance considerations for complex animations
 * - Proper z-index layering for complex layouts
 */
export default function CyberHero({
  title,
  description,
  ctaText = 'Learn More',
  ctaLink = '#',
  theme = 'cyan',
  intensity = 3,
  cyberpunkMode = false,
  showParticles = true,
  showHUD = false,
  className,
  ...props
}: CyberHeroProps) {
  // Standard hero for non-cyberpunk mode
  if (!cyberpunkMode) {
    return (
      <Section 
        className={cn(
          'bg-gradient-to-b from-gray-50 to-white',
          className
        )}
        align="center"
      >
        <div 
          className="container mx-auto px-4 py-16 text-center"
          {...props}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            {title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {description}
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {ctaText}
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section 
      className={cn(
        'relative min-h-screen bg-cyber-black overflow-hidden',
        className
      )}
      align="center"
    >
      {/* Background Particle Field */}
      {showParticles && (
        <div className="absolute inset-0">
          <CyberParticleField
            theme={theme}
            intensity={intensity}
            particleCount={Math.min(30 + intensity * 10, 80)}
            showDataFlow={true}
            showTerminalNodes={intensity > 2}
            showScannerNodes={intensity > 4}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Global Cyberpunk Effects */}
      <CyberpunkEffects
        enabled={true}
        theme={theme}
        intensity={intensity}
        showScanlines={intensity > 1}
        showGrid={intensity > 2}
        showHUD={showHUD}
      />

      {/* HUD Corner Elements */}
      {showHUD && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Top corners */}
          <div className="absolute top-8 left-8">
            <div className="w-12 h-12 border-l-2 border-t-2 border-cyber-cyan opacity-60" />
            <div className="absolute top-2 left-2 w-2 h-2 bg-cyber-cyan rounded-full animate-cyber-pulse" />
          </div>
          <div className="absolute top-8 right-8">
            <div className="w-12 h-12 border-r-2 border-t-2 border-cyber-cyan opacity-60" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyber-cyan rounded-full animate-cyber-pulse" />
          </div>
          
          {/* Status indicators */}
          <div className="absolute top-20 left-8">
            <div className="bg-cyber-black/80 backdrop-blur-md border border-cyber-ui rounded p-3">
              <div className="text-xs font-cyber-heading text-cyber-cyan mb-1">SYSTEM</div>
              <div className="text-xs font-cyber-body text-cyber-text-primary">ONLINE</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className={cn(
          'relative z-20 container mx-auto px-4 py-16 text-center',
          'flex flex-col items-center justify-center min-h-screen'
        )}
        {...props}
      >
        {/* Pre-title indicator */}
        <div className="mb-6 font-cyber-body text-cyber-text-secondary text-sm tracking-wider">
          {'>'} INITIALIZING NEURAL INTERFACE
        </div>

        {/* Main Title with Glitch Effect */}
        <GlitchText
          as="h1"
          className={cn(
            'text-4xl md:text-6xl lg:text-7xl font-cyber-heading font-bold mb-6',
            'text-cyber-cyan text-center max-w-4xl'
          )}
          intensity={Math.min(intensity, 3)} // Keep text readable
          enabled={true}
          frequency={4000} // Less frequent glitches for readability
        >
          {title}
        </GlitchText>

        {/* Subtitle */}
        <div className="relative mb-8">
          <p className="text-lg md:text-xl text-cyber-text-primary max-w-3xl mx-auto font-cyber-body leading-relaxed">
            {description}
          </p>
          
          {/* Animated underline */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-cyber-pulse" />
        </div>

        {/* Data readout */}
        <div className="mb-8 grid grid-cols-3 gap-8 text-center">
          <div className="font-cyber-body">
            <div className="text-cyber-cyan text-2xl font-bold">99.7%</div>
            <div className="text-cyber-text-secondary text-sm">UPTIME</div>
          </div>
          <div className="font-cyber-body">
            <div className="text-cyber-green text-2xl font-bold">SECURE</div>
            <div className="text-cyber-text-secondary text-sm">STATUS</div>
          </div>
          <div className="font-cyber-body">
            <div className="text-cyber-magenta text-2xl font-bold">ACTIVE</div>
            <div className="text-cyber-text-secondary text-sm">MODE</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Primary CTA with Particle Effect */}
          <CyberParticleButton
            theme={theme}
            intensity={intensity}
            showDataStream={true}
            showGlitchEffect={intensity > 3}
            onClick={() => window.location.href = ctaLink}
          >
            <CyberButton
              variant="cyber-filled"
              size="lg"
              showCorners={true}
              showScanline={true}
              className="px-8 py-4"
            >
              {ctaText}
            </CyberButton>
          </CyberParticleButton>

          {/* Secondary CTA */}
          <CyberButton
            variant="cyber-ghost"
            size="lg"
            className="px-8 py-4"
            intensity="low"
          >
            VIEW DOCUMENTATION
          </CyberButton>
        </div>

        {/* Terminal-style prompt */}
        <div className="mt-12 font-cyber-body text-cyber-text-secondary text-sm">
          <span className="text-cyber-green">$</span> user@system:~# initialize_interface --mode=cyberpunk
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-cyber-text-secondary">
            <div className="text-xs font-cyber-body mb-2">SCROLL TO EXPLORE</div>
            <div className="w-px h-8 bg-gradient-to-b from-cyber-cyan to-transparent animate-cyber-pulse" />
          </div>
        </div>
      </div>

      {/* Additional atmospheric effects for high intensity */}
      {intensity > 4 && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Data streams */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent animate-cyber-scan opacity-30" />
          <div className="absolute bottom-1/4 right-0 w-full h-px bg-gradient-to-l from-transparent via-cyber-magenta to-transparent animate-cyber-scan opacity-30" style={{ animationDelay: '1s' }} />
          
          {/* Floating code fragments */}
          <div className="absolute top-1/3 right-10 text-cyber-green font-cyber-body text-xs opacity-60 animate-cyber-flicker">
            {'{'} "status": "connected" {'}'}
          </div>
          <div className="absolute bottom-1/3 left-10 text-cyber-cyan font-cyber-body text-xs opacity-60 animate-cyber-flicker" style={{ animationDelay: '0.5s' }}>
            [NEURAL_LINK_ESTABLISHED]
          </div>
        </div>
      )}
    </Section>
  );
}