import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection } from './core';
import { isSameOrBetween, isBetween } from 'util/numbers';

interface Angle {
  p: Vector2;
  thetaA: number;
  thetaB: number;
}

const getAngles = (points: Vector2[]): Angle[] => {
  return points.map((p, i) => {
    const a = points[(i + points.length - 1) % points.length];
    const b = points[(i + 1) % points.length];
    const thetaA = getAngleBetweenPoints(p, a);
    const thetaB = getAngleBetweenPoints(p, b);
    return { p, thetaA, thetaB };
  });
};

export const getNavMesh2d = (colliders: Shape2[]): Line2[] => {
  const remainingAngles = colliders.map(getAngles).flat();
  const colliderLines = colliders.map(collider => {
    return collider.map((p, i, points) => {
      return [ p, points[(i + 1) % points.length] ] as Line2;
    });
  }).flat();
  const links: Line2[] = [ ...colliderLines ];

  while (true) {
    const angle = remainingAngles.pop();
    if (!angle) {
      break;
    }

    const candidateAngles = remainingAngles.filter(angleOther => {
      const thetaOther = getAngleBetweenPoints(angle.p, angleOther.p);
      if (angle.thetaA > angle.thetaB) {
        return (!isSameOrBetween(thetaOther, angle.thetaA, angle.thetaB));
      }
      return isBetween(thetaOther, angle.thetaA, angle.thetaB);
    });
    const candidateLines: Line2[] = candidateAngles.map(angleOther => [angleOther.p, angle.p]);
    links.push(
      ...candidateLines.filter(candidate => {
        return colliderLines.every(colliderLine => {
          return !getIntersection(candidate, colliderLine);
        });
      }),
    );
  }

  return links;
};
