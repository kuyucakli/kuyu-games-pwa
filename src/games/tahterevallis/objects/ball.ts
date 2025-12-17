import * as THREE from "three";

export class Ball {
  private position;
  private geometry;
  private material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.8,
    roughness: 0.2,
  });
  public readonly mesh!: THREE.Mesh;

  constructor(radius: number, position: [number, number, number] = [0, 1, 0]) {
    this.geometry = new THREE.SphereGeometry(radius, 32, 32);
    this.position = position;
    const mesh = new THREE.Mesh(this.geometry, this.material);

    mesh.castShadow = true;
    mesh.position.set(...this.position);

    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x888888,
      side: THREE.BackSide,
    });

    const outline = new THREE.Mesh(this.geometry.clone(), outlineMat);
    outline.scale.set(1.08, 1.08, 1.08); // outline thickness
    mesh.add(outline); // attach so that it rotates/moves with the ball

    this.mesh = mesh;
  }
}

//this.scene.add(mesh);

// const body = this.world.createRigidBody(
//   this.RAPIER.RigidBodyDesc.dynamic()
//     .setTranslation(...position)
//     .setCcdEnabled(true)
// );

// Outline (backside scaled)
// const colliderDesc = this.RAPIER.ColliderDesc.ball(radius)
//   .setMass(1)
//   .setRestitution(0.5)
//   .setFriction(0.8);

// this.world.createCollider(colliderDesc, body);

// this.dynamicBodies.push([mesh, body]);
