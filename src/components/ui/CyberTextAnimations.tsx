'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * CyberTextAnimations - Advanced cyberpunk text effects component
 * 
 * Features:
 * - Typing animation with cursor blink
 * - Matrix-style digital rain text
 * - Data corruption/scramble effects
 * - Terminal command line effects
 * - Holographic text shimmer
 * 
 * Supports configurable themes (cyan, magenta, green, orange, matrix)
 * and intensity levels (1-5) using existing cyberpunk CSS variables
 */

// ============================
// TYPE DEFINITIONS
// ============================

export type CyberTheme = 'cyan' | 'magenta' | 'green' | 'orange' | 'matrix';
export type IntensityLevel = 1 | 2 | 3 | 4 | 5;
export type AnimationType = 'typing' | 'matrix' | 'corruption' | 'terminal' | 'holographic';

export interface CyberTextAnimationProps {
  text: string;
  animation: AnimationType;
  theme?: CyberTheme;
  intensity?: IntensityLevel;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
  autoStart?: boolean;
  children?: React.ReactNode;
}

export interface TypingAnimationProps extends Omit<CyberTextAnimationProps, 'animation'> {
  showCursor?: boolean;
  cursorChar?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export interface MatrixTextProps extends Omit<CyberTextAnimationProps, 'animation'> {
  rainSpeed?: number;
  density?: number;
  characters?: string;
  cascadeHeight?: number;
}

export interface CorruptionTextProps extends Omit<CyberTextAnimationProps, 'animation'> {
  corruptionRate?: number;
  glitchChars?: string;
  stabilizeDelay?: number;
  corruptionDuration?: number;
}

export interface TerminalTextProps extends Omit<CyberTextAnimationProps, 'animation'> {
  prompt?: string;
  commands?: string[];
  commandDelay?: number;
  showInput?: boolean;
}

export interface HolographicTextProps extends Omit<CyberTextAnimationProps, 'animation'> {
  shimmerSpeed?: number;
  waveAmplitude?: number;
  colorShift?: boolean;
  distortionIntensity?: number;
}

// ============================
// UTILITY FUNCTIONS
// ============================

const getThemeColors = (theme: CyberTheme, intensity: IntensityLevel) => {
  const baseColors = {
    cyan: {
      primary: 'var(--cyber-neon-cyan)',
      secondary: 'var(--cyber-neon-cyan-light)',
      glow: 'var(--glow-cyber-cyan)',
      text: 'rgba(0, 255, 255, 0.9)'
    },
    magenta: {
      primary: 'var(--cyber-neon-magenta)',
      secondary: 'var(--cyber-neon-magenta-light)',
      glow: 'var(--glow-cyber-magenta)',
      text: 'rgba(255, 0, 255, 0.9)'
    },
    green: {
      primary: 'var(--cyber-neon-green)',
      secondary: 'var(--cyber-neon-green-light)',
      glow: 'var(--glow-cyber-green)',
      text: 'rgba(0, 255, 65, 0.9)'
    },
    orange: {
      primary: 'var(--cyber-neon-orange)',
      secondary: 'var(--cyber-neon-orange-light)',
      glow: 'var(--glow-cyber-orange)',
      text: 'rgba(255, 102, 0, 0.9)'
    },
    matrix: {
      primary: 'var(--cyber-neon-green)',
      secondary: 'var(--cyber-neon-cyan)',
      glow: 'var(--glow-cyber-green)',
      text: 'rgba(0, 255, 65, 0.9)'
    }
  };

  const colors = baseColors[theme];
  const intensityMultiplier = intensity / 5;

  return {
    ...colors,
    glowIntensity: `rgba(${colors.text.slice(5, -4)}, ${0.3 * intensityMultiplier})`,
    textShadow: `0 0 ${5 * intensityMultiplier}px ${colors.primary}`
  };
};

const getRandomChar = (charset?: string): string => {
  const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const chars = charset || defaultChars;
  return chars[Math.floor(Math.random() * chars.length)];
};

const getMatrixChars = (): string => {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
};

// ============================
// TYPING ANIMATION COMPONENT
// ============================

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  theme = 'cyan',
  intensity = 3,
  speed = 1,
  showCursor = true,
  cursorChar = '█',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 1500,
  className = '',
  onComplete,
  loop = false,
  autoStart = true,
  ...props
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursorBlink, setShowCursorBlink] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const colors = getThemeColors(theme, intensity);

  const typeText = useCallback(() => {
    if (!autoStart) return;

    let currentIndex = 0;
    const targetText = text;

    const type = () => {
      if (currentIndex < targetText.length) {
        setDisplayText(targetText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(type, typingSpeed / speed);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
        
        if (loop) {
          timeoutRef.current = setTimeout(() => {
            deleteText();
          }, pauseDuration);
        }
      }
    };

    const deleteText = () => {
      if (currentIndex > 0) {
        setDisplayText(targetText.slice(0, currentIndex - 1));
        currentIndex--;
        timeoutRef.current = setTimeout(deleteText, deletingSpeed / speed);
      } else {
        setIsTyping(true);
        setIsComplete(false);
        timeoutRef.current = setTimeout(type, pauseDuration / 2);
      }
    };

    type();
  }, [text, typingSpeed, deletingSpeed, pauseDuration, speed, loop, onComplete, autoStart]);

  useEffect(() => {
    typeText();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [typeText]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursorBlink(prev => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, []);

  const cursorStyle = {
    color: colors.primary,
    textShadow: colors.textShadow,
    opacity: showCursorBlink ? 1 : 0,
    transition: 'opacity 0.1s ease-in-out'
  };

  return (
    <span 
      className={`font-cyber-body ${className}`}
      style={{
        color: colors.text,
        textShadow: colors.textShadow,
        fontFamily: 'var(--font-cyber-body)'
      }}
      {...props}
    >
      {displayText}
      {showCursor && (
        <span style={cursorStyle}>
          {cursorChar}
        </span>
      )}
    </span>
  );
};

// ============================
// MATRIX RAIN ANIMATION COMPONENT
// ============================

export const MatrixText: React.FC<MatrixTextProps> = ({
  text,
  theme = 'matrix',
  intensity = 4,
  rainSpeed = 100,
  density = 0.8,
  cascadeHeight = 20,
  className = '',
  onComplete,
  loop = true,
  autoStart = true,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isComplete, setIsComplete] = useState(false);
  const colors = getThemeColors(theme, intensity);

  useEffect(() => {
    if (!autoStart) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fontSize = 14 * intensity / 3;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);
    const matrixChars = getMatrixChars();

    let textIndex = 0;
    let isShowingText = false;
    let textStartTime = 0;

    const draw = (timestamp: number) => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = `rgba(13, 13, 26, ${0.1 + (intensity * 0.02)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px var(--font-cyber-body)`;

      // Draw matrix rain
      for (let i = 0; i < drops.length; i++) {
        let char = getRandomChar(matrixChars);
        let brightness = Math.random();
        
        // Determine color based on position and randomness
        if (brightness > 0.98) {
          ctx.fillStyle = colors.secondary; // Brightest chars
          ctx.shadowColor = colors.primary;
          ctx.shadowBlur = 10 * intensity;
        } else if (brightness > 0.7) {
          ctx.fillStyle = colors.primary; // Main color
          ctx.shadowColor = colors.primary;
          ctx.shadowBlur = 5 * intensity;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${brightness * 0.5})`; // Fading chars
          ctx.shadowBlur = 0;
        }

        // Show actual text characters in center columns occasionally
        if (i >= columns / 3 && i <= (2 * columns) / 3 && Math.random() > 0.95 && textIndex < text.length) {
          char = text[textIndex];
          textIndex = (textIndex + 1) % text.length;
          ctx.fillStyle = colors.secondary;
          ctx.shadowColor = colors.primary;
          ctx.shadowBlur = 15 * intensity;
          isShowingText = true;
          textStartTime = timestamp;
        }

        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset drop when it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > (1 - density)) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Complete animation after showing text for a while
      if (isShowingText && timestamp - textStartTime > 3000) {
        setIsComplete(true);
        onComplete?.();
        if (!loop) {
          return;
        }
        isShowingText = false;
        textIndex = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const startTime = performance.now();
    const animate = (timestamp: number) => {
      if (timestamp - startTime >= rainSpeed / (speed || 1)) {
        draw(timestamp);
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, theme, intensity, rainSpeed, density, cascadeHeight, speed, loop, onComplete, autoStart]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden bg-cyber-black ${className}`}
      style={{ minHeight: '200px', fontFamily: 'var(--font-cyber-body)' }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'var(--cyber-black)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="text-2xl font-cyber-heading"
          style={{
            color: colors.secondary,
            textShadow: `0 0 20px ${colors.primary}`,
            opacity: isComplete ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ============================
// CORRUPTION ANIMATION COMPONENT
// ============================

export const CorruptionText: React.FC<CorruptionTextProps> = ({
  text,
  theme = 'cyan',
  intensity = 3,
  speed = 1,
  corruptionRate = 0.3,
  glitchChars = '█▓▒░!@#$%^&*(){}[]<>?/\\|~`',
  stabilizeDelay = 2000,
  corruptionDuration = 100,
  className = '',
  onComplete,
  loop = false,
  autoStart = true,
  ...props
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isCorrupting, setIsCorrupting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const colors = getThemeColors(theme, intensity);

  const corruptText = useCallback(() => {
    if (!autoStart) return;

    setIsCorrupting(true);
    setIsComplete(false);

    const originalText = text;
    let corruptionCycles = 0;
    const maxCycles = Math.floor((stabilizeDelay / corruptionDuration) * speed);

    intervalRef.current = setInterval(() => {
      const corruptedText = originalText
        .split('')
        .map(char => {
          if (Math.random() < corruptionRate * (intensity / 5)) {
            return getRandomChar(glitchChars);
          }
          return char;
        })
        .join('');

      setDisplayText(corruptedText);
      corruptionCycles++;

      if (corruptionCycles >= maxCycles) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        
        // Gradually stabilize text
        let stabilizationSteps = 0;
        const stabilizeInterval = setInterval(() => {
          const stabilizedText = originalText
            .split('')
            .map((char, index) => {
              const stabilizeChance = (stabilizationSteps / 10) + (index / originalText.length);
              if (Math.random() < stabilizeChance) {
                return char;
              }
              return getRandomChar(glitchChars);
            })
            .join('');

          setDisplayText(stabilizedText);
          stabilizationSteps++;

          if (stabilizationSteps >= 10) {
            clearInterval(stabilizeInterval);
            setDisplayText(originalText);
            setIsCorrupting(false);
            setIsComplete(true);
            onComplete?.();

            if (loop) {
              timeoutRef.current = setTimeout(corruptText, 3000);
            }
          }
        }, corruptionDuration / speed);
      }
    }, corruptionDuration / speed);
  }, [text, corruptionRate, glitchChars, stabilizeDelay, corruptionDuration, speed, intensity, loop, onComplete, autoStart]);

  useEffect(() => {
    corruptText();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [corruptText]);

  return (
    <span 
      className={`font-cyber-body ${className}`}
      style={{
        color: isCorrupting ? colors.primary : colors.text,
        textShadow: isCorrupting ? 
          `0 0 ${10 * intensity}px ${colors.primary}, 0 0 ${20 * intensity}px ${colors.primary}` : 
          colors.textShadow,
        transition: 'all 0.1s ease-in-out',
        fontFamily: 'var(--font-cyber-body)'
      }}
      {...props}
    >
      {displayText}
    </span>
  );
};

// ============================
// TERMINAL ANIMATION COMPONENT
// ============================

export const TerminalText: React.FC<TerminalTextProps> = ({
  text,
  theme = 'green',
  intensity = 3,
  speed = 1,
  prompt = '> ',
  commands = [],
  commandDelay = 1500,
  showInput = true,
  className = '',
  onComplete,
  loop = false,
  autoStart = true,
  ...props
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [commandIndex, setCommandIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const colors = getThemeColors(theme, intensity);

  const executeCommand = useCallback((command: string) => {
    return new Promise<void>((resolve) => {
      let charIndex = 0;
      
      const typeCommand = () => {
        if (charIndex < command.length) {
          setCurrentLine(command.slice(0, charIndex + 1));
          charIndex++;
          timeoutRef.current = setTimeout(typeCommand, 100 / speed);
        } else {
          // Command typed, add to lines and clear current
          timeoutRef.current = setTimeout(() => {
            setLines(prev => [...prev, prompt + command]);
            setCurrentLine('');
            resolve();
          }, commandDelay / speed);
        }
      };

      typeCommand();
    });
  }, [prompt, commandDelay, speed]);

  const runTerminalSequence = useCallback(async () => {
    if (!autoStart) return;

    setLines([]);
    setCurrentLine('');
    setCommandIndex(0);
    setIsComplete(false);

    // Add initial system message
    setLines(['CYBER_TERMINAL v2.1.1 initialized...', '']);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Execute commands
    const allCommands = commands.length > 0 ? commands : [text];
    
    for (let i = 0; i < allCommands.length; i++) {
      setCommandIndex(i);
      await executeCommand(allCommands[i]);
      
      // Add command output if it's the main text
      if (i === allCommands.length - 1) {
        setLines(prev => [...prev, text]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsComplete(true);
    onComplete?.();

    if (loop) {
      timeoutRef.current = setTimeout(runTerminalSequence, 3000);
    }
  }, [text, commands, executeCommand, loop, onComplete, autoStart]);

  useEffect(() => {
    runTerminalSequence();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [runTerminalSequence]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div 
      className={`font-cyber-body text-sm ${className}`}
      style={{
        backgroundColor: 'var(--cyber-black)',
        border: `1px solid ${colors.primary}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        boxShadow: colors.glow,
        fontFamily: 'var(--font-cyber-body)',
        minHeight: '150px'
      }}
      {...props}
    >
      <div className="mb-2 text-xs" style={{ color: colors.secondary }}>
        CYBER_TERMINAL
      </div>
      
      {lines.map((line, index) => (
        <div 
          key={index} 
          className="mb-1"
          style={{ 
            color: line.startsWith(prompt) ? colors.primary : colors.text,
            textShadow: line.startsWith(prompt) ? colors.textShadow : 'none'
          }}
        >
          {line}
        </div>
      ))}
      
      {showInput && !isComplete && (
        <div style={{ color: colors.primary, textShadow: colors.textShadow }}>
          {prompt}{currentLine}
          <span style={{ opacity: showCursor ? 1 : 0 }}>█</span>
        </div>
      )}
    </div>
  );
};

// ============================
// HOLOGRAPHIC ANIMATION COMPONENT
// ============================

export const HolographicText: React.FC<HolographicTextProps> = ({
  text,
  theme = 'cyan',
  intensity = 4,
  speed = 1,
  shimmerSpeed = 2000,
  waveAmplitude = 2,
  colorShift = true,
  distortionIntensity = 1,
  className = '',
  onComplete,
  loop = true,
  autoStart = true,
  ...props
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number>();
  const colors = getThemeColors(theme, intensity);

  useEffect(() => {
    if (!autoStart) return;

    const element = textRef.current;
    if (!element) return;

    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Shimmer effect
      const shimmerProgress = (elapsed % shimmerSpeed) / shimmerSpeed;
      const shimmerOffset = shimmerProgress * 200 - 100;

      // Wave distortion
      const waveOffset = Math.sin(elapsed * 0.005 * speed) * waveAmplitude * distortionIntensity;

      // Color shifting
      const hueShift = colorShift ? Math.sin(elapsed * 0.003 * speed) * 30 : 0;

      // Glitch effect
      const glitchIntensity = Math.random() > 0.98 ? Math.random() * intensity : 0;
      const glitchX = glitchIntensity * (Math.random() - 0.5) * 10;
      const glitchY = glitchIntensity * (Math.random() - 0.5) * 2;

      element.style.transform = `translateX(${waveOffset + glitchX}px) translateY(${glitchY}px)`;
      element.style.filter = `
        hue-rotate(${hueShift}deg) 
        brightness(${1 + glitchIntensity * 0.5})
        blur(${glitchIntensity * 0.5}px)
      `;
      
      element.style.background = `
        linear-gradient(
          90deg, 
          transparent ${shimmerOffset}%, 
          ${colors.secondary} ${shimmerOffset + 10}%, 
          transparent ${shimmerOffset + 20}%
        )
      `;
      element.style.backgroundClip = 'text';
      element.style.webkitBackgroundClip = 'text';

      // Multiple text shadows for holographic effect
      const shadows = [
        `0 0 ${5 * intensity}px ${colors.primary}`,
        `${glitchX}px ${glitchY}px ${10 * intensity}px ${colors.secondary}`,
        `${-glitchX}px ${-glitchY}px ${15 * intensity}px ${colors.primary}`,
        `0 0 ${30 * intensity}px ${colors.glowIntensity}`
      ];
      element.style.textShadow = shadows.join(', ');

      if (elapsed > 5000 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }

      if (loop || !isComplete) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme, intensity, speed, shimmerSpeed, waveAmplitude, colorShift, distortionIntensity, loop, onComplete, autoStart, colors, isComplete]);

  return (
    <span 
      ref={textRef}
      className={`font-cyber-display inline-block ${className}`}
      style={{
        color: colors.text,
        fontFamily: 'var(--font-cyber-display)',
        fontSize: `${1 + intensity * 0.2}em`,
        fontWeight: 'bold',
        position: 'relative',
        display: 'inline-block',
        willChange: 'transform, filter, text-shadow'
      }}
      {...props}
    >
      {text}
    </span>
  );
};

// ============================
// MAIN COMPONENT
// ============================

export const CyberTextAnimations: React.FC<CyberTextAnimationProps> = ({
  animation,
  ...props
}) => {
  switch (animation) {
    case 'typing':
      return <TypingAnimation {...props} />;
    case 'matrix':
      return <MatrixText {...props} />;
    case 'corruption':
      return <CorruptionText {...props} />;
    case 'terminal':
      return <TerminalText {...props} />;
    case 'holographic':
      return <HolographicText {...props} />;
    default:
      return <TypingAnimation {...props} />;
  }
};

// Export individual components for direct use
export {
  TypingAnimation,
  MatrixText,
  CorruptionText,
  TerminalText,
  HolographicText
};

export default CyberTextAnimations;