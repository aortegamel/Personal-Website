'use client';

import { GlassCard } from './GlassCard';
import { SignalBadge } from './SignalBadge';
import { SonarButton } from './SonarButton';
import { LoadingSpinner } from './LoadingSpinner';
import { WaveDivider } from './WaveDivider';
import { RadarScanTarget } from './RadarScanTarget';

function ShowcaseItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sonar bg-sonar-abyss/60 border border-white/5 p-6">
      <h3 className="text-sm font-mono uppercase tracking-radar text-sonar-highlight mb-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function ComponentShowcase() {
  return (
    <section className="bg-deepSea-deep/50 backdrop-blur-sm rounded-xl p-8 md:p-12 border border-abyss-400/20 shadow-2xl">
      <h2 className="text-2xl font-montserrat font-bold text-abyss-100 mb-8">
        Component Showcase
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* GlassCard */}
        <ShowcaseItem title="GlassCard">
          <GlassCard>Default glass card with content</GlassCard>
          <GlassCard glow>Glow variant with hover effect</GlassCard>
        </ShowcaseItem>

        {/* SignalBadge */}
        <ShowcaseItem title="SignalBadge">
          <div className="flex flex-wrap gap-2">
            <SignalBadge variant="info">Info</SignalBadge>
            <SignalBadge variant="success">Success</SignalBadge>
            <SignalBadge variant="warning">Warning</SignalBadge>
            <SignalBadge variant="danger">Danger</SignalBadge>
          </div>
        </ShowcaseItem>

        {/* SonarButton */}
        <ShowcaseItem title="SonarButton">
          <div className="flex flex-wrap gap-3">
            <SonarButton variant="primary">Primary</SonarButton>
            <SonarButton variant="secondary">Secondary</SonarButton>
            <SonarButton variant="danger">Danger</SonarButton>
          </div>
          <div>
            <SonarButton disabled>Disabled</SonarButton>
          </div>
        </ShowcaseItem>

        {/* LoadingSpinner */}
        <ShowcaseItem title="LoadingSpinner">
          <div className="flex items-center gap-6">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        </ShowcaseItem>

        {/* WaveDivider */}
        <ShowcaseItem title="WaveDivider">
          <WaveDivider />
        </ShowcaseItem>

        {/* RadarScanTarget */}
        <ShowcaseItem title="RadarScanTarget">
          <div className="flex justify-center pb-10">
            <RadarScanTarget size={160} />
          </div>
        </ShowcaseItem>
      </div>
    </section>
  );
}
