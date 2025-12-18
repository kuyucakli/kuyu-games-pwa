import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import RAPIER from "@dimforge/rapier3d";
import { Vector3 } from "three";

function createDynamicBall(
  radius: number,
  position: [number, number, number],
  world: RAPIER.World
) {
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(...position)
  );

  const collider = world.createCollider(
    RAPIER.ColliderDesc.ball(radius)
      .setMass(1)
      .setRestitution(0.5)
      .setFriction(0.8),
    body
  );
  collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
  (collider as any).userData = {
    type: "ball",
  };
  return { body, collider };
}

function createKinematicTrimesh(
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

export { createDynamicBall, createKinematicTrimesh };
