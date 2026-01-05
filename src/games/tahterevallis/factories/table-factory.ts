import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import RAPIER from "@dimforge/rapier3d";
import { Vector3 } from "three";

function createTableTrimesh(
  vertices: Float32Array,
  indices: Uint32Array,
  position: Vector3,
  physicsWorld: PhysicsWorld
): RAPIER.RigidBody {
  // const { vertices, indices } = model.getColliderTrimeshLocal();
  const world = physicsWorld.getWorld();
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
      position.x,
      position.y,
      position.z
    )
  );

  const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
    .setFriction(0.01)
    .setRestitution(0.1);

  const collider = world.createCollider(colliderDesc, body);

  physicsWorld.addColliderMeta(collider, {
    kind: "table",
    entityId: "the-table",
  });
  return body;
}

export { createTableTrimesh };
