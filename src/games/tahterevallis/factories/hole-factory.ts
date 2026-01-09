import {
  PlaneGeometry,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  Object3D,
  Vector3,
  AdditiveBlending,
} from "three";

import RAPIER from "@dimforge/rapier3d";

function createHoleIndicator(): Mesh {
  const geometry = new PlaneGeometry(0.95, 0.95, 1, 1);
  const material = new MeshBasicMaterial({
    color: "green",
    transparent: true,
    opacity: 1.0,
    side: DoubleSide,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
  });

  const ring = new Mesh(geometry, material);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.1;

  return ring;
}

function createHoleSensor(
  locator: Object3D,
  radius: number,
  physicsWorld: RAPIER.World,
  tableBody: RAPIER.RigidBody
) {
  const worldPos = new Vector3();
  locator.getWorldPosition(worldPos);

  const bodyPos = tableBody.translation();

  const desc = RAPIER.ColliderDesc.ball(radius)
    .setTranslation(
      worldPos.x - bodyPos.x,
      worldPos.y - bodyPos.y,
      worldPos.z - bodyPos.z
    )
    .setSensor(true);

  const collider = physicsWorld.createCollider(desc, tableBody);
  collider.setEnabled(false);

  return collider;
}

export { createHoleIndicator, createHoleSensor };
