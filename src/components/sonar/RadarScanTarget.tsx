'use client';

import { cn } from '@/lib/utils';

interface RadarScanTargetProps {
  size?: number;
  className?: string;
}

function SonarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="32" cy="32" r="28" stroke="#1AA4D9" strokeWidth="2" opacity="0.3" />
      <circle cx="32" cy="32" r="20" stroke="#1AA4D9" strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="32" r="12" stroke="#74E4FF" strokeWidth="1.5" opacity="0.7" />
      <circle cx="32" cy="32" r="4" fill="#74E4FF" />
      <line x1="32" y1="4" x2="32" y2="18" stroke="#1AA4D9" strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="46" x2="32" y2="60" stroke="#1AA4D9" strokeWidth="1" opacity="0.4" />
      <line x1="4" y1="32" x2="18" y2="32" stroke="#1AA4D9" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="32" x2="60" y2="32" stroke="#1AA4D9" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function RadarScanTarget({ size = 200, className }: RadarScanTargetProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Pulsing Detection Ring */}
        <div className="absolute inset-0 rounded-full">
          <div className="absolute inset-0 rounded-full border-2 border-sonar-signal/40 animate-sonar-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-sonar-signal/30 animate-sonar-pulse-delayed" />
        </div>

        {/* Rotating Radar Sweep */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-0 animate-radar-sweep"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(26, 164, 217, 0.3) 30deg, rgba(116, 228, 255, 0.6) 45deg, transparent 60deg)',
            }}
          />
        </div>

        {/* Corner Brackets */}
        <div className="absolute inset-0 opacity-80">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sonar-highlight animate-pulse" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-sonar-highlight animate-pulse" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-sonar-highlight animate-pulse" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sonar-highlight animate-pulse" />
        </div>

        {/* Sonar Icon with Glow */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-4/5 h-4/5">
            <div className="absolute inset-0 bg-sonar-signal/20 blur-xl animate-sonar-glow" />
            <SonarIcon className="relative z-10 w-full h-full drop-shadow-2xl" />
          </div>
        </div>

        {/* Center Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-sonar-highlight/60" />
            <div className="absolute left-1/2 top-1/4 bottom-1/4 w-px bg-sonar-highlight/60" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-sonar-signal animate-pulse" />
          </div>
        </div>

        {/* Expanding Detection Ping */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-sonar-signal/60 animate-ping-slow" />
        </div>
      </div>

      {/* Target Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="px-3 py-1 rounded-sonar bg-sonar-signal/20 border border-sonar-signal/40 backdrop-blur-sm">
          <span className="text-xs font-mono text-sonar-highlight tracking-wider">
            TARGET ACQUIRED
          </span>
        </div>
      </div>
    </div>
  );
}
