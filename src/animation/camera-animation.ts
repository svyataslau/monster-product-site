import { PerspectiveCamera, Vector3 } from 'three';
import { easeInOutCubic, lerp, segmentProgress } from '../utils/math';

/**
 * Animates camera field-of-view over scroll:
 * - Zooms in during the first half
 * - Holds through mid
 * - Returns to start value near the end
 * Always re-applies lookAt to the provided focus point.
 */
export function animateCameraFov(camera: PerspectiveCamera, progress: number, focusPoint: Vector3): void {
  const fovStart = 50;
  const fovEnd = 38;
  const p = progress;
  let nextFov = camera.fov;

  if (p < 0.5) {
    const t = easeInOutCubic(segmentProgress(p, 0.0, 0.5));
    nextFov = lerp(fovStart, fovEnd, t);
  } else if (p < 0.88) {
    nextFov = fovEnd;
  } else {
    const t = easeInOutCubic(segmentProgress(p, 0.88, 1.0));
    nextFov = lerp(fovEnd, fovStart, t);
  }

  if (Math.abs(camera.fov - nextFov) > 0.001) {
    camera.fov = nextFov;
    camera.updateProjectionMatrix();
  }

  camera.lookAt(focusPoint);
}


