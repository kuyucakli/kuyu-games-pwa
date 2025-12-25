import * as THREE from "three";

export class Ball {
  private position;
  private geometry;
  private material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.6,
    roughness: 0.3,
    envMapIntensity: 1.5,
  });
  public readonly mesh!: THREE.Mesh;

  constructor(radius: number, position: [number, number, number] = [0, 1, 0]) {
    this.geometry = new THREE.SphereGeometry(radius, 32, 32);
    this.position = position;
    const mesh = new THREE.Mesh(this.geometry, this.material);

    mesh.castShadow = true;
    mesh.position.set(...this.position);

    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });

    const outline = new THREE.Mesh(this.geometry.clone(), outlineMat);
    outline.scale.set(1.08, 1.08, 1.08); // outline thickness
    mesh.add(outline); // attach so that it rotates/moves with the ball

    this.mesh = mesh;
  }
}
