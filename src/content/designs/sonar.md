---
name: 'Sonar Protocol Design System'
description: >-
  A comprehensive design system for an audio intelligence platform, built around
  an aquatic sonar theme with glass morphism, WebGL animations, and WCAG AAA
  compliant contrast ratios.
role: 'Lead Designer & Frontend Engineer'
project_url: https://projectsonar.xyz
github: https://github.com/Angleito/Sonar
design_stack:
  - Tailwind CSS
  - Framer Motion
  - Three.js
  - Radix UI
  - WaveSurfer.js
  - PostCSS
  - Next.js
color_palette:
  - name: Abyss
    hex: '#0A172A'
  - name: Deep
    hex: '#092E4D'
  - name: Blue
    hex: '#0E4B6F'
  - name: Signal
    hex: '#1AA4D9'
  - name: Highlight
    hex: '#74E4FF'
  - name: Highlight Bright
    hex: '#B8F0FF'
  - name: Coral
    hex: '#FF6B4A'
design_elements:
  - Glass morphism panels with backdrop blur
  - WebGL sonar shader animations
  - Radar sweep and pulse effects
  - Canvas waveform visualizations
  - Mouse-interactive wave deflection
  - Skeleton shimmer loading states
  - Conic gradient depth backgrounds
  - Noise texture overlays
highlights:
  - WCAG AAA compliant text contrast
  - 53 production components
  - Full reduced motion support with CSS fallbacks
  - WebGL detection with graceful degradation
  - Lazy-loaded Framer Motion for performance
  - Custom vertex and fragment shaders
  - Intersection Observer animation pausing
  - IBM Plex Mono and Inter typography system
---

## Design Approach

The Sonar design system draws from deep-sea sonar and radar imagery to create an immersive audio intelligence interface. Every element reinforces the aquatic metaphor -- from the cyan glow effects that simulate sonar pings to the layered glass panels that evoke looking through submersible viewports.

### Visual Language

The palette moves from the near-black Abyss through progressively lighter blues, landing on Signal cyan as the primary interactive color. Coral serves as the sole warm accent for warnings and destructive actions, creating clear visual hierarchy without competing with the cool-tone foundation.

Glass morphism is the dominant surface treatment. Panels use `backdrop-blur-[24px]` with semi-transparent backgrounds and subtle white borders, producing depth without hard edges. This layering makes the interface feel dimensional while keeping content readable.

### Motion & Animation

Three tiers of animation serve different purposes:

**Ambient** -- Sonar pulses, radar sweeps, and waveform undulations run continuously via custom WebGL shaders and canvas rendering. These establish atmosphere without demanding attention.

**Interactive** -- Hover glows, scale transitions, and button state changes use Framer Motion with spring physics. Response times stay under 300ms to feel immediate.

**Informational** -- Skeleton loaders, progress bars, and streaming indicators communicate system state. These use CSS animations for reliability and reduced JavaScript overhead.

All animations respect `prefers-reduced-motion`. WebGL canvases hide entirely, replaced by static SVG fallbacks. CSS animations reduce to near-zero duration. The interface remains fully functional without motion.

### Component Architecture

The 53-component library spans UI primitives (GlassCard, SonarButton, SignalBadge), animation components (SonarScanner, SonicWaveformHero, RadarScanTarget), and feature-specific compositions (AudioPlayer, DatasetCard, LeaderboardTable).

Components follow a composition pattern -- small, focused units that combine into complex layouts. The GlassCard accepts variant props for different blur intensities and border treatments. SonarButton supports primary, secondary, and danger variants with consistent glow behavior.

### Accessibility

Contrast ratios drove color selection. Highlight Bright (#B8F0FF) was specifically chosen for WCAG AAA compliance on dark backgrounds, ensuring body text remains readable across all glass panel opacities. Focus rings use the Signal color with offset for visibility against both light and dark surfaces.

### Performance

WebGL pixel ratios are capped at 2x. Antialiasing disables on high-DPI screens. Intersection Observer pauses off-screen animations. Framer Motion loads via `LazyMotion` to reduce initial bundle size. These optimizations keep the interface fluid on mid-range hardware while maintaining the full visual experience on capable devices.
