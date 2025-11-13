import { PerspectiveCamera, Vector3 } from 'three';

/**
 * Computes a world-space point for a given NDC position at a fixed distance from the camera.
 * Useful for animating objects along screen-space-aligned paths.
 */
export function worldPointForNdc(
  camera: PerspectiveCamera,
  ndcX: number,
  ndcY: number,
  distance: number
): Vector3 {
  const ndc = new Vector3(ndcX, ndcY, 0.5);
  ndc.unproject(camera);
  const direction = ndc.sub(camera.position).normalize();
  return camera.position.clone().add(direction.multiplyScalar(distance));
}


