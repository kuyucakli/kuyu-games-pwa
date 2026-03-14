import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import RAPIER from "@dimforge/rapier3d";
import { Quaternion, Vector3 } from "three";
import { COLLISION_GROUPS } from "../config";

function createCapsuleObstacleBody(
  position: Vector3,
  rotation: Quaternion | undefined,
  halfHeight: number, // New parameter
  radius: number, // New parameter
  physicsWorld: PhysicsWorld,
  isDraggable: boolean = false,
): RAPIER.RigidBody {
  const world = physicsWorld.getWorld();

  const safeRotation = rotation
    ? { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
    : { x: 0, y: 0, z: 0, w: 1 }; // Default: No rotation

  const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(position.x, position.y, position.z)
    .setRotation(safeRotation)
    // 1. DAMPING: This acts like air resistance or thick oil.
    // High linear damping makes it stop sliding quickly.
    // High angular damping makes it hard to tip over or spin.
    .setLinearDamping(2.0)
    .setAngularDamping(5.0)
    .setCcdEnabled(true);

  const body = world.createRigidBody(bodyDesc);
  const actualRapierHalfHeight = Math.max(0.01, halfHeight - radius);
  // collider (half-height, radius) - adjust based on your Blender model
  const colliderDesc = RAPIER.ColliderDesc.capsule(
    actualRapierHalfHeight,
    radius,
  )
    .setFriction(0.01)
    .setRestitution(0.1);

  const collider = world.createCollider(colliderDesc, body);
  collider.setCollisionGroups(COLLISION_GROUPS.TABLE);

  return body;
}

function createTubeObstacleBody(
  position: Vector3,
  rotation: Quaternion | undefined,
  halfHeight: number, // New parameter
  radius: number, // New parameter
  physicsWorld: PhysicsWorld,
): RAPIER.RigidBody {
  // const { vertices, indices } = model.getColliderTrimeshLocal();
  const world = physicsWorld.getWorld();
  const safeRotation = rotation
    ? { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
    : { x: 0, y: 0, z: 0, w: 1 }; // Default: No rotation
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(position.x, position.y, position.z)
      .setRotation(safeRotation),
  );

  const colliderDesc = RAPIER.ColliderDesc.cylinder(halfHeight, radius)
    .setFriction(0.01)
    .setRestitution(0.1);

  const collider = world.createCollider(colliderDesc, body);
  collider.setCollisionGroups(COLLISION_GROUPS.TABLE);

  //   physicsWorld.addColliderMeta(collider, {
  //     kind: "table",
  //     entityId: "the-table",
  //   });
  return body;
}
// obstacle-factory.ts
function createCurvedObstacleBody(
  vertices: Float32Array,
  indices: Uint32Array,
  position: Vector3,
  rotation: Quaternion | undefined, // Add this
  physicsWorld: PhysicsWorld,
): RAPIER.RigidBody {
  const world = physicsWorld.getWorld();

  const safeRotation = rotation
    ? { x: rotation.x, y: rotation.y, z: rotation.z, w: rotation.w }
    : { x: 0, y: 0, z: 0, w: 1 };

  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(position.x, position.y, position.z)
      .setRotation(safeRotation), // Apply rotation here
  );

  const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
  const collider = world.createCollider(colliderDesc, body);
  collider.setCollisionGroups(COLLISION_GROUPS.TABLE);

  return body;
}

export {
  createCapsuleObstacleBody,
  createCurvedObstacleBody,
  createTubeObstacleBody,
};
