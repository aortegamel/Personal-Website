'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HUDSection {
  id: string;
  title: string;
  content: React.ReactNode;
  status?: 'active' | 'inactive' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface CyberHUDProps {
  /**
   * Whether the HUD is enabled
   */
  enabled?: boolean;
  /**
   * HUD sections to display
   */
  sections?: HUDSection[];
  /**
   * Whether to show system status
   */
  showSystemStatus?: boolean;
  /**
   * Whether to show data readouts
   */
  showDataReadouts?: boolean;
  /**
   * Whether to show corner overlays
   */
  showCornerOverlays?: boolean;
  /**
   * HUD color theme
   */
  theme?: 'cyan' | 'green' | 'orange' | 'magenta';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Main content to display inside HUD
   */
  children?: React.ReactNode;
}

/**
 * CyberHUD Component
 * 
 * Creates a comprehensive heads-up display overlay with multiple information panels.
 * Designed to provide a complete cyberpunk interface experience.
 * 
 * Features:
 * - Multiple positioned information sections
 * - System status indicators and data readouts
 * - Corner overlays and scan lines
 * - Configurable color themes
 * - Responsive layout with proper z-indexing
 */
export const CyberHUD: React.FC<CyberHUDProps> = ({
  enabled = true,
  sections = [],
  showSystemStatus = true,
  showDataReadouts = true,
  showCornerOverlays = true,
  theme = 'cyan',
  className = '',
  children,
}) => {
  if (!enabled) {
    return children ? <>{children}</> : null;
  }

  const themeColors = {
    cyan: {
      primary: 'text-cyber-cyan',
      border: 'border-cyber-cyan',
      glow: 'shadow-cyber-cyan/30',
    },
    green: {
      primary: 'text-cyber-green',
      border: 'border-cyber-green',
      glow: 'shadow-cyber-green/30',
    },
    orange: {
      primary: 'text-cyber-orange',
      border: 'border-cyber-orange',
      glow: 'shadow-cyber-orange/30',
    },
    magenta: {
      primary: 'text-cyber-magenta',
      border: 'border-cyber-magenta',
      glow: 'shadow-cyber-magenta/30',
    },
  };

  const colors = themeColors[theme];

  // Default system status data
  const systemStatus = [
    { label: 'SYSTEM', value: 'ONLINE', status: 'active' },
    { label: 'POWER', value: '98%', status: 'active' },
    { label: 'TEMP', value: '42°C', status: 'active' },
    { label: 'NET', value: 'CONNECTED', status: 'active' },
  ];

  // Default data readouts
  const dataReadouts = [
    { label: 'TIMESTAMP', value: new Date().toLocaleTimeString() },
    { label: 'USER_ID', value: 'ADMIN_001' },
    { label: 'SESSION', value: '24:18:32' },
    { label: 'PROTOCOLS', value: 'ACTIVE' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      {children}

      {/* HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Corner Overlays */}
        {showCornerOverlays && (
          <>
            {/* Top Left Corner */}
            <div className="absolute top-4 left-4">
              <div className={`w-16 h-16 ${colors.border} border-l-2 border-t-2 opacity-60`} />
              <div className={`absolute top-2 left-2 w-2 h-2 ${colors.primary} animate-cyber-pulse`}>
                <div className={`w-full h-full bg-current rounded-full`} />
              </div>
            </div>

            {/* Top Right Corner */}
            <div className="absolute top-4 right-4">
              <div className={`w-16 h-16 ${colors.border} border-r-2 border-t-2 opacity-60`} />
              <div className={`absolute top-2 right-2 w-2 h-2 ${colors.primary} animate-cyber-pulse`}>
                <div className={`w-full h-full bg-current rounded-full`} />
              </div>
            </div>

            {/* Bottom Left Corner */}
            <div className="absolute bottom-4 left-4">
              <div className={`w-16 h-16 ${colors.border} border-l-2 border-b-2 opacity-60`} />
              <div className={`absolute bottom-2 left-2 w-2 h-2 ${colors.primary} animate-cyber-pulse`}>
                <div className={`w-full h-full bg-current rounded-full`} />
              </div>
            </div>

            {/* Bottom Right Corner */}
            <div className="absolute bottom-4 right-4">
              <div className={`w-16 h-16 ${colors.border} border-r-2 border-b-2 opacity-60`} />
              <div className={`absolute bottom-2 right-2 w-2 h-2 ${colors.primary} animate-cyber-pulse`}>
                <div className={`w-full h-full bg-current rounded-full`} />
              </div>
            </div>
          </>
        )}

        {/* System Status Panel - Top Left */}
        {showSystemStatus && (
          <div className="absolute top-20 left-4 pointer-events-auto">
            <div className={`
              bg-cyber-black/80 backdrop-blur-md border ${colors.border}
              rounded-md p-3 min-w-[200px] ${colors.glow} shadow-lg
            `}>
              <div className={`text-xs font-cyber-heading ${colors.primary} mb-2 tracking-wider`}>
                SYSTEM STATUS
              </div>
              <div className="space-y-1">
                {systemStatus.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs font-cyber-body text-cyber-text-secondary">
                      {item.label}
                    </span>
                    <span className={`text-xs font-cyber-body ${
                      item.status === 'active' ? colors.primary : 'text-cyber-orange'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Readouts Panel - Top Right */}
        {showDataReadouts && (
          <div className="absolute top-20 right-4 pointer-events-auto">
            <div className={`
              bg-cyber-black/80 backdrop-blur-md border ${colors.border}
              rounded-md p-3 min-w-[200px] ${colors.glow} shadow-lg
            `}>
              <div className={`text-xs font-cyber-heading ${colors.primary} mb-2 tracking-wider`}>
                DATA READOUTS
              </div>
              <div className="space-y-1">
                {dataReadouts.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs font-cyber-body text-cyber-text-secondary">
                      {item.label}
                    </span>
                    <span className={`text-xs font-cyber-body ${colors.primary}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {sections.map((section, index) => {
          const positionClasses = {
            'top-left': 'top-4 left-4',
            'top-right': 'top-4 right-4',
            'bottom-left': 'bottom-4 left-4',
            'bottom-right': 'bottom-4 right-4',
          };

          return (
            <div
              key={section.id}
              className={`absolute ${positionClasses[section.position || 'top-left']} pointer-events-auto`}
              style={{ transform: `translate(0, ${index * 60}px)` }}
            >
              <div className={`
                bg-cyber-black/80 backdrop-blur-md border ${colors.border}
                rounded-md p-3 ${colors.glow} shadow-lg
              `}>
                <div className={`text-xs font-cyber-heading ${colors.primary} mb-2 tracking-wider`}>
                  {section.title}
                </div>
                <div className="text-cyber-text-primary">
                  {section.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Center scan line */}
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2">
          <div className={`
            h-px bg-gradient-to-r from-transparent via-current to-transparent
            ${colors.primary} opacity-30 animate-cyber-scan
          `} />
        </div>
      </div>
    </div>
  );
};

export default CyberHUD;