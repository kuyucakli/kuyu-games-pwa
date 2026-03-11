import {
  AdditiveBlending,
  Sprite,
  SpriteMaterial,
  Texture,
  Vector2,
} from "three";

export function createExplosionSprite(
  texture: Texture,
  grid: Vector2 = new Vector2(4, 4),
): Sprite {
  // CHANGE THIS: Set to true so repeat/offset actually work
  texture.matrixAutoUpdate = true;

  texture.generateMipmaps = false;

  // This defines the "zoom" level (1/8th width, 1/4th height)
  texture.repeat.set(1 / grid.x, 1 / grid.y);

  // Set initial position
  texture.offset.set(0, 1 - 1 / grid.y);

  const material = new SpriteMaterial({
    map: texture,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  });

  const sprite = new Sprite(material);

  sprite.visible = false;

  return sprite;
}
