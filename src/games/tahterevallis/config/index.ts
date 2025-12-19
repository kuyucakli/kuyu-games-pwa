type Ball = {
  color: `#${string}`;
  restitution: number;
  position: [number, number, number];
  radius: number;
};

export type HoleName =
  | "Hole_1"
  | "Hole_2"
  | "Hole_3"
  | "Hole_4"
  | "Hole_5"
  | "Hole_6";

export type LevelConfig = {
  holes: {
    goal: HoleName[];
    drop?: HoleName[];
    trap?: HoleName[];
    bonus?: HoleName[];
  };
  balls: Ball[];
};

export const GameAssets = {
  gameObjects: { type: "gltf", url: "/assets/game-objects.glb" },
  introMusic: { type: "audio", url: "/audio/intro.wav" },
} as const;

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    holes: { goal: ["Hole_1", "Hole_6"], trap: ["Hole_2"] },
    balls: [
      { color: `#ff0000`, restitution: 0.2, radius: 0.28, position: [0, 1, 4] },
      {
        color: `#ff0000`,
        restitution: 0.2,
        radius: 0.28,
        position: [0, 1, -4],
      },
    ],
  },
];
