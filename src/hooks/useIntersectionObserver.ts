import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = (
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | undefined => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  
  const frozen = entry?.isIntersecting && freezeOnceVisible;
  
  useEffect(() => {
    const node = elementRef?.current;
    if (!node || frozen) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );
    
    observer.observe(node);
    
    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen]);
  
  return entry;
};

export const useIsVisible = (
  ref: RefObject<Element>,
  options?: UseIntersectionObserverOptions
): boolean => {
  const entry = useIntersectionObserver(ref, options);
  return !!entry?.isIntersecting;
};

export const useScrollAnimation = (
  threshold: number = 0.1,
  rootMargin: string = '0px 0px -100px 0px'
) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref, {
    threshold,
    rootMargin,
    freezeOnceVisible: true,
  });
  
  return { ref, isVisible };
};