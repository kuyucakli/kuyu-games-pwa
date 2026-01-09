import RAPIER from "@dimforge/rapier3d";
import { COLLISION_GROUPS } from "../config";

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
  collider.setCollisionGroups(COLLISION_GROUPS.ACTIVE_BALL);

  return { body, collider };
}

export { createDynamicBall };
