export type Vector2 = [number, number];
export type Line2d = [Vector2, Vector2];

export const getDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const getAngleBetweenPoints = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return ((Math.atan2(y2 - y1, x2 - x1) + Math.PI) % Math.PI) * 180 / Math.PI;
};
