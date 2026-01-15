import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

export class OutofBoundsPlane {
  private mesh!: THREE.Mesh;

  constructor(gltf: GLTF) {
    const source = gltf.scene.getObjectByName("Plane");

    if (!(source instanceof THREE.Mesh)) {
      throw new Error("Table_Plane mesh not found or not a Mesh");
    }

    const mesh = source.clone();
    this.mesh = mesh;

    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.updateWorldMatrix(true, false);
    this.mesh = mesh;
  }

  getMesh() {
    return this.mesh;
  }
}
