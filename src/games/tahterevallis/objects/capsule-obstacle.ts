import type RAPIER from "@dimforge/rapier3d";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

export class CapsuleObstacle {
  public readonly group = new THREE.Group();
  private mesh!: THREE.Mesh;
  private body!: RAPIER.RigidBody;

  // We store dimensions to create the Rapier collider later
  public radius: number = 0;
  public height: number = 0;

  constructor(gltf: GLTF, position?: THREE.Vector3) {
    const source = gltf.scene.getObjectByName("OBSTACLE_CAPSULE");

    if (!(source instanceof THREE.Mesh)) {
      throw new Error(
        `Obstacle mesh "OBSTACLE_CAPSULE" not found or not a Mesh`,
      );
    }

    // Clone the mesh and add to group
    this.mesh = source.clone();
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.group.add(this.mesh);
    this.group.position.copy(position ?? new THREE.Vector3(0, 0, 0));

    // Calculate dimensions for Rapier (Height and Radius)
    this.calculateDimensions();
  }

  private calculateDimensions() {
    const box = new THREE.Box3().setFromObject(this.mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    // For a vertical capsule:
    // Radius is half the width, Height is the cylinder part (Total height - 2 * radius)
    this.radius = size.x / 2;
    this.height = Math.max(0, size.y - size.x);
  }

  get object3D(): THREE.Object3D {
    return this.group;
  }

  get rigidBody(): RAPIER.RigidBody {
    if (!this.body) {
      throw new Error("Capsule rigid body accessed before attachRigidBody()");
    }
    return this.body;
  }

  attachRigidBody(body: RAPIER.RigidBody) {
    this.body = body;
  }

  /**
   * Syncs the Three.js mesh with the Rapier physics body.
   * Call this in your game loop for moving/draggable objects.
   */
  update() {
    if (!this.body) return;

    const t = this.body.translation();
    const r = this.body.rotation();

    this.group.position.set(t.x, t.y, t.z);
    this.group.quaternion.set(r.x, r.y, r.z, r.w);
  }

  /**
   * Used for dragging or scripted movement.
   */
  moveTo(vec: THREE.Vector3) {
    if (!this.body) return;
    this.body.setNextKinematicTranslation({ x: vec.x, y: vec.y, z: vec.z });
  }
}
