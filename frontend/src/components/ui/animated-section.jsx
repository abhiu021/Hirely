import React, { useState, useEffect } from 'react';
import useInView from '@/hooks/useInView';
import { cn } from '@/lib/utils';

/**
 * A component that animates its children when they come into view
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to be animated
 * @param {string} props.className - Additional class names to apply to the container
 * @param {string} props.animation - The animation type: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom-in', 'zoom-out'
 * @param {number} props.delay - Delay before animation starts (in milliseconds)
 * @param {number} props.duration - Animation duration (in milliseconds)
 * @param {Object} props.observerOptions - Options for the IntersectionObserver
 * @returns {React.ReactElement} - The animated container
 */
const AnimatedSection = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  observerOptions = { threshold: 0.1 },
  ...props
}) => {
  const [ref, isInView] = useInView(observerOptions);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Animation class mappings
  const animationClasses = {
    'fade-up': 'translate-y-10 opacity-0',
    'fade-down': '-translate-y-10 opacity-0',
    'fade-left': 'translate-x-10 opacity-0',
    'fade-right': '-translate-x-10 opacity-0',
    'zoom-in': 'scale-95 opacity-0',
    'zoom-out': 'scale-105 opacity-0',
  };

  const initialClass = animationClasses[animation] || animationClasses['fade-up'];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all transform',
        initialClass,
        (isInView || hasAnimated) && 'translate-y-0 translate-x-0 scale-100 opacity-100',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * A component that staggers animations for its direct children
 */
export const AnimatedStagger = ({
  children,
  className,
  staggerDelay = 100,
  animation = 'fade-up',
  baseDelay = 0,
  duration = 600,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <AnimatedSection
            animation={animation}
            delay={baseDelay + index * staggerDelay}
            duration={duration}
          >
            {child}
          </AnimatedSection>
        );
      })}
    </div>
  );
};

export default AnimatedSection; 