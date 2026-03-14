export const TABLE_WIDTH = 12; // world units (X)
export const TABLE_HEIGHT = 18; // world units (Z)
export const TABLE_ASPECT_RATIO = TABLE_WIDTH / TABLE_HEIGHT;

export const COLLISION_GROUPS = {
  ACTIVE_BALL: 0x00010001, // Group 0, interacts with group 0
  CAPTURED_BALL: 0x00020000, // Group 1, interacts with nothing
  TABLE: 0x00010001, // Group 0, interacts with group 0
  OUT_OF_BOUNDS: 0b0010_0001,
};

type Ball = {
  color: `#${string}`;
  restitution: number;
  initPosition: [number, number, number];
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
  obstacles?: {
    name: string;
    type: "moving" | "draggable";
    initPosition: [number, number, number];
    speed?: number;
  }[];
  timeLimit?: number;
  totalBalls: number;
  textureKey?: keyof typeof GameAssets;
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
  ballExplosionFx: {
    type: "audio",
    url: "/assets/tahterevallis/audio/ball-explosion-fx.wav",
  },
  ballRollingSoundFx: {
    type: "audio",
    url: "/assets/tahterevallis/audio/ball-rolling-fx.wav",
  },
  holeRedGlow: {
    type: "texture",
    url: "/assets/tahterevallis/images/red-glow.png",
  },
  holeGreenGlow: {
    type: "texture",
    url: "/assets/tahterevallis/images/green-glow.png",
  },
  ballExplosion: {
    type: "texture",
    url: "/assets/tahterevallis/images/ball-explosion-sprite-sheet.png",
  },
  tableTextureLevel1: {
    type: "texture",
    url: "/assets/tahterevallis/images/table-texture-level-1.jpg",
  },
  tableTextureLevel2: {
    type: "texture",
    url: "/assets/tahterevallis/images/table-texture-level-2.jpg",
  },
  tableTextureLevel3: {
    type: "texture",
    url: "/assets/tahterevallis/images/table-texture-level-3.jpg",
  },
} as const;

const defaultBall = {
  color: `#ff0000`,
  restitution: 0.1,
  radius: 0.28,
  initPosition: [0, 10, 4],
} as Ball;

export const GAME_BALLS: Ball[] = [
  defaultBall,
  {
    ...defaultBall,
    initPosition: [4, 10, -1],
  },
  {
    ...defaultBall,
    initPosition: [1, 10, -4],
  },
  {
    ...defaultBall,
    initPosition: [-2, 10, 4],
  },
  {
    ...defaultBall,
    initPosition: [3, 10, -4],
  },
  {
    ...defaultBall,
    initPosition: [4, 10, -4],
  },
];
export const LEVELS_CONFIG: LevelConfig[] = [
  {
    textureKey: "tableTextureLevel1",
    holes: {
      goal: ["Hole_1", "Hole_6"],
      trap: ["Hole_2", "Hole_3", "Hole_4", "Hole_5"],
    },
    balls: [
      { ...defaultBall, initPosition: [-1.0, 10, 3.5] },
      { ...defaultBall, initPosition: [-5.0, 10, -3.5] },
    ],
    totalBalls: 2,
    timeLimit: 1000 * 30,
  },
  {
    textureKey: "tableTextureLevel2",
    holes: {
      goal: ["Hole_2", "Hole_3", "Hole_6"],
      trap: ["Hole_4", "Hole_5", "Hole_1"],
    },
    balls: [
      { ...defaultBall, initPosition: [5, 10, 5] },
      { ...defaultBall, initPosition: [7, 10, 4] },
      { ...defaultBall, initPosition: [-3, 10, -5] },
    ],
    obstacles: [
      {
        name: "Obstacle_Capsule",
        type: "moving",
        speed: 2.0,
        initPosition: [0, 0, 0],
      },
      {
        name: "Obstacle_Tube",
        type: "draggable",
        initPosition: [0, 0, 0],
      },
    ],

    timeLimit: 1000 * 48,
    totalBalls: 3,
  },
  {
    textureKey: "tableTextureLevel3",
    holes: {
      goal: ["Hole_2", "Hole_3", "Hole_6"],
      trap: ["Hole_4", "Hole_5", "Hole_1"],
    },
    balls: [
      { ...defaultBall, initPosition: [-2, 10, -2.9] },
      { ...defaultBall, initPosition: [-2.2, 10, 0.5] },
      { ...defaultBall, initPosition: [-2.3, 10, -2.4] },
    ],
    obstacles: [
      {
        name: "Obstacle_Capsule",
        type: "moving",
        speed: 2.0,
        initPosition: [0, 0, 0],
      },
      {
        name: "Obstacle_Tube",
        type: "draggable",
        initPosition: [0, 0, 0],
      },
      {
        name: "Obstacle_1",
        type: "draggable",
        initPosition: [0, 0, 0],
      },
    ],
    timeLimit: 1000 * 48,
    totalBalls: 3,
  },
];
