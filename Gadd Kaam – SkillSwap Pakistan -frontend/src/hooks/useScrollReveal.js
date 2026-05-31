// src/hooks/useScrollReveal.js
import { useEffect } from 'react';

/**
 * Custom hook to trigger viewport-based element entry transitions.
 * Scans for classes: .reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale
 * and adds the .active class once intersected by the viewport.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px', // Trigger slightly inside the viewport
      threshold: 0.08,
    };

    const revealCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Unobserve once animation triggers
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, observerOptions);
    
    // Find all targets to track
    const targets = document.querySelectorAll(
      '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale'
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      targets.forEach((target) => {
        try {
          observer.unobserve(target);
        } catch (err) {
          // Ignore errors during cleanup
        }
      });
    };
  }, []);
}
