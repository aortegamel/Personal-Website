import { useState, useEffect, useRef, RefObject, useCallback } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

// Optimized mouse position hook using requestAnimationFrame
export const useMousePosition = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true
): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const positionRef = useRef<MousePosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!enabled || !ref.current) return;
    
    const element = ref.current;
    
    const updatePosition = () => {
      setMousePosition({ ...positionRef.current });
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      positionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      
      // Cancel previous frame and schedule new one
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ref, enabled]);
  
  return mousePosition;
};

// Alternative: Hook that returns a ref with current mouse position (no re-renders)
export const useMousePositionRef = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true
): RefObject<MousePosition> => {
  const positionRef = useRef<MousePosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!enabled || !ref.current) return;
    
    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      positionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, enabled]);
  
  return positionRef;
};

export const useRelativeMousePosition = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true
): { relativeX: number; relativeY: number } => {
  const { x, y } = useMousePosition(ref, enabled);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    if (!ref.current) return;
    
    const updateDimensions = () => {
      if (ref.current) {
        const newDimensions = {
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        };
        
        // Only update if dimensions actually changed
        if (dimensionsRef.current.width !== newDimensions.width ||
            dimensionsRef.current.height !== newDimensions.height) {
          dimensionsRef.current = newDimensions;
          forceUpdate({});
        }
      }
    };
    
    updateDimensions();
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(ref.current);
    
    return () => resizeObserver.disconnect();
  }, [ref]);
  
  const { width, height } = dimensionsRef.current;
  
  return {
    relativeX: width ? (x / width - 0.5) * 2 : 0,
    relativeY: height ? (y / height - 0.5) * 2 : 0,
  };
};

// Utility hook for throttling mouse position updates
export const useThrottledMousePosition = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true,
  delay: number = 16 // ~60fps
): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const lastUpdateRef = useRef(0);
  
  useEffect(() => {
    if (!enabled || !ref.current) return;
    
    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < delay) return;
      
      lastUpdateRef.current = now;
      const rect = element.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref, enabled, delay]);
  
  return mousePosition;
};