import { useState, useEffect, useRef, RefObject } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export const useMousePosition = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true
): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!enabled || !ref.current) return;
    
    const element = ref.current;
    
    const handleMouseMove = (e: MouseEvent) => {
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
  }, [ref, enabled]);
  
  return mousePosition;
};

export const useRelativeMousePosition = (
  ref: RefObject<HTMLElement>,
  enabled: boolean = true
): { relativeX: number; relativeY: number } => {
  const { x, y } = useMousePosition(ref, enabled);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!ref.current) return;
    
    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, [ref]);
  
  return {
    relativeX: dimensions.width ? (x / dimensions.width - 0.5) * 2 : 0,
    relativeY: dimensions.height ? (y / dimensions.height - 0.5) * 2 : 0,
  };
};