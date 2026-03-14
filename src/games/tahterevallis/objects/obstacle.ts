import type { RigidBody } from "@dimforge/rapier3d";
import { Group, Mesh, Quaternion, Vector3 } from "three";

// Define a type for your supported obstacle names in Blender
export type ObstacleType =
  | "OBSTACLE_CAPSULE"
  | "OBSTACLE_TUBE"
  | "OBSTACLE_CURVED";

export class Obstacle {
  public mesh: Mesh;
  private body?: RigidBody;

  constructor(gltf: any, gltfId: string) {
    const source = gltf.scene.getObjectByName(gltfId);
    if (!(source instanceof Mesh))
      throw new Error(`Mesh "${gltfId}" not found`);

    // Force matrix update to get real Blender coordinates
    source.updateWorldMatrix(true, true);

    const worldPos = new Vector3();
    const worldQuat = new Quaternion();
    source.getWorldPosition(worldPos);
    source.getWorldQuaternion(worldQuat);

    // Clone the mesh directly
    this.mesh = source.clone();

    // Set the mesh to its Blender world position immediately
    this.mesh.position.copy(worldPos);
    this.mesh.quaternion.copy(worldQuat);
  }

  getGeometryData() {
    return {
      vertices: this.mesh.geometry.attributes.position.array as Float32Array,
      indices: this.mesh.geometry.index?.array as Uint32Array,
    };
  }

  getDimensions() {
    this.mesh.geometry.computeBoundingBox();
    const box = this.mesh.geometry.boundingBox!;

    const size = new Vector3();
    box.getSize(size);

    const center = new Vector3();
    box.getCenter(center); // This is the "real" center of the object

    const height = Math.max(size.x, size.y, size.z);
    const radius = Math.min(size.x, size.z) / 2;

    return {
      halfHeight: height / 2,
      radius: radius,
      center: center, // We will use this for the body position
    };
  }

  attachRigidBody(body: RigidBody) {
    this.body = body;
  }
}
