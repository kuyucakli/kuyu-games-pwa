import * as THREE from "three";
import { gameEvents } from "..";

export class SparkleSystem {
  points: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private maxCount = 800;
  private lifetimes: Float32Array;
  private ages: Float32Array;
  private velocities: Float32Array;
  private baseColors: Float32Array;
  private cursor = 0;

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
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, this.material);

    gameEvents.on("fx:goal", (pos) => {
      this.emitBurst(pos, {
        count: 600,
        speed: 2,
        spread: 3.0,
        upwardBias: 2.6,
      });
    });
  }

  emit(position: THREE.Vector3, baseVelocity?: THREE.Vector3) {
    const positions = this.geometry.attributes
      .position as THREE.BufferAttribute;
    const colors = this.geometry.attributes.color as THREE.BufferAttribute;

    // const i = this.ages.findIndex((age, idx) => age >= this.lifetimes[idx]);
    // const index = i === -1 ? Math.floor(Math.random() * this.maxCount) : i;

    const index = this.cursor;
    this.cursor = (this.cursor + 1) % this.maxCount;

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

  emitBurst(
    position: THREE.Vector3,
    options?: {
      count?: number;
      speed?: number;
      spread?: number;
      upwardBias?: number;
    }
  ) {
    const {
      count = 40,
      speed = 1.2,
      spread = 1.0,
      upwardBias = 0.6,
    } = options ?? {};

    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        Math.random() * upwardBias,
        (Math.random() - 0.5) * spread
      )
        .normalize()
        .multiplyScalar(speed * (0.6 + Math.random() * 0.6));

      this.emit(position, dir);
    }
  }

  update(delta: number) {
    const positions = this.geometry.attributes
      .position as THREE.BufferAttribute;
    const colors = this.geometry.attributes.color as THREE.BufferAttribute;
    const posArr = positions.array as Float32Array;
    const colArr = colors.array as Float32Array;

    for (let i = 0; i < this.maxCount; i++) {
      const lifetime = this.lifetimes[i];
      if (lifetime <= 0) continue;

      const idx3 = i * 3;
      this.ages[i] += delta;

      if (this.ages[i] >= lifetime) {
        this.lifetimes[i] = 0; // mark inactive
        continue;
      }

      const fade = 1 - this.ages[i] / lifetime;

      this.velocities[idx3 + 0] *= 0.95;
      this.velocities[idx3 + 1] *= 0.95;
      this.velocities[idx3 + 2] *= 0.95;

      posArr[idx3 + 0] += this.velocities[idx3 + 0] * delta * 6;
      posArr[idx3 + 1] += this.velocities[idx3 + 1] * delta * 6;
      posArr[idx3 + 2] += this.velocities[idx3 + 2] * delta * 6;

      colArr[idx3 + 0] *= fade;
      colArr[idx3 + 1] *= fade;
      colArr[idx3 + 2] *= fade;
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
  }
}
