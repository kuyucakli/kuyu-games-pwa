import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import mitt from "mitt";
import { Table } from "../objects/table";
import { RapierDebugRenderer } from "./debug-renderer";
import RAPIER from "@dimforge/rapier3d";
import { SparkleSystem } from "../fx/sparkle";

export type GameEvents = {
  "score:add": number;
  "player:damage": number;
  "game:reset": void;
};

export const gameEvents = mitt<GameEvents>();

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private world: any;
  private RAPIER: any;
  private rafId?: number;
  private table?: Table;
  private container: HTMLElement;
  private debugRenderer: any;
  private dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][];
  private mouse = { x: 0, y: 0 };
  private sparkleSystem!: SparkleSystem;
  private lastTime = performance.now();
  private smoothedSpeed: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.dynamicBodies = [];
    this.container.appendChild(this.renderer.domElement);
    this.smoothedSpeed = 0;

    this.camera = this.setupCamera(
      container.clientWidth,
      container.clientHeight
    );

    this.controls = this.setupControls();
  }

  async init() {
    // Load WASM
    this.RAPIER = await import("@dimforge/rapier3d");
    this.world = new this.RAPIER.World({ x: 0, y: -9.81, z: 0 });

    this.setupScene();
    this.setupLights();
    this.debugRenderer = new RapierDebugRenderer(this.scene, this.world);

    this.table = new Table(this.RAPIER, this.world);
    await this.table.load(this.scene, [0, 0, 0]);

    this.sparkleSystem = new SparkleSystem();
    this.scene.add(this.sparkleSystem.points);

    this.addBall([-0.25, 1, 0.22]);
    this.addBall([0.25, 1, 0.22]);
    this.setupMouseControls();

    window.addEventListener("resize", this.handleResize);
  }

  private setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.target.y = 1;
    return controls;
  }

  private setupCamera(w: number, h: number) {
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
    camera.position.set(0, 2, 0);
    return camera;
  }

  private setupScene() {
    this.scene.background = new THREE.Color(0x777777);
  }

  private setupLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 10, 5);
    light.castShadow = true;

    // --- Increase shadow map resolution ---
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;

    // --- Expand the shadow camera bounds ---
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    cam.left = -10;
    cam.right = 10;
    cam.top = 10;
    cam.bottom = -10;
    cam.near = 0.5;
    cam.far = 30;
    cam.updateProjectionMatrix();

    // --- (Optional) Softer shadows ---
    light.shadow.radius = 4;

    // --- Add a slight ambient fill light ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambient);

    this.scene.add(light);
  }

  private setupMouseControls() {
    window.addEventListener("mousemove", (e) => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.mouse.x = (e.clientX / w) * 2 - 1;
      this.mouse.y = -((e.clientY / h) * 2 - 1);
    });
  }

  private handleResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private addBall(position: [number, number, number] = [0, 1, 0]) {
    const radius = 0.3;

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.8,
      roughness: 0.3,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.position.set(...position);
    this.scene.add(mesh);

    const body = this.world.createRigidBody(
      this.RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(...position)
        .setCcdEnabled(true)
    );

    const colliderDesc = this.RAPIER.ColliderDesc.ball(radius)
      .setMass(1)
      .setRestitution(0.5)
      .setFriction(0.8);

    this.world.createCollider(colliderDesc, body);

    this.dynamicBodies.push([mesh, body]);
    return { mesh, body };
  }

  start() {
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.world.step();

    // Sync dynamic objects (like the ball)
    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      const [mesh, body] = this.dynamicBodies[i];
      mesh.position.copy(body.translation());
      mesh.quaternion.copy(body.rotation());

      // --- Sparkles when speed is high ---
      const vel = body.linvel();
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
      this.smoothedSpeed = THREE.MathUtils.lerp(this.smoothedSpeed, speed, 0.1);

      const minSpeed = 1.9; // below this → very faint sparkles
      const maxSpeed = 3.9; // above this → full sparkle intensity

      // Normalize speed into 0–1 range
      const intensity = THREE.MathUtils.clamp(
        (this.smoothedSpeed - minSpeed) / (maxSpeed - minSpeed),
        0,
        1
      );

      // Sparkle density — more emissions at higher speeds
      const sparkleCount = Math.floor(THREE.MathUtils.lerp(1, 6, intensity));

      // Emit sparkles proportional to speed
      for (let s = 0; s < sparkleCount; s++) {
        this.sparkleSystem.emit(
          mesh.position,
          new THREE.Vector3(vel.x, vel.y, vel.z)
        );
      }

      // Optional: scale sparkle brightness slightly with speed
      this.sparkleSystem.points.material.size = 0.04 + intensity * 0.02; // subtle size increase
    }

    this.sparkleSystem.update(dt);

    if (this.table) {
      const maxTiltX = Math.PI / 12;
      const maxTiltZ = Math.PI / 12;

      const targetTiltX = maxTiltX * this.mouse.y;
      const targetTiltZ = maxTiltZ * this.mouse.x;

      // Smooth lerp
      const tiltX = THREE.MathUtils.lerp(
        this.table.tableGroup.rotation.x,
        targetTiltX,
        0.1
      );
      const tiltZ = THREE.MathUtils.lerp(
        this.table.tableGroup.rotation.z,
        targetTiltZ,
        0.1
      );

      this.table.tilt(tiltX, tiltZ);
    }

    this.checkCollisions();
    this.renderer.render(this.scene, this.camera);
    //this.debugRenderer.update();
    this.controls.update();

    this.rafId = requestAnimationFrame(this.animate);
  }

  dispose() {
    cancelAnimationFrame(this.rafId!);
    this.renderer.dispose();
  }

  private checkCollisions() {
    const coinCollected = Math.random() < 0.01;
    if (coinCollected) {
      gameEvents.emit("score:add", 10);
    }

    const hit = Math.random() < 0.005;
    if (hit) {
      gameEvents.emit("player:damage", 5);
    }
  }

  reset() {
    gameEvents.emit("game:reset");
  }
}
