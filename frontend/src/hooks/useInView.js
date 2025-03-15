import { useState, useEffect, useRef } from 'react';

/**
 * A hook that returns true when an element is in the viewport
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - A number between 0 and 1 indicating the percentage that should be visible before triggering
 * @param {string} options.root - The element that is used as the viewport for checking visibility 
 * @param {string} options.rootMargin - Margin around the root
 * @return {[React.RefObject, boolean]} - A tuple containing ref and whether the element is in view
 */
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: options.threshold || 0.1,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
    });

    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.root, options.rootMargin]);

  return [ref, isInView];
};

export default useInView; 