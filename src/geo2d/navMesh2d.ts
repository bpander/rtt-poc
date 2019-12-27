import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection, getDistance } from './core';
import { isSameOrBetween, isBetween } from 'util/numbers';
import createGraph, { Graph, Link } from 'ngraph.graph';

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

export const getNavMesh2d = (colliders: Shape2[]): Graph<Vector2, number> => {
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

    remainingAngles.forEach(angleOther => {
      if (canLink(angle, angleOther.p, colliderLines)) {
        links.push([ angle.p, angleOther.p ]);
      }
    });
  }

  const graph = createGraph<Vector2, number>();
  links.forEach(([ p1, p2 ]) => {
    const d = getDistance(p1, p2);
    const p1Id = p1.join();
    const p2Id = p2.join();
    graph.addNode(p1Id, p1);
    graph.addNode(p2Id, p2);
    graph.addLink(p1Id, p2Id, d);
    graph.addLink(p2Id, p1Id, d);
  });

  return graph;
};

const canLink = (angle: Angle, p: Vector2, colliderLines: Line2[]): boolean => {
  const thetaOther = getAngleBetweenPoints(angle.p, p);
  if (angle.thetaA > angle.thetaB) {
    if (isSameOrBetween(thetaOther, angle.thetaA, angle.thetaB)) {
      return false;
    }
  } else if (!isBetween(thetaOther, angle.thetaA, angle.thetaB)) {
    return false;
  }
  const candidateLine: Line2 = [p, angle.p];
  return colliderLines.every(colliderLine => {
    return !getIntersection(candidateLine, colliderLine);
  });
};

export const getLinks = (g: Graph): Line2[] => {
  const links: Link<number>[] = [];
  g.forEachLink(l => links.push(l));
  return links.map(link => [ g.getNode(link.fromId)!.data, g.getNode(link.toId)!.data ]);
};
