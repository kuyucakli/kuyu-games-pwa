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
  totalBalls: number;
};

export const GameAssets = {
  gameObjects: { type: "gltf", url: "/assets/game-objects.glb" },
  homeIntroMusic: { type: "audio", url: "/audio/intro.wav" },
  selectGameIntroMusic: {
    type: "audio",
    url: "/assets/tahterevallis/audio/select-game-intro.wav",
  },
  goalSoundFx: {
    type: "audio",
    url: "/assets/tahterevallis/audio/goal-fx.wav",
  },
} as const;

const defaultBall = {
  color: `#ff0000`,
  restitution: 0.2,
  radius: 0.28,
  position: [0, 1, 4],
} as Ball;

export const GAME_BALLS: Ball[] = [
  defaultBall,
  {
    ...defaultBall,
    position: [0, 1, -4],
  },
  {
    ...defaultBall,
    position: [1, 1, -4],
  },
  {
    ...defaultBall,
    position: [2, 1, 4],
  },
  {
    ...defaultBall,
    position: [3, 1, -4],
  },
  {
    ...defaultBall,
    position: [4, 1, -4],
  },
];
export const LEVELS_CONFIG: LevelConfig[] = [
  {
    holes: { goal: ["Hole_1", "Hole_6"], trap: ["Hole_2"] },
    totalBalls: 2,
  },
];
