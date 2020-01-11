import { times } from 'util/arrays';

export type Vector2 = [number, number];
export type Line2 = [Vector2, Vector2];
export type Shape2 = Vector2[];

export const TAU = Math.PI * 2;

export const isSameVector2 = ([ x1, y1 ]: Vector2, [ x2, y2 ]: Vector2, tolerance = 0.0001): boolean => {
  return Math.abs(x1 - x2) < tolerance && Math.abs(y1 - y2) < tolerance;
};

export const addVector2 = ([ x1, y1 ]: Vector2, [ x2, y2 ]: Vector2): Vector2 => {
  return [ x1 + x2, y1 + y2 ];
};

export const scaleVector2 = (v2: Vector2, scale: number) => v2.map(n => n * scale) as Vector2;

export const rotatePoint = ([ x, y ]: Vector2, theta: number): Vector2 => {
  return [
    x * Math.cos(theta) - y * Math.sin(theta),
    x * Math.sin(theta) + y * Math.cos(theta),
  ];
};

export const regularPolygon = (r: number, segments: number): Shape2 => {
  const theta = TAU / segments;
  return times(segments, n => rotatePoint([ r, 0 ], n * theta));
};

export const getDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export const getAngleBetweenPoints = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return ((Math.atan2(y2 - y1, x2 - x1) + TAU) % TAU) * 180 / Math.PI;
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

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return [ x0 + (t * sx1), y0 + (t * sy1) ];
  }

  return null;
};

export const line = (p1: Vector2, p2: Vector2): Line2 => [ p1, p2 ];

export const toLines = (shape: Shape2): Line2[] => {
  return shape.map((p, i) => line(p, shape[(i + 1) % shape.length]));
};
