import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import RAPIER from "@dimforge/rapier3d";
import { Vector3 } from "three";
import { CollisionGroup } from "../types";

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

  const collider = RAPIER.ColliderDesc.trimesh(vertices, indices)
    .setFriction(1)
    .setRestitution(0.2);
  world.createCollider(collider, body);
  return body;
}

export { createTableTrimesh };
