import { clamp01 } from '../utils/math';

export interface ScrollProgressController {
  get(): number;
  destroy(): void;
}

/**
 * Tracks normalized scroll progress in [0..1] across the document height.
 * Uses a passive scroll listener for optimal performance.
 */
export function createScrollProgress(): ScrollProgressController {
  let progress = 0;

  function update(): void {
    const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
    progress = clamp01(window.scrollY / max);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();

  return {
    get() {
      return progress;
    },
    destroy() {
      window.removeEventListener('scroll', update);
    },
  };
}


