import * as THREE from "three";
import mitt from "mitt";
import { Table } from "./objects/table";
import { SparkleSystem } from "./fx/sparkle";
import { Engine } from "../engine/core/engine";
import { OutofBoundsPlane } from "./objects/outof-bounds-plane";
import RAPIER, { Collider } from "@dimforge/rapier3d";
import { TiltInput } from "./input";
import { HoleSystem } from "./systems/hole-system";
import { GameAssets, LEVELS_CONFIG } from "./config";
import { BallSystem } from "./systems/ball-system";
import { createTableTrimesh } from "./factories/table-factory";
import { AssetManager } from "../engine/assets/asset-manager";
import { AudioSystem } from "./systems/audio-system";
import { AudioDirector } from "../engine/audio/audio-director";

export type GameEvents = {
  "score:add": number;
  "player:damage": number;
  "game:reset": void;
  "goal:entered": {
    holeName: string;
    pos: THREE.Vector3;
  };
  "assets:completed": true;
  "audio:intro-home": void;
  "audio:select-game": void;
};

export const gameEvents = mitt<GameEvents>();

export class Game {
  private tiltInput = new TiltInput();
  private sparkleSystem!: SparkleSystem;
  private engine!: Engine;
  private scene!: THREE.Scene;
  private table!: any;
  private holeSystem!: HoleSystem;
  private ballSystem!: BallSystem;
  private audioSystem!: AudioSystem;
  private tableRigidBody!: RAPIER.RigidBody;
  private assetManager!: AssetManager<typeof GameAssets>;
  private mainCamera!: THREE.PerspectiveCamera;

  async init(engine: Engine) {
    this.assetManager = new AssetManager<typeof GameAssets>();
    this.assetManager.events.on("allCompleted", () => {
      gameEvents.emit("assets:completed", true);
    });
    await this.loadAssets();

    const gameObjectsGLTF = this.assetManager.get("gameObjects");

    this.engine = engine;
    this.scene = engine.scene;

    this.setupCamera();
    this.setupLights();

    const tableInstance = new Table(
      gameObjectsGLTF,
      new THREE.Vector3(0, 0, 0)
    );
    const outofBoundsPlane = new OutofBoundsPlane(gameObjectsGLTF);

    this.tiltInput.attach(this.engine);
    this.table = tableInstance.group;
    this.scene.add(tableInstance.group);
    this.scene.add(outofBoundsPlane.getMesh());

    this.tableRigidBody = createTableTrimesh(
      tableInstance.getColliderTrimeshLocal().vertices,
      tableInstance.getColliderTrimeshLocal().indices,
      new THREE.Vector3(0, 0, 0),
      engine.physicsWorld
    );

    this.setupScene();

    this.sparkleSystem = new SparkleSystem();
    this.scene.add(this.sparkleSystem.points);

    this.holeSystem = new HoleSystem(
      this.engine.physicsWorld,
      tableInstance,
      this.scene
    );
    this.holeSystem.registerFromTable();
    this.holeSystem.applyLevel(LEVELS_CONFIG[0]);

    this.ballSystem = new BallSystem(
      this.scene,
      engine.physicsWorld,
      this.sparkleSystem
    );
    this.ballSystem.applyLevel(LEVELS_CONFIG[0]);

    this.audioSystem = new AudioSystem(
      this.assetManager,
      this.engine.audioDirector
    );

    gameEvents.on("goal:entered", ({ pos }) => {
      this.sparkleSystem.emitBurst(pos, {
        count: 600,
        speed: 2,
        spread: 3.0,
        upwardBias: 2.6,
      }); // or trigger a burst
    });
  }

  private async loadAssets() {
    await Promise.all([
      this.assetManager.loadGLTF(
        "gameObjects",
        "/assets/tahterevallis/3d/game-objects.glb"
      ),
      this.assetManager.loadAudio(
        "homeIntroMusic",
        "/assets/tahterevallis/audio/trap-intro.wav"
      ),
      this.assetManager.loadAudio(
        "goalSoundFx",
        "/assets/tahterevallis/audio/goal-fx.wav"
      ),
    ]);
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

    this.mainCamera = camera;
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

  update(dt: number) {
    this.engine.physicsWorld.step(dt);
    this.ballSystem.update(dt);
    const mapped = this.mapTiltInput(this.tiltInput.x, this.tiltInput.y);
    this.tiltTable(mapped.x, mapped.z);
    this.sparkleSystem.update(dt * 2);
  }

  reset() {
    gameEvents.emit("game:reset");
  }

  dispose() {}
}
