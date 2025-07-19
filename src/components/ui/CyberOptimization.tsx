import { useEffect, useRef, useState, useCallback } from 'react';

// Types
interface PerformanceMetrics {
  fps: number;
  memory: number;
  batteryLevel: number | null;
  reducedMotion: boolean;
}

interface AnimationQuality {
  particleCount: number;
  updateFrequency: number;
  glowIntensity: number;
  shadowQuality: 'low' | 'medium' | 'high';
  enableComplexEffects: boolean;
}

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    batteryLevel: null,
    reducedMotion: false,
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  
  // FPS monitoring
  useEffect(() => {
    let animationId: number;
    
    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        fpsHistory.current.push(fps);
        
        // Keep only last 5 measurements
        if (fpsHistory.current.length > 5) {
          fpsHistory.current.shift();
        }
        
        // Average FPS over history
        const avgFps = Math.round(
          fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length
        );
        
        setMetrics(prev => ({ ...prev, fps: avgFps }));
        
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  // Memory monitoring
  useEffect(() => {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const usedMemoryMB = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memory: usedMemoryMB }));
      };
      
      const interval = setInterval(checkMemory, 2000);
      return () => clearInterval(interval);
    }
  }, []);
  
  // Battery monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setMetrics(prev => ({ 
            ...prev, 
            batteryLevel: Math.round(battery.level * 100) 
          }));
        };
        
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        
        return () => battery.removeEventListener('levelchange', updateBattery);
      });
    }
  }, []);
  
  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMetrics(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    
    setMetrics(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return metrics;
};

// Animation quality adjustment hook
export const useAnimationQuality = () => {
  const metrics = usePerformanceMonitor();
  const [quality, setQuality] = useState<AnimationQuality>({
    particleCount: 100,
    updateFrequency: 60,
    glowIntensity: 1,
    shadowQuality: 'high',
    enableComplexEffects: true,
  });
  
  useEffect(() => {
    const { fps, batteryLevel, reducedMotion, memory } = metrics;
    
    // Reduced motion takes priority
    if (reducedMotion) {
      setQuality({
        particleCount: 0,
        updateFrequency: 0,
        glowIntensity: 0.2,
        shadowQuality: 'low',
        enableComplexEffects: false,
      });
      return;
    }
    
    // Battery-aware adjustments
    if (batteryLevel !== null && batteryLevel < 20) {
      setQuality({
        particleCount: 20,
        updateFrequency: 30,
        glowIntensity: 0.5,
        shadowQuality: 'low',
        enableComplexEffects: false,
      });
      return;
    }
    
    // FPS-based adjustments
    if (fps < 30) {
      setQuality({
        particleCount: 30,
        updateFrequency: 30,
        glowIntensity: 0.6,
        shadowQuality: 'low',
        enableComplexEffects: false,
      });
    } else if (fps < 45) {
      setQuality({
        particleCount: 60,
        updateFrequency: 45,
        glowIntensity: 0.8,
        shadowQuality: 'medium',
        enableComplexEffects: false,
      });
    } else {
      // High performance
      setQuality({
        particleCount: 100,
        updateFrequency: 60,
        glowIntensity: 1,
        shadowQuality: 'high',
        enableComplexEffects: true,
      });
    }
    
    // Memory-based adjustments
    if (memory > 500) {
      setQuality(prev => ({
        ...prev,
        particleCount: Math.min(prev.particleCount, 50),
        enableComplexEffects: false,
      }));
    }
  }, [metrics]);
  
  return quality;
};

// Canvas memory cleanup utility
export const useCanvasCleanup = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const cleanup = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Reset transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear any patterns or gradients
        ctx.fillStyle = 'transparent';
        ctx.strokeStyle = 'transparent';
      }
      
      // Force garbage collection hint
      canvasRef.current.width = canvasRef.current.width;
    }
  }, [canvasRef]);
  
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);
  
  return cleanup;
};

// Mobile performance detection
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };
    
    // Detect low-end device
    const checkPerformance = () => {
      const lowEnd = 
        navigator.hardwareConcurrency <= 2 || 
        (window.devicePixelRatio || 1) > 2 ||
        ('connection' in navigator && 
         (navigator as any).connection.effectiveType &&
         ['slow-2g', '2g', '3g'].includes((navigator as any).connection.effectiveType));
      
      setIsLowEnd(!!lowEnd);
    };
    
    checkMobile();
    checkPerformance();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile, isLowEnd };
};

// Performance debugging component
export const PerformanceDebugger: React.FC<{ show?: boolean }> = ({ show = false }) => {
  const metrics = usePerformanceMonitor();
  const quality = useAnimationQuality();
  const { isMobile, isLowEnd } = useMobileOptimization();
  
  if (!show) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-4 rounded-lg font-mono text-xs z-50 backdrop-blur">
      <h3 className="text-sm font-bold mb-2">Performance Monitor</h3>
      <div className="space-y-1">
        <div>FPS: {metrics.fps}</div>
        <div>Memory: {metrics.memory}MB</div>
        <div>Battery: {metrics.batteryLevel ?? 'N/A'}%</div>
        <div>Reduced Motion: {metrics.reducedMotion ? 'Yes' : 'No'}</div>
        <div>Mobile: {isMobile ? 'Yes' : 'No'}</div>
        <div>Low-End: {isLowEnd ? 'Yes' : 'No'}</div>
      </div>
      <h3 className="text-sm font-bold mt-3 mb-2">Quality Settings</h3>
      <div className="space-y-1">
        <div>Particles: {quality.particleCount}</div>
        <div>Update Rate: {quality.updateFrequency}Hz</div>
        <div>Glow: {Math.round(quality.glowIntensity * 100)}%</div>
        <div>Shadows: {quality.shadowQuality}</div>
        <div>Complex FX: {quality.enableComplexEffects ? 'On' : 'Off'}</div>
      </div>
    </div>
  );
};

// Throttled animation frame hook
export const useThrottledAnimationFrame = (
  callback: (deltaTime: number) => void,
  targetFps: number = 60
) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const fpsInterval = 1000 / targetFps;
  
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      if (deltaTime > fpsInterval) {
        callback(deltaTime);
        previousTimeRef.current = time - (deltaTime % fpsInterval);
      }
    } else {
      previousTimeRef.current = time;
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [callback, fpsInterval]);
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Intersection observer for lazy loading animations
export const useLazyAnimation = (
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);
  
  return { isVisible, hasBeenVisible };
};