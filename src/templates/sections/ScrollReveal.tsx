'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = '', 
  direction = 'up' 
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
        if (el) observer.disconnect();
    };
  }, []);

  const getInitialTransform = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    switch (direction) {
      case 'up': return 'opacity-0 translate-y-8';
      case 'down': return 'opacity-0 -translate-y-8';
      case 'left': return 'opacity-0 translate-x-8';
      case 'right': return 'opacity-0 -translate-x-8';
      default: return 'opacity-0 scale-95';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${getInitialTransform()} ${className}`}
    >
      {children}
    </div>
  );
}
