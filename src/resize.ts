import { PerspectiveCamera, WebGLRenderer } from 'three';

/**
 * Attaches a window resize handler to keep the renderer and camera
 * in sync with the viewport size and device pixel ratio.
 * Returns a cleanup function to remove the listener.
 */
export function attachResizeHandler(renderer: WebGLRenderer, camera: PerspectiveCamera): () => void {
  function onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  window.addEventListener('resize', onResize);
  onResize();

  return () => window.removeEventListener('resize', onResize);
}


