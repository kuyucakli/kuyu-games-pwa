import {
  RingGeometry,
  Mesh,
  MeshBasicMaterial,
  DoubleSide,
  Object3D,
  Vector3,
} from "three";

import RAPIER from "@dimforge/rapier3d";

function createHoleIndicator(): Mesh {
  const geometry = new RingGeometry(0.05, 0.1, 32);
  const material = new MeshBasicMaterial({
    color: 0x88ff99,
    transparent: true,
    opacity: 0.9,
    side: DoubleSide,
    depthWrite: false,
  });

  const ring = new Mesh(geometry, material);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.002;

  return ring;
}

function createHoleSensor(
  locator: Object3D,
  radius: number,
  physicsWorld: RAPIER.World
) {
  const pos = new Vector3();
  locator.getWorldPosition(pos);

  const collider = physicsWorld.createCollider(
    RAPIER.ColliderDesc.ball(radius)
      .setTranslation(pos.x, pos.y, pos.z)
      .setSensor(true)
  );
  collider.setEnabled(false);
  (collider as any).userData = {
    type: "hole",
    holeName: locator.name,
  };

  return collider;
}

export { createHoleIndicator, createHoleSensor };
