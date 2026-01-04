export type ColliderMeta = {
  kind: "ball" | "goal" | "trap" | "table";
  entityId: string;
};

export const enum CollisionGroup {
  BALL = 1 << 0,
  HOLE = 1 << 1,
  TABLE = 1 << 2,
}
