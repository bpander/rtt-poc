import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection, getDistance, isSameVector2, doLinesIntersect } from './core';
import { isSameOrBetween, isBetween } from 'util/numbers';
import createGraph, { Graph, Link } from 'ngraph.graph';
import { aStar } from 'ngraph.path';
import { removeFirst } from 'util/arrays';

interface Angle {
  p: Vector2;
  thetaA: number;
  thetaB: number;
  // normal: number;
}

export interface Corner {
  p: Vector2;
  thetaA: number;
  thetaAInverse: number;
  thetaB: number;
  thetaBInverse: number;
  lineB: Line2;
}

const isInsideOrSameAngle2 = (angle: number, thetaA: number, thetaB: number) => {
  if (thetaA < thetaB) {
    return isSameOrBetween(angle, thetaA, thetaB);
  }
  return !isBetween(angle, thetaA, thetaB);
}

const isInsideAngle2 = (angle: number, thetaA: number, thetaB: number) => {
  if (thetaA < thetaB) {
    return isBetween(angle, thetaA, thetaB);
  }
  return !isBetween(angle, thetaA, thetaB);
};

export const getCorners = (shapes: Shape2[]): Corner[] => {
  return shapes.map(shape => {
    return shape.map((p, i) => {
      const a = shape[(i + shape.length - 1) % shape.length];
      const b = shape[(i + 1) % shape.length];
      const thetaA = getAngleBetweenPoints(p, a);
      const thetaB = getAngleBetweenPoints(p, b);
      const corner: Corner = {
        p,
        thetaA,
        thetaAInverse: (thetaA + 180) % 360,
        thetaB,
        thetaBInverse: (thetaB + 180) % 360,
        lineB: [ p, b ],
      };
      return corner;
    });
  }).flat();
};

export const findNavMeshLinks = (corners: Corner[]): Line2[] => {
  const links: Line2[] = [];
  const remainingCorners = [ ...corners ];
  while (true) {
    const corner = remainingCorners.pop();
    if (!corner) { break; }
    const otherCorners = removeFirst(corners, corner);
    remainingCorners.forEach(remainingCorner => {
      const possibleLink: Line2 = [ corner.p, remainingCorner.p ];
      const angle = getAngleBetweenPoints(...possibleLink);
      const angleFlipped = (angle + 180) % 360;
      if ((
        !isInsideOrSameAngle2(angle, corner.thetaAInverse, corner.thetaB)
        && !isInsideOrSameAngle2(angle, corner.thetaA, corner.thetaBInverse)
      ) || (
        !isInsideOrSameAngle2(angleFlipped, remainingCorner.thetaAInverse, remainingCorner.thetaB)
        && !isInsideOrSameAngle2(angleFlipped, remainingCorner.thetaA, remainingCorner.thetaBInverse)
      )) {
        return;
      }
      const possibleCollisions = removeFirst(otherCorners, remainingCorner);

      const isValid = possibleCollisions.every(possibleCollision => {
        const intersection = getIntersection(possibleLink, possibleCollision.lineB);
        if (!intersection) {
          return true;
        }
        return isSameVector2(intersection, possibleLink[0]) || isSameVector2(intersection, possibleLink[1]);
      });
      if (isValid) { links.push(possibleLink); }
    });
  }
  return links;
};

const getAngles = (points: Vector2[]): Angle[] => {
  return points.map((p, i) => {
    const a = points[(i + points.length - 1) % points.length];
    const b = points[(i + 1) % points.length];
    const thetaA = getAngleBetweenPoints(p, a);
    const thetaB = getAngleBetweenPoints(p, b);
    return { p, thetaA, thetaB };
  });
};

const line = (p1: Vector2, p2: Vector2): Line2 => [ p1, p2 ];

export const toLines = (shape: Shape2): Line2[] => {
  return shape.map((p, i) => line(p, shape[(i + 1) % shape.length]));
};

export const getNavMesh2d = (holes: Shape2[]): Graph<Vector2, number> => {
  const links: Line2[] = holes.map(toLines).flat();
  const remainingHoles = [ ...holes ];
  while (true) {
    const hole = remainingHoles.pop();
    if (!hole) { break; }
    const otherHoles = removeFirst(holes, hole);
    const angles = getAngles(hole);
    remainingHoles.forEach(remainingHole => {
      const holeLines = removeFirst(otherHoles, remainingHole).map(toLines).flat();
      getAngles(remainingHole).forEach(holeAngle => {
        angles.forEach(angle => {
          const link = getLinkBetweenAngles(angle, holeAngle, holeLines);
          if (link) { links.push(link); }
        });
      });
    });
  }

  const graph = createGraph<Vector2, number>();
  links.forEach(([ p1, p2 ]) => {
    const p1Id = p1.join();
    const p2Id = p2.join();
    graph.addNode(p1Id, p1);
    graph.addNode(p2Id, p2);
    graph.addLink(p2Id, p1Id, getDistance(p1, p2));
  });

  return graph;
};

