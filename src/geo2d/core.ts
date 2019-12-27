
export type Vector2 = [number, number];
export type Line2 = [Vector2, Vector2];
export type Shape2 = Vector2[];

export const getDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const getAngleBetweenPoints = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return ((Math.atan2(y2 - y1, x2 - x1) + Math.PI) % Math.PI) * 180 / Math.PI;
};

export const getIntersection = (
  [ [ x0, y0 ], [ x1, y1 ] ]: Line2,
  [ [ x2, y2 ], [ x3, y3 ] ]: Line2,
): Vector2 | null => {
  const sx1 = x1 - x0;
  const sy1 = y1 - y0;
  const sx2 = x3 - x2;
  const sy2 = y3 - y2;

  const s = (-sy1 * (x0 - x2) + sx1 * (y0 - y2)) / (-sx2 * sy1 + sx1 * sy2);
  const t = ( sx2 * (y0 - y2) - sy2 * (x0 - x2)) / (-sx2 * sy1 + sx1 * sy2);

  if (s > 0 && s < 1 && t > 0 && t < 1) {
    return [ x0 + (t * sx1), y0 + (t * sy1) ];
  }

  return null;
}
