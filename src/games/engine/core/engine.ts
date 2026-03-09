import * as THREE from "three";
import { PhysicsWorld } from "../physics/physics-world";
import { Game } from "../../tahterevallis";
import { GameAudioManager } from "../audio/game-audio-manager";
import { RapierDebugRenderer } from "./debug-renderer";

export class Engine {
  public readonly scene = new THREE.Scene();
  public readonly renderer: THREE.WebGLRenderer;
  private rapierDebug?: RapierDebugRenderer;
  private debugPhysics = false;
  public readonly physicsWorld: PhysicsWorld;
  private cameras = new Map<string, THREE.Camera>();
  private activeCamera?: THREE.Camera;
  public readonly audioManager = new GameAudioManager();
  private rafId?: number;
  private lastTime = performance.now();
  private elapsed = 0;
  private game?: Game;

  constructor(
    private container: HTMLElement,
    physicsWorld: PhysicsWorld,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.physicsWorld = physicsWorld;
    // debug
    this.rapierDebug = new RapierDebugRenderer(
      this.scene,
      this.physicsWorld.getWorld(),
    );

    container.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.handleResize);
    this.renderer;
  }

  static async create(container: HTMLDivElement): Promise<Engine> {
    const physicsWorld = await PhysicsWorld.create();
    return new Engine(container, physicsWorld);
  }

  render(scene: THREE.Scene) {
    if (!this.activeCamera) {
      throw new Error("No active camera set");
    }

    this.renderer.render(scene, this.activeCamera);
  }

  async mount(game: Game) {
    this.game = game;
    await game.init(this);
    this.start();
  }

  private start() {
    this.lastTime = performance.now();
    this.loop();
  }

  get viewport() {
    return {
      w: this.container.clientWidth,
      h: this.container.clientHeight,
    };
  }

  private loop = () => {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.elapsed += dt;
    this.game?.update(dt, this.elapsed);
    this.render(this.scene);

    if (this.debugPhysics && this.rapierDebug) {
      this.rapierDebug.update();
    }

    this.rafId = requestAnimationFrame(this.loop);
  };

  setActiveCamera(name: string) {
    const cam = this.cameras.get(name);
    if (!cam) throw new Error(`Camera '${name}' not found`);
    this.activeCamera = cam;
    this.audioManager.attachCamera(cam);
  }

  public registerCamera(name: string, camera: THREE.Camera) {
    this.cameras.set(name, camera);
    if (!this.activeCamera) this.activeCamera = camera;
  }

  private handleResize = () => {
    if (!this.activeCamera) {
      return;
    }
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (this.activeCamera instanceof THREE.PerspectiveCamera) {
      this.activeCamera.aspect = w / h;
      this.activeCamera.updateProjectionMatrix();
    }

    if (this.activeCamera instanceof THREE.OrthographicCamera) {
      this.activeCamera.updateProjectionMatrix();
    }
    this.renderer.setSize(w, h);
  };

  dispose() {
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
    this.renderer.dispose();
    window.removeEventListener("resize", this.handleResize);
    this.physicsWorld.dispose();
    this.game?.dispose();
    this.renderer.domElement.remove();
  }
}
