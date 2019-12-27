import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection, getDistance } from './core';
import { isSameOrBetween, isBetween } from 'util/numbers';
import createGraph, { Graph, Link } from 'ngraph.graph';
import { aStar } from 'ngraph.path';

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

const cloneMesh = (navMesh: Graph<Vector2, number>) => {
  const g = createGraph<Vector2, number>();
  navMesh.forEachNode(node => { g.addNode(node.id, node.data); });
  navMesh.forEachLink(link => { g.addLink(link.fromId, link.toId, link.data); });
  return g;
};

export const getPath = (navMesh: Graph<Vector2, number>, colliders: Shape2[], start: Vector2, end: Vector2) => {
  const clone = cloneMesh(navMesh);
  const remainingAngles = colliders.map(getAngles).flat();
  const colliderLines = colliders.map(collider => {
    return collider.map((p, i, points) => {
      return [ p, points[(i + 1) % points.length] ] as Line2;
    });
  }).flat();

  const startId = start.join();
  const endId = end.join();
  const startToEnd: Line2 = [start, end];
  const canLinkStartToEnd = colliderLines.every(colliderLine => {
    return !getIntersection(startToEnd, colliderLine);
  });

  clone.addNode(startId, start);
  clone.addNode(endId, end);
  if (canLinkStartToEnd) {
    clone.addLink(startId, endId, getDistance(start, end));
  }

  remainingAngles.forEach(angle => {
    if (canLink(angle, start, colliderLines)) {
      clone.addLink(startId, angle.p.join(), getDistance(start, angle.p));
    }
    if (canLink(angle, end, colliderLines)) {
      clone.addLink(angle.p.join(), endId, getDistance(end, angle.p));
    }
  });
  const pathfinder = aStar(clone, { distance: (_from, _to, link) => link.data });
  return pathfinder.find(startId, endId).map(n => n.data);
};

export const getLinks = (g: Graph): Line2[] => {
  const links: Link<number>[] = [];
  g.forEachLink(l => links.push(l));
  return links.map(link => [ g.getNode(link.fromId)!.data, g.getNode(link.toId)!.data ]);
};
