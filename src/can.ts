import { Box3, Group, Mesh, MeshPhysicalMaterial, TextureLoader, Vector3, SRGBColorSpace } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
 
export interface LoadCanOptions {
  targetHeight?: number;
  textureIndex?: 0 | 1;
}
 
/**
 * Loads the soda can GLTF, applies physically-based materials and texture,
 * scales to a target height, and recenters the model to the origin.
 */
export async function loadCanModel(options: LoadCanOptions = {}): Promise<Group> {
  const targetHeight = options.targetHeight ?? 1.6;
  const textureIndex = options.textureIndex ?? 0;
 
  const group = new Group();
 
  const texturePath = `/soda_can/textures/Soda_Texture_${textureIndex}.png`;
  const texture = await new TextureLoader().loadAsync(texturePath);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false; // needed for GLTF UV convention
 
  // Load the new GLTF model (expects result.bin next to it)
  const gltfPath = `/soda_can/result.gltf`;
  const gltf = await new GLTFLoader().loadAsync(gltfPath);
  const root = gltf.scene as Group;
 
  const bodyNameHints = ['Can_Cylinder', 'Body', 'Can', 'cylinder.002'];
  const capNameHints = ['Bottle_Cap', 'Cap', 'Lid', 'open_Area_Cylinder', 'open area', 'cylinder.000'];
  const makeMetal = (overrides?: Partial<ConstructorParameters<typeof MeshPhysicalMaterial>[0]>) =>
    new MeshPhysicalMaterial({
      metalness: 1.0,
      roughness: 0.25,
      clearcoat: 0.6,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.0,
      ...overrides,
    });

  // Assign PBR materials based on name hints to differentiate body and cap
  root.traverse((child) => {
    const mesh = child as Mesh;
    if ((mesh as any).isMesh) {
      const name = (mesh.name || '').toLowerCase();
      const isBody = bodyNameHints.some((h) => name.includes(h.toLowerCase()));
      const isCap = capNameHints.some((h) => name.includes(h.toLowerCase()));

      if (isBody) {
        mesh.material = makeMetal({ map: texture, metalness: 0.35, roughness: 0.45 });
      } else if (isCap) {
        mesh.material = makeMetal({ color: 0xb2b2b2, metalness: 1.1, roughness: 0.2 });
      } else {
        mesh.material = makeMetal({ color: 0xb8b8b8 });
      }
      mesh.castShadow = false;
      mesh.receiveShadow = false;
    }
  });
 
  const bbox = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();
  bbox.getSize(size);
  bbox.getCenter(center);
 
  const scale = size.y > 0 ? targetHeight / size.y : 1;
  root.scale.setScalar(scale);
 
  // recenter to origin
  root.position.sub(center.multiplyScalar(scale));
 
  group.add(root);
  return group;
}

