import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  Vector3,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

export interface SceneBundle {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  focusPoint: Vector3;
  focusDistance: number;
}

/**
 * Creates a Three.js scene configured for PBR with environment reflections,
 * transparent background, and standard tone mapping.
 */
export function createScene(): SceneBundle {
  const scene = new Scene();

  // Camera is positioned to frame the can nicely; focus point anchors camera.lookAt.
  const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(1, 0.2, 3.8);
  const focusPoint = new Vector3(0, 0.1, 0);
  camera.lookAt(focusPoint);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.physicallyCorrectLights = true;
  document.body.appendChild(renderer.domElement);

  // Environment map for realistic metal reflections via PMREM
  const pmrem = new PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.5);
  scene.environment = envRT.texture;
  scene.background = null; // Keep CSS background visible through canvas alpha
  pmrem.dispose();

  const focusDistance = camera.position.distanceTo(focusPoint);

  return { scene, camera, renderer, focusPoint, focusDistance };
}


