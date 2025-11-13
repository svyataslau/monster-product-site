import { Group, Vector3 } from 'three';
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
let can1: Group | null = null;
let can1BaseRotation: { x: number; y: number } = { x: 0, y: 0 };
let can2: Group | null = null;
let can2BaseRotation: { x: number; y: number } = { x: 0, y: 0 };

// Load both can variants with different textures
loadCanModel({ textureIndex: 0 }).then((g) => {
  can1 = g;
  can1BaseRotation = { x: g.rotation.x, y: g.rotation.y };
  scene.add(g);
});
loadCanModel({ textureIndex: 1 }).then((g) => {
  can2 = g;
  can2BaseRotation = { x: g.rotation.x, y: g.rotation.y };
  scene.add(g);
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

