import { Object3D, Scene, MathUtils, Vector3 } from "three";
import RAPIER from "@dimforge/rapier3d";
import { Ball } from "../objects/ball";
import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import { createDynamicBall } from "../factories/ball-factory";
import { LevelConfig } from "../config";
import { SparkleSystem } from "../fx/sparkle";

export class BallSystem {
  private nextBallId = 0;
  private ballSpeeds = new Map<RAPIER.RigidBody, number>();
  private balls: { mesh: Object3D; body: RAPIER.RigidBody }[] = [];

  constructor(
    private scene: Scene,
    private physicsWorld: PhysicsWorld,
    private sparkleSystem: SparkleSystem
  ) {}

  put(radius: number, position: [number, number, number] = [0, 1, 0]) {
    const ballId = this.createBallId();
    const ball = new Ball(radius, position);
    this.scene.add(ball.mesh);

    const { body, collider } = createDynamicBall(
      radius,
      position,
      this.physicsWorld.getWorld()
    );
    this.physicsWorld.addColliderMeta(collider, {
      kind: "ball",
      entityId: ballId,
    });
    this.balls.push({ mesh: ball.mesh, body });
    this.ballSpeeds.set(body, 0);
  }

  private clear() {
    for (const { mesh, body } of this.balls) {
      this.scene.remove(mesh);
      // this.physicsWorld.removeRigidBody(body);
    }

    this.balls.length = 0;
    this.ballSpeeds.clear();
  }

  applyLevel(config: LevelConfig) {
    //this.clear();

    for (const ball of config.balls) {
      this.put(ball.radius, ball.position);
    }
  }

  private emitSparkles(
    position: Vector3,
    velocity: RAPIER.Vector,
    speed: number
  ) {
    const MIN = 1.8;
    const MAX = 4.0;

    if (speed < MIN) return;

    const intensity = MathUtils.clamp((speed - MIN) / (MAX - MIN), 0, 1);

    const count = Math.floor(MathUtils.lerp(1, 6, intensity));

    for (let i = 0; i < count; i++) {
      this.sparkleSystem.emit(
        position,
        new Vector3(velocity.x, velocity.y, velocity.z)
      );
    }
  }

  private createBallId() {
    return `ball-${++this.nextBallId}`;
  }

  update(dt: number) {
    for (const { mesh, body } of this.balls) {
      mesh.position.copy(body.translation());
      mesh.quaternion.copy(body.rotation());

      const v = body.linvel();
      const speed = Math.hypot(v.x, v.y, v.z);

      const prev = this.ballSpeeds.get(body) ?? speed;
      const smoothSpeed = MathUtils.lerp(prev, speed, 0.1);

      this.ballSpeeds.set(body, smoothSpeed);
      this.emitSparkles(mesh.position, v, smoothSpeed);
    }
  }
}
