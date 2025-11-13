import { Group, PerspectiveCamera, Vector3 } from 'three';
import { clamp01, easeInOutCubic, lerp, segmentProgress } from '../utils/math';
import { worldPointForNdc } from '../utils/camera';

export interface BaseRotation {
  x: number;
  y: number;
}

/**
 * Primary can animation: screen-space segmented path, scale and rotation driven by scroll progress.
 * Designed to keep the can readable while creating a dynamic hero motion.
 */
export function animatePrimaryCan(
  can: Group,
  baseRotation: BaseRotation,
  progress: number,
  camera: PerspectiveCamera,
  focusPoint: Vector3
): void {
  const p = progress;
  const p1 = clamp01(Math.min(p, 0.5) / 0.5);
  const p2 = clamp01((p - 0.5) / 0.5);
  const distance = camera.position.distanceTo(focusPoint);

  // Path segments across the screen; includes a deliberate "overflow" to the right before returning.
  const leftNdc = { x: -0.7, y: 0.35 };
  const rightOverflowNdc = { x: 1.1, y: 0.35 };
  const rightInsideNdc = { x: 0.78, y: 0.35 };

  const s1 = segmentProgress(p, 0.0, 0.28);
  const s2 = segmentProgress(p, 0.28, 0.72);
  const s3 = segmentProgress(p, 0.72, 0.88);
  const s4 = segmentProgress(p, 0.88, 1.0);

  let from = leftNdc;
  let to = leftNdc;
  let t = 0;
  if (p < 0.28) {
    from = leftNdc;
    to = rightOverflowNdc;
    t = easeInOutCubic(s1);
  } else if (p < 0.72) {
    from = rightOverflowNdc;
    to = leftNdc;
    t = easeInOutCubic(s2);
  } else if (p < 0.88) {
    from = leftNdc;
    to = rightInsideNdc;
    t = easeInOutCubic(s3);
  } else {
    from = rightInsideNdc;
    to = rightInsideNdc;
    t = 0;
  }

  const fromWorld = worldPointForNdc(camera, from.x, from.y, distance);
  const toWorld = worldPointForNdc(camera, to.x, to.y, distance);
  const targetPos = fromWorld.lerp(toWorld, t);
  can.position.lerp(targetPos, 0.12);

  // Scale modulation across segments
  const scaleStart = 0.95;
  const scalePeak = 1.45;
  const scaleS1 = easeInOutCubic(s1);
  const scaleS2 = easeInOutCubic(s2);
  const scaleS3 = easeInOutCubic(s3);
  const scaleAlong = p < 0.28 ? scaleS1 : p < 0.72 ? 1 - scaleS2 : p < 0.88 ? scaleS3 * 0.5 : 0;
  const targetScale = lerp(scaleStart, scalePeak, scaleAlong);
  can.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.12);

  // Rotations: Y spins through both phases; X flips during phase 2
  const yPhase1 = Math.PI * 1.2 * easeInOutCubic(p1);
  const yPhase2 = Math.PI * 2.0 * easeInOutCubic(p2);
  const xPhase2 = Math.PI * 2.0 * easeInOutCubic(p2);
  const targetRotY = baseRotation.y + yPhase1 + yPhase2;
  const targetRotX = baseRotation.x + xPhase2;
  can.rotation.y = lerp(can.rotation.y, targetRotY, 0.12);
  can.rotation.x = lerp(can.rotation.x, targetRotX, 0.12);

  // During the final segment, lift camera gently towards a top-ish view without losing the lookAt target.
  if (p >= 0.88) {
    const topT = easeInOutCubic(s4);
    const startPos = new Vector3(1, 0.2, 3.8);
    const topPos = new Vector3(0.6, 3.2, 0.6);
    const desired = new Vector3().copy(startPos).lerp(topPos, topT);
    camera.position.lerp(desired, 0.12);
  }
}

/**
 * Secondary can animation: desynchronized motion, lower band, slight jitter for visual complexity.
 */
export function animateSecondaryCan(
  can: Group,
  baseRotation: BaseRotation,
  progress: number,
  camera: PerspectiveCamera,
  focusPoint: Vector3
): void {
  const p = (progress + 0.22) % 1; // out-of-phase to avoid mirrored motion
  const p1 = clamp01(Math.min(p, 0.5) / 0.5);
  const p2 = clamp01((p - 0.5) / 0.5);
  const distance = camera.position.distanceTo(focusPoint) * 1.8; // push farther back

  const leftNdc = { x: -0.45, y: -0.15 };
  const rightOverflowNdc = { x: 1.05, y: -0.15 };
  const rightInsideNdc = { x: 0.62, y: -0.1 };

  const s1 = segmentProgress(p, 0.0, 0.25);
  const s2 = segmentProgress(p, 0.25, 0.75);
  const s3 = segmentProgress(p, 0.75, 0.92);
  const s4 = segmentProgress(p, 0.92, 1.0);

  let from = leftNdc;
  let to = leftNdc;
  let t = 0;
  if (p < 0.25) {
    from = leftNdc;
    to = rightOverflowNdc;
    t = easeInOutCubic(s1);
  } else if (p < 0.75) {
    from = rightOverflowNdc;
    to = leftNdc;
    t = easeInOutCubic(s2);
  } else if (p < 0.92) {
    from = leftNdc;
    to = rightInsideNdc;
    t = easeInOutCubic(s3);
  } else {
    from = rightInsideNdc;
    to = rightInsideNdc;
    t = 0;
  }

  // Subtle jitter to feel more chaotic without colliding with primary can
  const jitterX = 0.02 * Math.sin(Math.PI * 8 * p);
  const jitterY = 0.02 * Math.cos(Math.PI * 6 * p);
  const fromWorld = worldPointForNdc(camera, from.x + jitterX, from.y + jitterY, distance);
  const toWorld = worldPointForNdc(camera, to.x + jitterX, to.y + jitterY, distance);
  const targetPos = fromWorld.lerp(toWorld, t);
  can.position.lerp(targetPos, 0.12);

  // Smaller scale range to keep hierarchy
  const scaleStart = 0.9;
  const scalePeak = 1.3;
  const scaleS1 = easeInOutCubic(s1);
  const scaleS2 = easeInOutCubic(s2);
  const scaleS3 = easeInOutCubic(s3);
  const scaleAlong = p < 0.25 ? scaleS1 : p < 0.75 ? 1 - scaleS2 : p < 0.92 ? scaleS3 * 0.4 : 0;
  const targetScale = lerp(scaleStart, scalePeak, scaleAlong);
  can.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.12);

  // Smooth rotations across entire scroll
  const yTotal = Math.PI * 2.2 * easeInOutCubic(p);
  const xPhase = Math.PI * 1.4 * easeInOutCubic(segmentProgress(p, 0.65, 1.0));
  const targetRotY = baseRotation.y + yTotal;
  const targetRotX = baseRotation.x + xPhase;
  can.rotation.y = lerp(can.rotation.y, targetRotY, 0.09);
  can.rotation.x = lerp(can.rotation.x, targetRotX, 0.09);
}


