import * as THREE from "three";
import mitt from "mitt";
import { Table } from "./objects/table";
import { SparkleSystem } from "./systems/sparkle-system";
import { Engine } from "../engine/core/engine";
import { OutofBoundsPlane } from "./objects/outof-bounds-plane";
import RAPIER from "@dimforge/rapier3d";
import { TiltInput } from "./input";
import { HoleSystem } from "./systems/hole-system";
import { GameAssets, HoleName, LEVELS_CONFIG } from "./config";
import { BallSystem } from "./systems/ball-system";
import { createTableTrimesh } from "./factories/table-factory";
import { AssetLoaderEvent, AssetManager } from "../engine/assets/asset-manager";

import { AudioSystem } from "./systems/audio-system";
import { LevelSystem } from "./systems/level-system";
import { TimerSystem } from "./systems/timer-system";
import { Property } from "@/lib/types/utils";
import { OutOfBoundsSystem } from "./systems/out-of-bounds-system";
import { GameDisposable } from "@/games/types";

type GameState = "idle" | "playing" | "paused" | "level-complete" | "game-over";

export type GameEvents = {
  "score:add": number;
  "ball:captureRequested": { ballName: string; holeName: string };
  "game:reset": void;
  "level:completed": { nextLevel: number };
  "level:remaining-time": { prettyFormatted: string; seconds: number };
  "level:failed": void;
  "fx:goal": THREE.Vector3;
  "goal:entered": {
    ballName: string;
    holeName: HoleName;
    pos: THREE.Vector3;
  };
  "ball:out-of-bounds": { ballId: string };
  "assets:completed": true;
  "assets:progress": Property<AssetLoaderEvent, "progress">;
  "audio:intro-home": void;
  "audio:select-game": void;
  "timer:updated": number;
};

export const gameEvents = mitt<GameEvents>();

export type GameBusCommands = {
  play: void;
  pause: void;
  replay: void;
};

//Command events that can be emitted by foreign code
export const gameBusCommands = mitt<GameBusCommands>();

export class Game {
  private tiltInput = new TiltInput();
  private sparkleSystem!: SparkleSystem;
  private engine!: Engine;
  private scene!: THREE.Scene;
  private table!: any;
  private holeSystem!: HoleSystem;
  private ballSystem!: BallSystem;
  private audioSystem!: AudioSystem;
  private levelSystem!: LevelSystem;
  private timerSystem!: TimerSystem;
  private outOfBoundsSystem!: OutOfBoundsSystem;
  private tableRigidBody!: RAPIER.RigidBody;
  private assets!: AssetManager<typeof GameAssets>;
  private mainCamera!: THREE.PerspectiveCamera;
  private state: GameState = "idle";
  private activeLevel = 1;
  private disposables: Array<GameDisposable> = [];

  async init(engine: Engine) {
    this.assets = new AssetManager();
    this.assets.events.on("allCompleted", () => {
      gameEvents.emit("assets:completed", true);
    });
    this.assets.events.on("progress", (data) => {
      gameEvents.emit("assets:progress", data);
    });

    await this.loadAssets();

    const gameObjectsGLTF = this.assets.get("gameObjects");

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
    tableInstance.attachRigidBody(this.tableRigidBody);

    this.setupScene();

    this.sparkleSystem = new SparkleSystem();
    this.scene.add(this.sparkleSystem.points);

    this.holeSystem = this.register(
      new HoleSystem(this.engine.physicsWorld, tableInstance)
    );
    this.holeSystem.registerFromTable();

    this.audioSystem = new AudioSystem(this.assets, this.engine.audioManager);

    this.ballSystem = this.register(
      new BallSystem(this.scene, engine.physicsWorld, this.sparkleSystem, () =>
        this.audioSystem.createBallRollingAudio()
      )
    );
    this.outOfBoundsSystem = new OutOfBoundsSystem(this.ballSystem);

    this.timerSystem = new TimerSystem();
    this.levelSystem = new LevelSystem(this.ballSystem, this.holeSystem);

    gameEvents.on("level:completed", ({ nextLevel }) => {
      this.state = "level-complete";
      this.timerSystem.stop();

      // small delay for FX
      setTimeout(() => {
        this.loadLevel(nextLevel);
      }, 800);
    });

    gameEvents.on("level:failed", () => {
      this.state = "game-over";
      this.timerSystem.stop();
    });

    gameEvents.on("ball:out-of-bounds", () => {
      if (this.state !== "playing") return;
      this.state = "game-over";
      this.timerSystem.stop();
      gameEvents.emit("level:failed");
    });

    this.loadLevel(1);

    gameBusCommands.on("play", () => this.resumeGame());
    gameBusCommands.on("pause", () => this.pauseGame());
    gameBusCommands.on("replay", () => this.loadLevel(this.activeLevel));

    const { w, h } = this.engine.viewport;

    this.fitCameraToTable(this.mainCamera, this.table, w, h, 640);
    this.applyCameraOrientation(this.mainCamera);

    window
      .matchMedia("(orientation: portrait)")
      .addEventListener("change", (e) => {
        const portrait = e.matches;

        const { w, h } = this.engine.viewport;

        this.mainCamera.aspect = w / h;
        this.mainCamera.updateProjectionMatrix();

        this.fitCameraToTable(this.mainCamera, this.table, w, h, 640);
        this.applyCameraOrientation(this.mainCamera);
      });
  }

  private register<T extends { dispose?: () => void }>(system: T): T {
    if (system.dispose) {
      this.disposables.push(system as any);
    }
    return system;
  }