const rotateAngle = (angle: Angle, degrees: number): Angle => {
  return {
    p: angle.p,
    thetaA: (angle.thetaA + degrees) % 360,
    thetaB: (angle.thetaB + degrees) % 360,
  };
}

const isInsideAngle = (angle: Angle, theta: number): boolean => {
  if (angle.thetaA > angle.thetaB) {
    return isBetween(theta, angle.thetaA, angle.thetaB);
  }
  return !isBetween(theta, angle.thetaA, angle.thetaB);
};

const isInsideOrSameAngle = (angle: Angle, theta: number): boolean => {
  if (angle.thetaA > angle.thetaB) {
    return isSameOrBetween(theta, angle.thetaA, angle.thetaB);
  }
  return !isBetween(theta, angle.thetaA, angle.thetaB);
};

const getLinkBetweenAngles = (angle1: Angle, angle2: Angle, holeLines: Line2[]): Line2 | null => {
  const theta1 = getAngleBetweenPoints(angle1.p, angle2.p);
  const theta2 = getAngleBetweenPoints(angle2.p, angle1.p);
  if (
    isInsideOrSameAngle(angle1, theta1)
    || isInsideOrSameAngle(angle2, theta2)
    || isInsideAngle(rotateAngle(angle1, 180), theta1)
    || isInsideAngle(rotateAngle(angle2, 180), theta2)
  ) {
    return null;
  }
  const candidateLine = line(angle1.p, angle2.p);
  if (holeLines.some(holeLine => getIntersection(candidateLine, holeLine))) {
    return null;
  }
  return candidateLine;
};

const getLinkToPoint = (angle: Angle, p: Vector2, holeLines: Line2[]): Line2 | null => {
  const theta = getAngleBetweenPoints(angle.p, p);
  if (isInsideAngle(angle, theta)) {
    return null;
  }
  const candidateLine = line(angle.p, p);
  if (holeLines.some(holeLine => getIntersection(holeLine, candidateLine))) {
    return null;
  }
  return candidateLine;
};

const cloneMesh = (navMesh: Graph<Vector2, number>) => {
  const g = createGraph<Vector2, number>();
  navMesh.forEachNode(node => { g.addNode(node.id, node.data); });
  navMesh.forEachLink(link => { g.addLink(link.fromId, link.toId, link.data); });
  return g;
};

export const getPath = (navMesh: Graph<Vector2, number>, holes: Shape2[], start: Vector2, end: Vector2) => {
  const clone = cloneMesh(navMesh);
  const startId = start.join();
  const endId = end.join();
  const startToEnd: Line2 = [start, end];
  const canLinkStartToEnd = holes.map(toLines).flat().every(holeLine => {
    const intersection = getIntersection(startToEnd, holeLine);
    return !intersection || isSameVector2(intersection, start);
  });

  clone.addNode(startId, start);
  clone.addNode(endId, end);
  if (canLinkStartToEnd) {
    clone.addLink(startId, endId, getDistance(start, end));
  }

  holes.forEach(hole => {
    const otherHoles = removeFirst(holes, hole);
    const holeLines = otherHoles.map(toLines).flat();
    const angles = getAngles(hole);
    angles.forEach(angle => {
      const startLink = getLinkToPoint(angle, start, holeLines);
      const endLink = getLinkToPoint(angle, end, holeLines);
      if (startLink) {
        clone.addLink(startId, angle.p.join(), getDistance(start, angle.p));
      }
      if (endLink) {
        clone.addLink(endId, angle.p.join(), getDistance(end, angle.p));
      }
    });
  });
  const pathfinder = aStar(clone, { distance: (_from, _to, link) => link.data });
  return pathfinder.find(startId, endId).map(n => n.data).reverse().slice(1);
};

export const getLinks = (g: Graph): Line2[] => {
  const links: Link<number>[] = [];
  g.forEachLink(l => links.push(l));
  return links.map(link => [ g.getNode(link.fromId)!.data, g.getNode(link.toId)!.data ]);
};
