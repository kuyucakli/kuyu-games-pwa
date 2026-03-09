import {
  AdditiveBlending,
  ClampToEdgeWrapping,
  LinearFilter,
  LinearSRGBColorSpace,
  Sprite,
  SpriteMaterial,
  type Texture,
} from "three";

export function createGlow(texture: Texture): Sprite {
  // Configure at point-of-use (correct responsibility)
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;

  const material = new SpriteMaterial({
    map: texture,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: false,
  });

  const sprite = new Sprite(material);
  sprite.scale.set(0.6, 0.6, 1);
  sprite.position.set(0, 0.02, 0); // slight lift to avoid z-fighting
  sprite.visible = true;

  return sprite;
}
