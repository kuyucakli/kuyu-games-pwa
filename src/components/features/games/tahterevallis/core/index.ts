import * as THREE from "three";
import mitt from "mitt";
import { Table } from "../objects/table";
import { SparkleSystem } from "../fx/sparkle";
import { Engine } from "../../engine/core/engine";
import { OutofBoundsPlane } from "../objects/outof-bounds-plane";
import { Ball } from "../objects/ball";
import RAPIER from "@dimforge/rapier3d";
import { TiltInput } from "../input";

export type GameEvents = {
  "score:add": number;
  "player:damage": number;
  "game:reset": void;
};

export const gameEvents = mitt<GameEvents>();

export class Game {
  private dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = [];
  private tiltInput = new TiltInput();
  private sparkleSystem!: SparkleSystem;
  private engine!: Engine;
  private scene!: THREE.Scene;
  private table!: any;
  private tableRigidBody!: RAPIER.RigidBody;
  private ballSpeeds = new Map<RAPIER.RigidBody, number>();

  async init(engine: Engine) {
    await engine.physicsWorld.init();

    this.engine = engine;
    this.scene = engine.scene;

    this.setupCamera();
    this.setupLights();

    const table = new Table();
    await table.load(new THREE.Vector3(0, 0, 0));

    const outofBoundsPlane = new OutofBoundsPlane();
    await outofBoundsPlane.load();

    this.tiltInput.attach(this.engine);
    this.table = table.group;
    this.scene.add(table.group);
    this.scene.add(outofBoundsPlane.getMesh());
    this.addBall(0.28);
    this.addBall(0.28, [0, 1, 4]);
    this.tableRigidBody = engine.physicsWorld.createKinematicTrimesh(
      table.getColliderTrimeshLocal().vertices,
      table.getColliderTrimeshLocal().indices,
      new THREE.Vector3(0, 0, 0)
    );

    this.setupScene();

    this.sparkleSystem = new SparkleSystem();
    this.scene.add(this.sparkleSystem.points);
  }

  private setupCamera() {
    const { w, h } = this.engine.viewport;
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
    if (w > h) {
      camera.position.set(0, 16, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 16, 0);
      camera.lookAt(0, 0, 0);
      camera.rotation.set(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z + Math.PI / 2
      );
    }
    this.engine.registerCamera("main_perspective", camera);
  }

  private setupScene() {
    this.scene.background = new THREE.Color(0xff0000);
  }

  private setupLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, 12, -6);
    light.castShadow = true;
    // --- Increase shadow map resolution ---
    light.shadow.mapSize.width = 1024 * 2;
    light.shadow.mapSize.height = 1024 * 2;
    light.shadow.radius = 0.2;
    light.shadow.blurSamples = 2;
    light.shadow.bias = -0.0004;
    // light.shadow.camera.near = 0;
    // light.shadow.camera.far = 100;
    // --- Expand the shadow camera bounds ---
    const cam = light.shadow.camera as THREE.OrthographicCamera;
    cam.left = -10;
    cam.right = 10;
    cam.top = 10;
    cam.bottom = -10;
    cam.near = 0.5;
    cam.far = 30;
    cam.updateProjectionMatrix();
    // --- Add a slight ambient fill light ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);
    this.scene.add(light);
  }

  private addBall(
    radius: 0.28,
    position: [number, number, number] = [0, 1, 0]
  ) {
    const ball = new Ball(radius, position);
    this.scene.add(ball.mesh);
    const { body } = this.engine.physicsWorld.createDynamicBall(
      radius,
      position
    );
    this.dynamicBodies.push([ball.mesh, body]);
  }

  tiltTable(tiltxInput: number, tiltzInput: number) {
    const maxTiltX = Math.PI / 12;
    const maxTiltZ = Math.PI / 12;

    const targetTiltX = maxTiltX * tiltxInput;
    const targetTiltZ = maxTiltZ * tiltzInput;

    const tiltX = THREE.MathUtils.lerp(this.table.rotation.x, targetTiltX, 0.1);
    const tiltZ = THREE.MathUtils.lerp(this.table.rotation.z, targetTiltZ, 0.1);

    this.table.rotation.x = tiltX;
    this.table.rotation.z = tiltZ;

    const q = this.table.quaternion;

    this.tableRigidBody.setNextKinematicRotation(
      new RAPIER.Quaternion(q.x, q.y, q.z, q.w)
    );
  }

  dispose() {}

  private mapTiltInput(x: number, y: number): { x: number; z: number } {
    const { w, h } = this.engine.viewport;
    const isPortrait = h > w;

    if (!isPortrait) {
      return {
        x: y,
        z: x,
      };
    }
    // rotate control space 90° clockwise
    return { x, z: y };
  }

  private emitSparkles(
    position: THREE.Vector3,
    velocity: RAPIER.Vector,
    speed: number,
    dt: number
  ) {
    const MIN = 1.8;
    const MAX = 4.0;

    if (speed < MIN) return;

    const intensity = THREE.MathUtils.clamp((speed - MIN) / (MAX - MIN), 0, 1);

    const count = Math.floor(THREE.MathUtils.lerp(1, 6, intensity));

    for (let i = 0; i < count; i++) {
      this.sparkleSystem.emit(
        position,
        new THREE.Vector3(velocity.x, velocity.y, velocity.z)
      );
    }
  }

  update(dt: number) {
    this.engine.physicsWorld.step(dt);
    for (const [mesh, body] of this.dynamicBodies) {
      mesh.position.copy(body.translation());
      mesh.quaternion.copy(body.rotation());
      const v = body.linvel();
      const speed = Math.hypot(v.x, v.y, v.z);

      const prev = this.ballSpeeds.get(body) ?? speed;
      const smoothSpeed = THREE.MathUtils.lerp(prev, speed, 0.1);
      this.ballSpeeds.set(body, smoothSpeed);

      this.emitSparkles(mesh.position, v, smoothSpeed, dt);
    }
    const mapped = this.mapTiltInput(this.tiltInput.x, this.tiltInput.y);
    this.tiltTable(mapped.x, mapped.z);
    //this.sparkleSystem.update(dt);
  }

  reset() {
    gameEvents.emit("game:reset");
  }
}

//   // Sync dynamic objects (like the ball)
//   for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
//     const [mesh, body] = this.dynamicBodies[i];
//     mesh.position.copy(body.translation());
//     mesh.quaternion.copy(body.rotation());

//     // --- Sparkles when speed is high ---
//     const vel = body.linvel();
//     const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
//     this.smoothedSpeed = THREE.MathUtils.lerp(this.smoothedSpeed, speed, 0.1);

//     const minSpeed = 1.9; // below this → very faint sparkles
//     const maxSpeed = 3.9; // above this → full sparkle intensity

//     // Normalize speed into 0–1 range
//     const intensity = THREE.MathUtils.clamp(
//       (this.smoothedSpeed - minSpeed) / (maxSpeed - minSpeed),
//       0,
//       1
//     );

//     // Sparkle density — more emissions at higher speeds
//     const sparkleCount = Math.floor(THREE.MathUtils.lerp(1, 6, intensity));

//     // Emit sparkles proportional to speed
//     for (let s = 0; s < sparkleCount; s++) {
//       this.sparkleSystem.emit(
//         mesh.position,
//         new THREE.Vector3(vel.x, vel.y, vel.z)
//       );
//     }
//   }

//   this.sparkleSystem.update(dt);
