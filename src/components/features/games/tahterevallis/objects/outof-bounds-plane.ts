import * as THREE from "three";
import { GltfAssetCache } from "../../engine/assets/gltf-assets-cache";

export class OutofBoundsPlane {
  private mesh!: THREE.Mesh;

  async load() {
    const gltf = await GltfAssetCache.load(
      `https://res.cloudinary.com/derfbfm9n/image/upload/v1761994782/game-objects-terrain-test_qfbwlx.glb`
    );
    const mesh = gltf.scene.getObjectByName("Plane") as THREE.Mesh;

    if (!mesh) throw new Error("Mesh missing");

    mesh.castShadow = false;
    mesh.receiveShadow = false;

    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }
}
