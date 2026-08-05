import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observerOptions = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (!options.repeat) {
            observer.unobserve(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe the ref element and all children with .reveal class
    const elements = node.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));
    if (node.classList.contains('reveal')) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.repeat]);

  return ref;
}
