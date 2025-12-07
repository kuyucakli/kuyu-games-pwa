import * as THREE from "three";

export class SparkleSystem {
  points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private maxCount = 800;
  private lifetimes: Float32Array;
  private ages: Float32Array;
  private velocities: Float32Array;
  private baseColors: Float32Array;

  constructor() {
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.maxCount * 3);
    const colors = new Float32Array(this.maxCount * 3);
    this.baseColors = new Float32Array(this.maxCount * 3);
    this.lifetimes = new Float32Array(this.maxCount);
    this.ages = new Float32Array(this.maxCount);
    this.velocities = new Float32Array(this.maxCount * 3);

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  emit(position: THREE.Vector3, baseVelocity?: THREE.Vector3) {
    const positions = this.geometry.attributes
      .position as THREE.BufferAttribute;
    const colors = this.geometry.attributes.color as THREE.BufferAttribute;

    const i = this.ages.findIndex((age, idx) => age >= this.lifetimes[idx]);
    const index = i === -1 ? Math.floor(Math.random() * this.maxCount) : i;

    // Slightly clustered spawn around position
    positions.setXYZ(
      index,
      position.x + (Math.random() - 0.5) * 0.02,
      position.y + (Math.random() - 0.5) * 0.02,
      position.z + (Math.random() - 0.5) * 0.02
    );

    this.lifetimes[index] = 1.0 + Math.random() * 0.6;
    this.ages[index] = 0;

    const dir = baseVelocity
      ? baseVelocity.clone().normalize().multiplyScalar(-0.4)
      : new THREE.Vector3(0, 1, 0);

    // Reduced spread for tight clustering
    dir.x += (Math.random() - 0.5) * 0.05;
    dir.y += Math.random() * 0.1 - 0.05;
    dir.z += (Math.random() - 0.5) * 0.05;
    this.velocities.set([dir.x, dir.y, dir.z], index * 3);

    // Color selection (unchanged)
    const color = new THREE.Color();
    const heat = Math.random();
    if (heat < 0.3) color.setRGB(1.0, 0.2 + Math.random() * 0.1, 0.0);
    else if (heat < 0.7) color.setRGB(1.0, 0.45 + Math.random() * 0.15, 0.05);
    else color.setRGB(1.0, 0.75 + Math.random() * 0.15, 0.1);

    this.baseColors.set([color.r, color.g, color.b], index * 3);
    colors.setXYZ(index, color.r, color.g, color.b);

    positions.needsUpdate = true;
    colors.needsUpdate = true;
  }

  update(delta: number) {
    const positions = this.geometry.attributes
      .position as THREE.BufferAttribute;
    const colors = this.geometry.attributes.color as THREE.BufferAttribute;
    const posArr = positions.array as Float32Array;
    const colArr = colors.array as Float32Array;

    for (let i = 0; i < this.maxCount; i++) {
      const idx3 = i * 3;

      if (this.ages[i] < this.lifetimes[i]) {
        this.ages[i] += delta;
        const fade = 1 - this.ages[i] / this.lifetimes[i];

        // Damping motion
        this.velocities[idx3 + 0] *= 0.95;
        this.velocities[idx3 + 1] *= 0.95;
        this.velocities[idx3 + 2] *= 0.95;

        // Position update
        posArr[idx3 + 0] += this.velocities[idx3 + 0] * delta * 6;
        posArr[idx3 + 1] += this.velocities[idx3 + 1] * delta * 6;
        posArr[idx3 + 2] += this.velocities[idx3 + 2] * delta * 6;

        // 🟡 Color fade: deep orange → bright yellow → soft golden
        const t = this.ages[i] / this.lifetimes[i];
        const r = THREE.MathUtils.lerp(this.baseColors[idx3 + 0], 1.0, t * 0.5);
        const g = THREE.MathUtils.lerp(
          this.baseColors[idx3 + 1],
          0.95,
          t * 0.7
        );
        const b = THREE.MathUtils.lerp(this.baseColors[idx3 + 2], 0.4, t * 0.3);

        colArr[idx3 + 0] = r * fade;
        colArr[idx3 + 1] = g * fade;
        colArr[idx3 + 2] = b * fade;
      } else {
        // Hide expired particles
        posArr[idx3 + 0] = 9999;
        posArr[idx3 + 1] = 9999;
        posArr[idx3 + 2] = 9999;
      }
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
  }
}
