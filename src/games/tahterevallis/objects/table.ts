import type RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

export class Table {
  public readonly group = new THREE.Group();
  private mesh!: THREE.Mesh;
  private body!: RAPIER.RigidBody;
  private holeLocators: THREE.Object3D[] = [];

  constructor(gltf: GLTF, position: THREE.Vector3) {
    const source = gltf.scene.getObjectByName("Table_Plane");
    const locatorsRoot = gltf.scene.getObjectByName("Locator_Holes");
    if (!locatorsRoot) {
      throw new Error("Locators_Holes not found");
    }

    const locatorsClone = locatorsRoot.clone(true);
    this.holeLocators = locatorsClone.children.slice();

    if (!(source instanceof THREE.Mesh)) {
      throw new Error("Table_Plane mesh not found or not a Mesh");
    }

    const mesh = source.clone();
    this.mesh = mesh;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.group.add(mesh);
    this.group.position.copy(position);

    this.group.add(locatorsClone);
  }

  get object3D(): THREE.Object3D {
    return this.group;
  }

  get rigidBody(): RAPIER.RigidBody {
    if (!this.body) {
      throw new Error("Table rigid body accessed before attachRigidBody()");
    }
    return this.body;
  }

  attachRigidBody(body: RAPIER.RigidBody) {
    this.body = body;
  }

  tilt(x: number, z: number) {
    if (!this.body) return;
    this.group.rotation.x = x;
    this.group.rotation.z = z;
  }

  setTexture(texture: THREE.Texture | null) {
    if (!texture) return;
    const material = this.mesh.material as THREE.MeshStandardMaterial;
    if (!material) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    material.map = texture;

    material.needsUpdate = true;
  }

  getColliderTrimeshLocal() {
    const mesh = this.mesh;
    const geom = mesh.geometry;

    if (!geom.index) {
      throw new Error("Geometry has no index buffer");
    }

    return {
      vertices: new Float32Array(geom.attributes.position.array),
      indices: new Uint32Array(geom.index.array),
    };
  }

  getHoleLocators() {
    return this.holeLocators;
  }

  getColliderTrimeshWorld() {
    const geom = this.mesh.geometry.clone();
    this.mesh.updateWorldMatrix(true, true);
    geom.applyMatrix4(this.mesh.matrixWorld);
    geom.computeVertexNormals();
    if (!geom.index) {
      throw new Error("Geometry has no index buffer");
    }

    return {
      vertices: new Float32Array(geom.attributes.position.array),
      indices: new Uint32Array(geom.index.array),
    };
  }
}
