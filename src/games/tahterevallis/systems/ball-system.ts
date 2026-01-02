import {
  Object3D,
  Scene,
  MathUtils,
  Vector3,
  BufferGeometry,
  Mesh,
  Material,
} from "three";
import RAPIER, { Collider } from "@dimforge/rapier3d";
import { Ball } from "../objects/ball";
import { PhysicsWorld } from "@/games/engine/physics/physics-world";
import { createDynamicBall } from "../factories/ball-factory";
import { GAME_BALLS, LevelConfig } from "../config";
import { SparkleSystem } from "../systems/sparkle-system";
import { GameDisposable } from "@/games/types";

export type BallCaptureTarget = {
  anchor: Object3D; // where to attach
  localOffset: Vector3;
};

type BallState = "inactive" | "active" | "captured";

type BallEntry = {
  id: string;
  mesh: Object3D;
  body: RAPIER.RigidBody;
  collider: Collider;
  state: BallState;
};

export interface ActiveBallQuery {
  getActiveBalls(): readonly BallEntry[];
}

export class BallSystem implements GameDisposable {
  private nextBallId = 0;
  private ballSpeeds = new Map<RAPIER.RigidBody, number>();
  private balls: {
    mesh: Object3D;
    body: RAPIER.RigidBody;
    collider: Collider;
    id: string;
    state: BallState;
  }[] = [];

  constructor(
    private scene: Scene,
    private physicsWorld: PhysicsWorld,
    private sparkleSystem: SparkleSystem
  ) {
    for (const ball of GAME_BALLS) {
      this.put(ball.radius, ball.initPosition);
    }
  }

  put(radius: number, initPosition: [number, number, number] = [0, 1, 0]) {
    const ballId = this.createBallId();
    const ball = new Ball(radius, initPosition);
    this.scene.add(ball.mesh);

    const { body, collider } = createDynamicBall(
      radius,
      initPosition,
      this.physicsWorld.getWorld()
    );
    this.physicsWorld.addColliderMeta(collider, {
      kind: "ball",
      entityId: ballId,
    });
    this.balls.push({
      mesh: ball.mesh,
      collider,
      body,
      id: ballId,
      state: "inactive",
    });
    this.ballSpeeds.set(body, 0);
  }

  applyLevel(config: LevelConfig) {
    const activeCount = config.totalBalls;

    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];

      if (ball.state == "captured") {
        this.resetBallAttachment(ball);
      }

      if (i < activeCount) {
        this.resetBallTransform(ball, GAME_BALLS[i].initPosition);
        this.activateBall(ball);
      } else {
        this.deactivateBall(ball);
      }
    }
  }

  private resetBallTransform(
    ball: BallEntry,
    initPosition: [number, number, number]
  ) {
    const [x, y, z] = initPosition;

    ball.body.setTranslation({ x, y, z }, true);
    ball.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ball.body.setAngvel({ x: 0, y: 0, z: 0 }, true);

    ball.mesh.position.copy({ x, y, z });
    ball.mesh.rotation.set(0, 0, 0);
  }

  private resetBallAttachment(ball: BallEntry) {
    if (ball.mesh.parent !== this.scene) {
      this.scene.attach(ball.mesh);
    }
  }

  private activateBall(ball: BallEntry) {
    ball.state = "active";

    ball.collider.setEnabled(true);
    ball.body.setEnabled(true);

    ball.body.setTranslation(ball.body.translation(), true);

    ball.mesh.visible = true;
  }

  private deactivateBall(ball: BallEntry) {
    ball.state = "inactive";

    ball.collider.setEnabled(false);
    ball.body.setEnabled(false);

    ball.mesh.visible = false;
  }

  captureBall(ballId: string, target: BallCaptureTarget) {
    const ball = this.balls.find((b) => b.id === ballId);
    if (!ball || ball.state != "active") return;

    // 1. Disable physics cleanly
    ball.collider.setEnabled(false);
    ball.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    ball.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    ball.body.setEnabled(false);

    target.anchor.add(ball.mesh);
    ball.mesh.position.copy(target.localOffset);
    ball.mesh.rotation.set(0, 0, 0);

    ball.state = "captured";
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

  getActiveBalls(): readonly BallEntry[] {
    return this.balls.filter((b) => b.state === "active");
  }

  update(dt: number) {
    for (const { mesh, body, state } of this.balls) {
      if (state !== "active") continue;
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

  dispose() {
    for (const ball of this.balls) {
      // 1. Remove Three.js mesh safely
      if (ball.mesh.parent) {
        ball.mesh.parent.remove(ball.mesh);
      }

      // Optional but correct if geometries/materials are unique
      ball.mesh.traverse((obj) => {
        if (obj instanceof Mesh) {
          const geometry = obj.geometry;
          if (geometry instanceof BufferGeometry) {
            geometry.dispose();
          }

          const material = obj.material;
          if (Array.isArray(material)) {
            material.forEach((m: Material) => m.dispose());
          } else if (material instanceof Material) {
            material.dispose();
          }
        }
      });

      // 2. Remove physics metadata first
      this.physicsWorld.removeColliderMeta(ball.collider);

      // 3. Remove Rapier collider and rigid body
      const world = this.physicsWorld.getWorld();

      if (ball.collider) {
        world.removeCollider(ball.collider, true);
      }

      if (ball.body) {
        world.removeRigidBody(ball.body);
      }
    }

    // 4. Clear internal references
    this.balls.length = 0;
    this.ballSpeeds.clear();
  }
}
