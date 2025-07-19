'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCyberTheme } from './CyberThemeProvider';

// Types for transition configurations
export interface TransitionConfig {
  duration?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

export interface GlitchTransitionConfig extends TransitionConfig {
  glitchCount?: number;
  colorShift?: boolean;
  scanlines?: boolean;
}

export interface DataLoadingConfig extends TransitionConfig {
  showPercentage?: boolean;
  showBytes?: boolean;
  animateChars?: boolean;
  loadingText?: string;
}

export interface BootSequenceConfig extends TransitionConfig {
  steps?: string[];
  showProgressBar?: boolean;
  showScanlines?: boolean;
  typewriter?: boolean;
}

export interface MaterializationConfig extends TransitionConfig {
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  pixelate?: boolean;
  glow?: boolean;
}

export interface ModalTransitionConfig extends TransitionConfig {
  backdrop?: boolean;
  scale?: boolean;
  fade?: boolean;
  glitch?: boolean;
}

// Hook for using transitions
export function useCyberTransitions() {
  const { theme } = useCyberTheme();
  
  const getThemeColor = useCallback(() => {
    switch (theme.theme) {
      case 'cyan': return '#00FFFF';
      case 'magenta': return '#FF00FF';
      case 'green': return '#00FF41';
      case 'orange': return '#FF6600';
      case 'matrix': return '#00FF41';
      default: return '#00FFFF';
    }
  }, [theme.theme]);

  const getIntensityMultiplier = useCallback(() => {
    return theme.enabled ? theme.intensity / 3 : 0.5;
  }, [theme.enabled, theme.intensity]);

  return {
    themeColor: getThemeColor(),
    intensityMultiplier: getIntensityMultiplier(),
    effectsEnabled: theme.enabled && theme.showGlitchEffects,
  };
}

// Glitch Page Transition Component
export interface GlitchTransitionProps {
  isActive: boolean;
  config?: GlitchTransitionConfig;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export const GlitchTransition: React.FC<GlitchTransitionProps> = ({
  isActive,
  config = {},
  onComplete,
  children,
}) => {
  const { themeColor, intensityMultiplier, effectsEnabled } = useCyberTransitions();
  const [phase, setPhase] = useState<'idle' | 'glitching' | 'complete'>('idle');
  const [glitchFrame, setGlitchFrame] = useState(0);
  
  const {
    duration = 800,
    intensity = 3,
    glitchCount = 6,
    colorShift = true,
    scanlines = true,
  } = config;

  const adjustedDuration = duration * intensityMultiplier;
  const glitchFrameTime = adjustedDuration / glitchCount;

  useEffect(() => {
    if (!isActive || !effectsEnabled) return;
    
    setPhase('glitching');
    
    const glitchInterval = setInterval(() => {
      setGlitchFrame(prev => prev + 1);
    }, glitchFrameTime);

    const completeTimer = setTimeout(() => {
      setPhase('complete');
      clearInterval(glitchInterval);
      onComplete?.();
    }, adjustedDuration);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(completeTimer);
    };
  }, [isActive, effectsEnabled, adjustedDuration, glitchFrameTime, onComplete]);

  if (!isActive && phase === 'idle') return <>{children}</>;

  const glitchStyle = {
    '--cyber-color': themeColor,
    '--glitch-intensity': intensity * intensityMultiplier,
  } as React.CSSProperties;

  return (
    <div 
      className={`
        relative overflow-hidden
        ${phase === 'glitching' ? 'animate-cyber-glitch' : ''}
      `}
      style={glitchStyle}
    >
      {/* Glitch overlay layers */}
      {phase === 'glitching' && (
        <>
          {/* Main glitch bars */}
          {Array.from({ length: glitchCount }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 bg-current opacity-20 mix-blend-screen"
              style={{
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
                backgroundColor: colorShift ? 
                  (glitchFrame % 2 === 0 ? '#ff0000' : themeColor) : 
                  themeColor,
                animation: `cyberFlicker ${glitchFrameTime}ms infinite`,
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
          
          {/* RGB color separation */}
          {colorShift && (
            <>
              <div 
                className="absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                  background: 'linear-gradient(90deg, transparent 30%, #ff0000 50%, transparent 70%)',
                  transform: `translateX(${Math.sin(glitchFrame * 0.5) * 10}px)`,
                }}
              />
              <div 
                className="absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                  background: `linear-gradient(90deg, transparent 20%, ${themeColor} 60%, transparent 80%)`,
                  transform: `translateX(${Math.cos(glitchFrame * 0.3) * -8}px)`,
                }}
              />
            </>
          )}

          {/* Scanlines */}
          {scanlines && (
            <div 
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
                animation: 'cyberScan 2s linear infinite',
              }}
            />
          )}

          {/* Digital noise overlay */}
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
              animation: 'cyberFlicker 0.1s infinite',
            }}
          />
        </>
      )}
      
      {children}
    </div>
  );
};

