'use client';

import React from 'react';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function ShowcasePage() {
  return (
    <div className="min-h-screen p-8 space-y-8 scrollbar-abyss">
      {/* Hero Section */}
      <section className="hero-gradient text-center py-16 px-8 rounded-2xl underwater">
        <h1 className="display-1 text-gradient-ocean mb-4">Abyss Theme Showcase</h1>
        <p className="lead text-abyss-100">
          Experience the deep ocean styling with Bitcoin accents
        </p>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-gradient-bitcoin mb-8">Card Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <AnimatedCard variant="default" hoverEffect="float">
            <h3 className="text-2xl font-semibold mb-2">Default Card</h3>
            <p className="text-secondary">
              A standard card with float animation on hover. Uses the base surface colors.
            </p>
            <button className="bitcoin-button mt-4">Learn More</button>
          </AnimatedCard>

          {/* Abyss Card */}
          <AnimatedCard variant="abyss" hoverEffect="glow" animationDelay={100}>
            <h3 className="text-2xl font-semibold mb-2 text-gradient-abyss">Abyss Card</h3>
            <p className="text-secondary">
              Deep ocean themed card with glow effect and subtle patterns.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="badge badge-ocean">Ocean</span>
              <span className="badge badge-bitcoin">Bitcoin</span>
            </div>
          </AnimatedCard>

          {/* Ocean Card */}
          <AnimatedCard variant="ocean" hoverEffect="scale" animationDelay={200}>
            <h3 className="text-2xl font-semibold mb-2 text-gradient-ocean">Ocean Card</h3>
            <p className="text-secondary">
              Ocean variant with wave effects and scale animation.
            </p>
            <button className="abyss-button mt-4">Dive Deeper</button>
          </AnimatedCard>

          {/* Glass Card */}
          <AnimatedCard variant="glass" hoverBorder={true} animationDelay={300}>
            <h3 className="text-2xl font-semibold mb-2">Glass Morphism</h3>
            <p className="text-secondary">
              Transparent glass effect with animated border on hover.
            </p>
            <div className="mt-4">
              <span className="bitcoin-accent">Premium Feature</span>
            </div>
          </AnimatedCard>

          {/* Modern Card with Mouse Glow */}
          <AnimatedCard 
            variant="abyss" 
            mouseGlow={true} 
            scrollAnimation="slideUp" 
            animationDelay={400}
          >
            <h3 className="text-2xl font-semibold mb-2">Interactive Glow</h3>
            <p className="text-secondary">
              Move your mouse over this card to see the glow follow your cursor.
            </p>
            <div className="flex gap-2 mt-4">
              <button className="btn-ghost">Cancel</button>
              <button className="bitcoin-button bitcoin-pulse">Confirm</button>
            </div>
          </AnimatedCard>

          {/* Loading State Card */}
          <AnimatedCard variant="default" animationDelay={500}>
            <h3 className="text-2xl font-semibold mb-4">Loading States</h3>
            <div className="space-y-3">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
            <div className="mt-4">
              <div className="loader-ocean">
                <div></div>
                <div></div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-gradient-bitcoin mb-8">Button Styles</h2>
        
        <div className="flex flex-wrap gap-4">
          <button className="bitcoin-button">Bitcoin Primary</button>
          <button className="abyss-button">Abyss Button</button>
          <button className="btn-abyss bg-gradient-ocean">Ocean Gradient</button>
          <button className="btn-ghost">Ghost Button</button>
          <button className="bitcoin-button bitcoin-shine">With Shine Effect</button>
        </div>
      </section>

      {/* Typography Section */}
      <section className="card-glass space-y-6">
        <h2 className="text-4xl font-bold text-gradient-bitcoin mb-8">Typography</h2>
        
        <div className="space-y-4">
          <h1 className="display-1 text-gradient-ocean">Display Heading</h1>
          <h2 className="text-4xl">Heading Level 2</h2>
          <h3 className="text-3xl text-gradient-abyss">Gradient Heading</h3>
          
          <p className="lead">
            This is a lead paragraph with larger text for emphasis. Perfect for introductions.
          </p>
          
          <p>
            Regular paragraph text with <a href="#" className="abyss-link">inline links</a> and 
            <span className="bitcoin-accent"> accent text</span>. You can also use 
            <code>inline code</code> for technical content.
          </p>
          
          <blockquote>
            "The abyss gazes also into you" - A famous quote styled with our blockquote design.
          </blockquote>
        </div>
      </section>

      {/* Form Elements */}
      <section className="abyss-section space-y-6">
        <h2 className="text-4xl font-bold text-gradient-bitcoin mb-8">Form Elements</h2>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              className="abyss-input w-full" 
              placeholder="satoshi@bitcoin.org"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              className="abyss-input w-full h-24 resize-none" 
              placeholder="Dive into the abyss..."
            />
          </div>
          
          <div className="flex gap-4">
            <button className="bitcoin-button">Send to the Depths</button>
            <button className="btn-ghost">Cancel</button>
          </div>
        </div>
      </section>

      {/* Special Effects */}
      <section className="space-y-6">
        <h2 className="text-4xl font-bold text-gradient-bitcoin mb-8">Special Effects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-abyss ocean-wave">
            <h3 className="text-2xl font-semibold mb-2">Ocean Wave Effect</h3>
            <p className="text-secondary">
              This card has a rotating ocean wave effect in the background.
            </p>
          </div>
          
          <div className="card-glass bitcoin-shine">
            <h3 className="text-2xl font-semibold mb-2">Bitcoin Shine</h3>
            <p className="text-secondary">
              A golden shine sweeps across this card periodically.
            </p>
          </div>
          
          <div className="card gradient-shift bg-gradient-ocean text-white">
            <h3 className="text-2xl font-semibold mb-2">Gradient Animation</h3>
            <p>
              The background gradient shifts continuously for a dynamic effect.
            </p>
          </div>
          
          <div className="card-modern underwater">
            <h3 className="text-2xl font-semibold mb-2">Underwater Effect</h3>
            <p className="text-secondary">
              Creates a subtle underwater atmosphere with animated opacity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}