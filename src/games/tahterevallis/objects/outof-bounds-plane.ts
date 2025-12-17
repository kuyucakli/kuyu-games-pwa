import * as THREE from "three";
import { GltfAssetCache } from "../../engine/assets/gltf-assets-cache";

export class OutofBoundsPlane {
  private mesh!: THREE.Mesh;

  async load() {
    const gltf = await GltfAssetCache.load(
      `https://res.cloudinary.com/derfbfm9n/image/upload/v1761994782/game-objects-terrain-test_qfbwlx.glb`
    );
    const source = gltf.scene.getObjectByName("Plane");

    if (!(source instanceof THREE.Mesh)) {
      throw new Error("Table_Plane mesh not found or not a Mesh");
    }

    const mesh = source.clone();
    this.mesh = mesh;

    mesh.castShadow = false;
    mesh.receiveShadow = false;

    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }
}
