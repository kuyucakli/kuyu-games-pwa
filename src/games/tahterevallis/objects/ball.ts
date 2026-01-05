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

export class BallRollingAudio {
  private source: AudioBufferSourceNode;
  private gain: GainNode;
  private minGain = 0.002; // silence floor
  private maxGain = 0.1; // hard ceiling
  private connected = true;

  constructor(buffer: AudioBuffer, output: AudioNode) {
    const ctx = output.context;

    this.source = ctx.createBufferSource();
    this.source.buffer = buffer;
    this.source.loop = true;

    this.gain = ctx.createGain();
    this.gain.gain.value = 0;

    this.source.connect(this.gain);
    this.gain.connect(output);
    this.source.start();
  }

  update(speed: number, dt: number, isTouchingTable: boolean) {
    const now = this.gain.context.currentTime;

    if (isTouchingTable && speed > 0.01) {
      if (!this.connected) {
        this.gain.connect(this.gain.context.destination);
        this.connected = true;
      }

      const normalized = Math.min(speed / 4, 1);
      const target = this.minGain + normalized * normalized * this.maxGain;
      this.gain.gain.setTargetAtTime(target, now, 0.05);
    } else {
      if (this.connected) {
        this.gain.disconnect();
        this.connected = false;
      }
    }
  }

  stop() {
    const now = this.gain.context.currentTime;
    this.gain.gain.setTargetAtTime(0, now, 0.1);
    // DO NOT stop the source, it will fade back in when rolling
  }
}
