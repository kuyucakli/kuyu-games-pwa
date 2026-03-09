import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import { TextureLoader, AudioLoader, Texture } from "three";
import mitt from "mitt";

export type AssetLoaderEvent = {
  progress: { queueCount: number; loadedCount: number; lastLoaded: string };
  allCompleted: void;
  loaded: string;
  error: { name: string; message: string };
};
type AssetKey<T> = Extract<keyof T, string>;

type GameAssetDescriptor =
  | { type: "gltf"; url: string }
  | { type: "audio"; url: string }
  | { type: "texture"; url: string };

export type GameAssets = Record<string, GameAssetDescriptor>;

type AssetCache<TAssets extends Record<string, GameAssetDescriptor>> = {
  [K in keyof TAssets]?: LoadResult<TAssets[K]>;
};

type LoadResult<T extends GameAssetDescriptor> = T["type"] extends "gltf"
  ? GLTF
  : T["type"] extends "audio"
    ? AudioBuffer
    : T["type"] extends "texture"
      ? Texture
      : never;

type KeysByType<
  TAssets extends Record<string, GameAssetDescriptor>,
  TType extends GameAssetDescriptor["type"],
> = {
  [K in keyof TAssets]: K extends string
    ? TAssets[K]["type"] extends TType
      ? K
      : never
    : never;
}[keyof TAssets];

export class AssetManager<TAssets extends Record<string, GameAssetDescriptor>> {
  private textureLoader = new TextureLoader();
  private audioLoader = new AudioLoader();
  private GLTFLoader = new GLTFLoader();
  private cache: AssetCache<TAssets> = {};
  public events = mitt<AssetLoaderEvent>();
  private loadedCount: number = 0;
  private queueCount: number = 0;

  private addQueueCount(count: number) {
    this.queueCount += count;
  }

  get<K extends keyof TAssets>(key: K): LoadResult<TAssets[K]> {
    const asset = this.cache[key];
    if (!asset) {
      throw new Error(`Asset not found: ${String(key)}`);
    }
    return asset;
  }

  loadAudio<K extends KeysByType<TAssets, "audio">>(name: K, url: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.cache[name]) {
        resolve();
        return;
      }
      this.addQueueCount(1);
      this.emitProgress();
      this.audioLoader.load(
        url,
        (data) => {
          this.cache[name] = data as LoadResult<TAssets[typeof name]>;
          this.trackProgress(name);
          resolve();
        },
        (progressEv) => {},
        (err) => {
          this.events.emit("error", {
            name: name,
            message: JSON.stringify(err),
          });
          reject(err);
        },
      );
    });
  }

  loadTexture<K extends KeysByType<TAssets, "texture">>(name: K, url: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.cache[name]) {
        resolve();
        return;
      }

      this.addQueueCount(1);
      this.emitProgress();

      this.textureLoader.load(
        url,
        (texture) => {
          this.cache[name] = texture as LoadResult<TAssets[typeof name]>;
          this.trackProgress(name);
          resolve();
        },
        undefined,
        (err) => {
          this.events.emit("error", { name, message: JSON.stringify(err) });
          reject(err);
        },
      );
    });
  }

  loadGLTF<K extends KeysByType<TAssets, "gltf">>(name: K, url: string) {
    return new Promise<void>((resolve, reject) => {
      if (this.cache[name]) {
        resolve();
        return;
      }
      this.addQueueCount(1);
      this.emitProgress();
      this.GLTFLoader.load(
        url,
        (data: GLTF) => {
          this.cache[name] = data as LoadResult<TAssets[typeof name]>;
          this.trackProgress(name);
          resolve();
        },
        (progress) => {},
        (err) => {
          this.events.emit("error", { name, message: JSON.stringify(err) });
          reject(err);
        },
      );
    });
  }

  private trackProgress<K extends AssetKey<TAssets>>(name: K) {
    this.loadedCount++;
    this.events.emit("loaded", name);
    this.emitProgress(name);
    if (this.loadedCount === this.queueCount) {
      this.events.emit("allCompleted");
    }
  }

  private emitProgress(lastLoaded?: string) {
    this.events.emit("progress", {
      queueCount: this.queueCount,
      loadedCount: this.loadedCount,
      lastLoaded: lastLoaded ?? "",
    });
  }
}
