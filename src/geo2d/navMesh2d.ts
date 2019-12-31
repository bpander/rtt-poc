import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection, getDistance, isSameVector2 } from './core';
import { isBetween } from 'util/numbers';
import createGraph, { Graph } from 'ngraph.graph';
import { aStar } from 'ngraph.path';
import { removeFirst } from 'util/arrays';

interface Angle {
  p: Vector2;
  thetaA: number;
  thetaB: number;
  // normal: number;
}

export const isInsideOrSameAngle = (angle: number, thetaA: number, thetaB: number) => {
  if (thetaA < thetaB) {
    return angle >= thetaA && angle <= thetaB;
  }
  return angle >= thetaA || angle <= thetaB;
};

interface Edge {
  line: Line2;
  angle: number;
  angleOpposite: number;
  corners: [ Corner, Corner ];
}

interface Corner {
  p: Vector2;
  thetaA: number;
  thetaAOpposite: number;
  thetaB: number;
  thetaBOpposite: number;
}

export const getEdges = (shapes: Shape2[]): Edge[] => {
  const shapeEdges = shapes.map(shape => {
    return shape.map((v2, i) => {
      const a = shape[(i - 1 + shape.length) % shape.length];
      const b = shape[(i + 1) % shape.length];
      const c = shape[(i + 2) % shape.length];
      const line: Line2 = [ v2, b ];
      const angle = getAngleBetweenPoints(...line);
      const angleOpposite = (angle + 180) % 360;
      const edge: Edge = {
        line,
        angle,
        angleOpposite,
        corners: [
          {
            p: v2,
            thetaA: getAngleBetweenPoints(a, v2),
            thetaAOpposite: getAngleBetweenPoints(v2, a),
            thetaB: angle,
            thetaBOpposite: angleOpposite,
          },
          {
            p: b,
            thetaA: angle,
            thetaAOpposite: angleOpposite,
            thetaB: getAngleBetweenPoints(b, c),
            thetaBOpposite: getAngleBetweenPoints(c, b),
          },
        ],
      };
      return edge;
    });
  });
  return shapeEdges.flat();
};

export const findNavMeshLinks = (holes: Shape2[]): Line2[] => {
  const links: Line2[] = [];
  const edges = getEdges(holes);
  const remainingEdges = [ ...edges ];
  while (true) {
    const edge = remainingEdges.pop();
    if (!edge) { break; }
    const otherEdges = removeFirst(edges, edge);
    remainingEdges.forEach(remainingEdge => {
      const candidateLink: Line2 = [ edge.line[0], remainingEdge.line[0] ];
      const angle = getAngleBetweenPoints(...candidateLink);
      const canLink = otherEdges.every(possibleCollision => {
        const intersection = getIntersection(candidateLink, possibleCollision.line);
        if (!intersection) {
          return true;
        }
        if (!isSameVector2(intersection, candidateLink[0]) && !isSameVector2(intersection, candidateLink[1])) {
          return false;
        }
        const intersectedCorner = possibleCollision.corners.find(c => isSameVector2(c.p, intersection));
        if (!intersectedCorner) {
          return false;
        }
        return (
          isInsideOrSameAngle(angle, intersectedCorner.thetaA, intersectedCorner.thetaB)
          || isInsideOrSameAngle(angle, intersectedCorner.thetaAOpposite, intersectedCorner.thetaBOpposite)
        );
      });
      if (canLink) { links.push(candidateLink); }
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
  const graph = createGraph<Vector2, number>();
  const links = findNavMeshLinks(holes);
  links.forEach(([ p1, p2 ]) => {
    const p1Id = p1.join();
    const p2Id = p2.join();
    graph.addNode(p1Id, p1);
    graph.addNode(p2Id, p2);
    graph.addLink(p2Id, p1Id, getDistance(p1, p2));
  });

  return graph;
};

const isInsideAngle = (angle: Angle, theta: number): boolean => {
  if (angle.thetaA > angle.thetaB) {
    return isBetween(theta, angle.thetaA, angle.thetaB);
  }
  return !isBetween(theta, angle.thetaA, angle.thetaB);
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