// Data Loading Animation Component
export interface DataLoadingProps {
  isLoading: boolean;
  progress: number; // 0-100
  config?: DataLoadingConfig;
  onComplete?: () => void;
}

export const DataLoading: React.FC<DataLoadingProps> = ({
  isLoading,
  progress,
  config = {},
  onComplete,
}) => {
  const { themeColor, intensityMultiplier } = useCyberTransitions();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [loadedBytes, setLoadedBytes] = useState(0);
  const [displayChars, setDisplayChars] = useState('');
  
  const {
    duration = 100,
    showPercentage = true,
    showBytes = true,
    animateChars = true,
    loadingText = 'INITIALIZING NEURAL INTERFACE',
  } = config;

  const totalBytes = 1024 * 1024 * 2.5; // 2.5MB simulation

  useEffect(() => {
    if (!isLoading) return;

    const targetProgress = Math.min(progress, 100);
    const progressDiff = targetProgress - animatedProgress;
    const step = progressDiff / (duration * intensityMultiplier);
    
    if (Math.abs(progressDiff) < 0.1) {
      setAnimatedProgress(targetProgress);
      if (targetProgress >= 100) {
        setTimeout(() => onComplete?.(), 500);
      }
      return;
    }

    const timer = setInterval(() => {
      setAnimatedProgress(prev => {
        const next = prev + step;
        return next >= targetProgress ? targetProgress : next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [progress, isLoading, animatedProgress, duration, intensityMultiplier, onComplete]);

  useEffect(() => {
    setLoadedBytes(Math.floor((animatedProgress / 100) * totalBytes));
  }, [animatedProgress, totalBytes]);

  useEffect(() => {
    if (!animateChars || !isLoading) return;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
    let currentText = '';
    const targetLength = Math.floor((animatedProgress / 100) * loadingText.length);
    
    const animateText = () => {
      const randomChars = Array.from({ length: Math.max(0, loadingText.length - targetLength) }, 
        () => chars[Math.floor(Math.random() * chars.length)]).join('');
      currentText = loadingText.slice(0, targetLength) + randomChars;
      setDisplayChars(currentText);
    };

    const interval = setInterval(animateText, 50);
    return () => clearInterval(interval);
  }, [animatedProgress, animateChars, isLoading, loadingText]);

  if (!isLoading) return null;

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div 
      className="font-cyber-body text-sm space-y-4"
      style={{ color: themeColor }}
    >
      {/* Loading Text */}
      {animateChars && (
        <div className="font-mono text-xs tracking-wider">
          {displayChars}
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="relative">
        <div 
          className="h-1 bg-cyber-dark rounded-full overflow-hidden border"
          style={{ borderColor: themeColor }}
        >
          <div 
            className="h-full transition-all duration-100 ease-out relative"
            style={{ 
              width: `${animatedProgress}%`,
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          >
            {/* Animated scanning line */}
            <div 
              className="absolute inset-y-0 right-0 w-1 opacity-80"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 20px ${themeColor}`,
                animation: 'cyber-pulse 1s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        {/* Progress indicators */}
        <div className="flex justify-between items-center mt-2 text-xs">
          {showPercentage && (
            <span className="font-mono">
              {animatedProgress.toFixed(1)}%
            </span>
          )}
          {showBytes && (
            <span className="font-mono">
              {formatBytes(loadedBytes)} / {formatBytes(totalBytes)}
            </span>
          )}
        </div>
      </div>

      {/* Data stream visualization */}
      <div className="flex space-x-1 h-8 items-end">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-1 bg-current rounded-t transition-all duration-150"
            style={{
              height: `${Math.random() * (animatedProgress / 5) + 10}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `cyber-pulse ${1 + Math.random()}s ease-in-out infinite`,
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Boot Sequence Animation Component
export interface BootSequenceProps {
  isActive: boolean;
  config?: BootSequenceConfig;
  onComplete?: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({
  isActive,
  config = {},
  onComplete,
}) => {
  const { themeColor, intensityMultiplier } = useCyberTransitions();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const {
    duration = 3000,
    steps = [
      'INITIALIZING QUANTUM CORE...',
      'LOADING NEURAL NETWORKS...',
      'ESTABLISHING SECURE CONNECTIONS...',
      'CALIBRATING INTERFACE PROTOCOLS...',
      'SYSTEM READY - WELCOME TO THE GRID',
    ],
    showProgressBar = true,
    showScanlines = true,
    typewriter = true,
  } = config;

  const stepDuration = (duration * intensityMultiplier) / steps.length;

  useEffect(() => {
    if (!isActive) return;

    const runBootSequence = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        if (typewriter) {
          const step = steps[i];
          for (let j = 0; j <= step.length; j++) {
            setCurrentText(step.slice(0, j));
            await new Promise(resolve => setTimeout(resolve, 30));
          }
          await new Promise(resolve => setTimeout(resolve, stepDuration - (step.length * 30)));
        } else {
          setCurrentText(steps[i]);
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
      }
      
      setTimeout(() => onComplete?.(), 500);
    };

    runBootSequence();
  }, [isActive, steps, stepDuration, typewriter, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  if (!isActive) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div 
      className="fixed inset-0 bg-cyber-black z-50 flex flex-col justify-center items-center font-cyber-body"
      style={{ color: themeColor }}
    >
      {/* Scanlines overlay */}
      {showScanlines && (
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.05) 2px, rgba(0,255,255,0.05) 4px)',
            animation: 'cyberScan 3s linear infinite',
          }}
        />
      )}

      {/* Main boot interface */}
      <div className="max-w-2xl w-full space-y-8 px-8">
        {/* System logo/header */}
        <div className="text-center">
          <div 
            className="text-4xl font-cyber-heading mb-4 animate-cyber-glow"
            style={{ textShadow: `0 0 20px ${themeColor}` }}
          >
            ◉ NEURAL INTERFACE ◉
          </div>
          <div className="text-sm opacity-80">
            Quantum OS v2.1.7 - Build 4089
          </div>
        </div>

        {/* Boot steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`
                flex items-center space-x-4 font-mono text-sm
                ${index < currentStep ? 'opacity-60' : ''}
                ${index === currentStep ? 'animate-cyber-pulse' : ''}
                ${index > currentStep ? 'opacity-30' : ''}
              `}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {index < currentStep ? (
                  <span style={{ color: themeColor }}>✓</span>
                ) : index === currentStep ? (
                  <div 
                    className="w-2 h-2 rounded-full animate-cyber-pulse"
                    style={{ backgroundColor: themeColor }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                )}
              </div>
              <div className="flex-1">
                {index === currentStep ? (
                  <>
                    {currentText}
                    {showCursor && <span className="animate-cyber-flicker">_</span>}
                  </>
                ) : (
                  step
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {showProgressBar && (
          <div className="space-y-2">
            <div 
              className="h-1 bg-cyber-dark rounded-full overflow-hidden border"
              style={{ borderColor: themeColor }}
            >
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: themeColor,
                  boxShadow: `0 0 10px ${themeColor}`,
                }}
              />
            </div>
            <div className="text-center text-xs font-mono">
              {progress.toFixed(0)}% COMPLETE
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Interface Materialization Effect Component
export interface MaterializationProps {
  isVisible: boolean;
  config?: MaterializationConfig;
  className?: string;
  children: React.ReactNode;
}

export const Materialization: React.FC<MaterializationProps> = ({
  isVisible,
  config = {},
  className = '',
  children,
}) => {
  const { themeColor, intensityMultiplier } = useCyberTransitions();
  const [phase, setPhase] = useState<'hidden' | 'materializing' | 'visible'>('hidden');
  const materialRef = useRef<HTMLDivElement>(null);
  
  const {
    duration = 800,
    direction = 'center',
    pixelate = true,
    glow = true,
  } = config;

  const adjustedDuration = duration * intensityMultiplier;

  useEffect(() => {
    if (isVisible && phase === 'hidden') {
      setPhase('materializing');
      const timer = setTimeout(() => {
        setPhase('visible');
      }, adjustedDuration);
      return () => clearTimeout(timer);
    } else if (!isVisible && phase === 'visible') {
      setPhase('materializing');
      const timer = setTimeout(() => {
        setPhase('hidden');
      }, adjustedDuration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, phase, adjustedDuration]);

  const getTransformOrigin = () => {
    switch (direction) {
      case 'top': return 'top center';
      case 'bottom': return 'bottom center';
      case 'left': return 'left center';
      case 'right': return 'right center';
      default: return 'center center';
    }
  };

  const getInitialTransform = () => {
    switch (direction) {
      case 'top': return 'translateY(-100%) scale(0.8)';
      case 'bottom': return 'translateY(100%) scale(0.8)';
      case 'left': return 'translateX(-100%) scale(0.8)';
      case 'right': return 'translateX(100%) scale(0.8)';
      default: return 'scale(0.1)';
    }
  };

  if (phase === 'hidden') return null;

  const materializationStyle = {
    '--cyber-color': themeColor,
    transformOrigin: getTransformOrigin(),
    transition: `all ${adjustedDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  } as React.CSSProperties;

  return (
    <div 
      ref={materialRef}
      className={`
        relative
        ${phase === 'materializing' ? 'animate-fade-in' : ''}
        ${className}
      `}
      style={{
        ...materializationStyle,
        transform: phase === 'materializing' ? 
          (isVisible ? 'translateX(0) translateY(0) scale(1)' : getInitialTransform()) :
          'translateX(0) translateY(0) scale(1)',
        opacity: phase === 'materializing' ? 
          (isVisible ? 1 : 0) : 1,
      }}
    >
      {/* Pixelation overlay */}
      {pixelate && phase === 'materializing' && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 50%, ${themeColor}20 50%),
              linear-gradient(0deg, transparent 50%, ${themeColor}20 50%)
            `,
            backgroundSize: '4px 4px',
            animation: `fade-${isVisible ? 'out' : 'in'} ${adjustedDuration}ms ease-out`,
          }}
        />
      )}

      {/* Glow effect */}
      {glow && phase === 'materializing' && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg opacity-50"
          style={{
            boxShadow: `
              0 0 20px ${themeColor}40,
              inset 0 0 20px ${themeColor}20
            `,
            animation: `cyber-glow ${adjustedDuration}ms ease-out`,
          }}
        />
      )}

      {children}
    </div>
  );
};

// Modal/Dialog Cyber Transition Component
export interface CyberModalProps {
  isOpen: boolean;
  config?: ModalTransitionConfig;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  config = {},
  onClose,
  className = '',
  children,
}) => {
  const { themeColor, intensityMultiplier } = useCyberTransitions();
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const modalRef = useRef<HTMLDivElement>(null);
  
  const {
    duration = 400,
    backdrop = true,
    scale = true,
    fade = true,
    glitch = false,
  } = config;

  const adjustedDuration = duration * intensityMultiplier;

  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('opening');
      const timer = setTimeout(() => setPhase('open'), adjustedDuration);
      return () => clearTimeout(timer);
    } else if (!isOpen && phase === 'open') {
      setPhase('closing');
      const timer = setTimeout(() => setPhase('closed'), adjustedDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, phase, adjustedDuration]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'open') {
        onClose?.();
      }
    };

    if (phase !== 'closed') {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [phase, onClose]);

  if (phase === 'closed') return null;

  const modalStyle = {
    '--cyber-color': themeColor,
    transition: `all ${adjustedDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  } as React.CSSProperties;

  const backdropStyle = {
    transition: `opacity ${adjustedDuration}ms ease-out`,
    opacity: phase === 'opening' || phase === 'open' ? 1 : 0,
  };

  const contentStyle = {
    transition: `all ${adjustedDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    transform: scale ? 
      (phase === 'opening' || phase === 'open' ? 'scale(1)' : 'scale(0.8)') :
      'scale(1)',
    opacity: fade ? 
      (phase === 'opening' || phase === 'open' ? 1 : 0) : 1,
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={modalStyle}
    >
      {/* Backdrop */}
      {backdrop && (
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          style={backdropStyle}
          onClick={onClose}
        />
      )}

      {/* Modal content */}
      <div 
        ref={modalRef}
        className={`
          relative max-w-lg w-full mx-4 bg-cyber-dark border rounded-lg overflow-hidden
          ${glitch && phase === 'opening' ? 'animate-cyber-glitch' : ''}
          ${className}
        `}
        style={{
          ...contentStyle,
          borderColor: themeColor,
          boxShadow: `0 0 30px ${themeColor}30`,
        }}
      >
        {/* Cyber border effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: `
              linear-gradient(90deg, transparent 49%, ${themeColor}40 50%, transparent 51%),
              linear-gradient(0deg, transparent 49%, ${themeColor}40 50%, transparent 51%)
            `,
            backgroundSize: '20px 20px',
            animation: phase === 'opening' ? 'cyber-scan 1s ease-out' : 'none',
          }}
        />

        {/* Glitch overlay for opening */}
        {glitch && phase === 'opening' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-x-0 bg-current opacity-30 mix-blend-screen"
                style={{
                  height: `${Math.random() * 5 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: i % 2 === 0 ? '#ff0000' : themeColor,
                  animation: `cyberFlicker ${200 + i * 100}ms infinite`,
                }}
              />
            ))}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

// Combined transition hook for easy usage
export function useCyberTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const startTransition = useCallback((type: 'glitch' | 'materialize' | 'boot', onComplete?: () => void) => {
    setIsTransitioning(true);
    
    // Default durations for different transition types
    const durations = {
      glitch: 800,
      materialize: 600,
      boot: 3000,
    };
    
    setTimeout(() => {
      setIsTransitioning(false);
      onComplete?.();
    }, durations[type]);
  }, []);

  return {
    isTransitioning,
    startTransition,
  };
}

export default {
  GlitchTransition,
  DataLoading,
  BootSequence,
  Materialization,
  CyberModal,
  useCyberTransitions,
  useCyberTransition,
};