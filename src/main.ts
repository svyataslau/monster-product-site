import { createScene } from './scene';
import { loadCanModel } from './can';
import { createScrollProgress } from './input/scroll';
import { attachResizeHandler } from './resize';
import { animatePrimaryCan, animateSecondaryCan } from './animation/can-animation';
import { animateCameraFov } from './animation/camera-animation';

// Bootstrap scene with camera, renderer, environment and focus point
const { scene, camera, renderer, focusPoint } = createScene();

// Track scroll progress in [0..1]
const scroll = createScrollProgress();

// Keep renderer and camera in sync with viewport
attachResizeHandler(renderer, camera);

// Can groups and their initial rotations (used as baselines for animation)
let can1: any = null;
let can1BaseRotation: { x: number; y: number } = { x: 0, y: 0 };
let can2: any = null;
let can2BaseRotation: { x: number; y: number } = { x: 0, y: 0 };

// Load both can variants with different textures
const loader = document.getElementById('loader');

Promise.all([
  loadCanModel({ textureIndex: 0 }),
  loadCanModel({ textureIndex: 1 }),
]).then(([g1, g2]) => {
  can1 = g1;
  can1BaseRotation = { x: g1.rotation.x, y: g1.rotation.y };
  scene.add(g1);

  can2 = g2;
  can2BaseRotation = { x: g2.rotation.x, y: g2.rotation.y };
  scene.add(g2);

  if (loader) {
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }
});

// Animation loop
function tick(): void {
  requestAnimationFrame(tick);

  const p = scroll.get();

  if (can1) {
    animatePrimaryCan(can1, can1BaseRotation, p, camera, focusPoint);
  }
  if (can2) {
    animateSecondaryCan(can2, can2BaseRotation, p, camera, focusPoint);
  }

  animateCameraFov(camera, p, focusPoint);
  renderer.render(scene, camera);
}
tick();

