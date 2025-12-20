import RAPIER from "@dimforge/rapier3d";
import { CollisionGroup } from "../types";

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

  return { body, collider };
}

export { createDynamicBall };
