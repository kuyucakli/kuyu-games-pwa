import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";

export class GltfAssetCache {
  private static cache = new Map<string, Promise<GLTF>>();

  static load(url: string): Promise<GLTF> {
    if (!this.cache.has(url)) {
      const loader = new GLTFLoader();
      this.cache.set(url, loader.loadAsync(url));
    }
    return this.cache.get(url)!;
  }
}