  private applyCameraOrientation(camera: THREE.PerspectiveCamera) {
    const { w, h } = this.engine.viewport;
    const isPortrait = h > w;

    if (isPortrait) {
      // Rotate camera so Z becomes horizontal axis on screen
      camera.rotation.z = Math.PI / 2;
    }
  }

  private async loadAssets() {
    await Promise.all([
      this.assets.loadGLTF(
        "gameObjects",
        "/assets/tahterevallis/3d/game-objects.glb"
      ),
      this.assets.loadAudio(
        "goalSoundFx",
        "/assets/tahterevallis/audio/goal-fx.wav"
      ),
      this.assets.loadAudio(
        "ballRollingSoundFx",
        "/assets/tahterevallis/audio/ball-rolling-fx.wav"
      ),
    ]);
  }

  private setupCamera() {
    const { w, h } = this.engine.viewport;

    const camera = new THREE.PerspectiveCamera(56, w / h, 0.1, 100);
    camera.lookAt(0, 0, 0);

    this.mainCamera = camera;
    this.engine.registerCamera("main_perspective", camera);
  }

  private setupScene() {
    this.scene.background = new THREE.Color(0xff0000);
  }

  private setupLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(0, 8, -2);
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
      // Landscape: tilt forward/back → X rotation, left/right → Z rotation
      return { x: y, z: x };
    } else {
      // Portrait: camera rotated 90°, swap X and Z properly
      // New axes: screen up/down → table Z rotation, screen left/right → table X rotation
      return { x: x, z: -y };
    }
  }

  loadLevel(level: number) {
    const config = LEVELS_CONFIG[level - 1];
    if (!config) return;

    this.activeLevel = level;
    this.state = "idle";

    this.levelSystem.reset(level);
    this.holeSystem.applyLevel(config);
    this.ballSystem.applyLevel(config);
    this.outOfBoundsSystem.reset();

    this.timerSystem.start();
    this.state = "playing";
  }

  startGame() {
    this.state = "playing";
    this.timerSystem.start();
  }

  pauseGame() {
    if (this.state !== "playing") return;
    this.state = "paused";
    this.timerSystem.pause();
  }

  resumeGame() {
    if (this.state !== "paused") return;
    this.state = "playing";
    this.timerSystem.resume();
  }

  fitCameraToTable(
    camera: THREE.PerspectiveCamera,
    table: THREE.Object3D,
    viewportW: number,
    viewportH: number,
    maxTablePx = 600,
    offset = 1.1 // e.g., 10% padding around table
  ) {
    const box = new THREE.Box3().setFromObject(table);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const isPortrait = viewportH > viewportW;

    camera.aspect = viewportW / viewportH;
    camera.updateProjectionMatrix();

    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

    // Determine distances along X and Z axes
    // In portrait, we rotate the camera, so swap axes accordingly
    let fitDistanceX: number, fitDistanceZ: number;

    if (isPortrait) {
      // Camera rotated 90°, width of table maps to vertical FOV
      fitDistanceX = size.x / 2 / Math.tan(vFov / 2); // table width along vertical FOV
      fitDistanceZ = size.z / 2 / Math.tan(hFov / 2); // table depth along horizontal FOV
    } else {
      fitDistanceX = size.x / 2 / Math.tan(hFov / 2);
      fitDistanceZ = size.z / 2 / Math.tan(vFov / 2);
    }

    // Take the largest distance to fully fit table + apply uniform offset
    const distance = Math.max(fitDistanceX, fitDistanceZ) * offset;

    // Optional: enforce maxTablePx along dominant axis
    const dominantSize = isPortrait ? size.x : size.x;
    const screenAxis = isPortrait ? viewportH : viewportW;
    const pixelLimitedDistance =
      (dominantSize * screenAxis) /
      maxTablePx /
      (2 * Math.tan(isPortrait ? vFov / 2 : hFov / 2));

    const finalDistance = Math.max(distance, pixelLimitedDistance);

    // Apply camera
    camera.position.set(center.x, center.y + finalDistance, center.z);
    camera.near = finalDistance / 50;
    camera.far = finalDistance * 6;
    camera.updateProjectionMatrix();
    camera.lookAt(center);

    // Rotate for portrait
    camera.rotation.z = isPortrait ? Math.PI / 2 : 0;
  }

  update(dt: number) {
    if (this.state != "playing") return;

    this.engine.physicsWorld.step(dt);

    this.ballSystem.update(dt);
    this.outOfBoundsSystem.update();

    const mapped = this.mapTiltInput(this.tiltInput.x, this.tiltInput.y);
    this.tiltTable(mapped.x, mapped.z);

    this.sparkleSystem.update(dt * 2);
    this.timerSystem.update(dt);
  }

  reset() {
    gameEvents.emit("game:reset");
  }

  dispose() {
    // stop game
    this.state = "idle";

    // dispose systems (reverse order is safer)
    for (let i = this.disposables.length - 1; i >= 0; i--) {
      this.disposables[i].dispose();
    }
    this.disposables.length = 0;

    // clear scene
    this.scene.traverse((obj) => {
      if ((obj as any).geometry) (obj as any).geometry.dispose?.();
      if ((obj as any).material) {
        const m = (obj as any).material;
        if (Array.isArray(m)) m.forEach((mat) => mat.dispose?.());
        else m.dispose?.();
      }
    });

    // clear mitt listeners
    gameEvents.all.clear();
    gameBusCommands.all.clear();
  }
}
