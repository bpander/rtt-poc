import { getAngleBetweenPoints, Vector2, Line2, Shape2, getIntersection, getDistance, isSameVector2 } from './core';
import createGraph, { Graph } from 'ngraph.graph';
import { aStar } from 'ngraph.path';
import { removeFirst } from 'util/arrays';

export const isInsideOrSameAngle = (angle: number, thetaA: number, thetaB: number) => {
  if (thetaA < thetaB) {
    return angle >= thetaA && angle <= thetaB;
  }
  return angle >= thetaA || angle <= thetaB;
};

export interface Edge {
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

export const findNavMeshLinks = (edges: Edge[]): Line2[] => {
  const links: Line2[] = [];
  const remainingEdges = [ ...edges ];
  while (true) {
    const edge = remainingEdges.pop();
    if (!edge) { break; }
    const otherEdges = removeFirst(edges, edge);
    remainingEdges.forEach(remainingEdge => {
      const candidateLink: Line2 = [ edge.line[0], remainingEdge.line[0] ];
      if (isValidLink(candidateLink, otherEdges)) {
        links.push(candidateLink);
      }
    });
  }
  return links;
};

const line = (p1: Vector2, p2: Vector2): Line2 => [ p1, p2 ];

export const toLines = (shape: Shape2): Line2[] => {
  return shape.map((p, i) => line(p, shape[(i + 1) % shape.length]));
};

export const getNavMesh2d = (edges: Edge[]): Graph<Vector2, number> => {
  const graph = createGraph<Vector2, number>();
  const links = findNavMeshLinks(edges);
  links.forEach(([ p1, p2 ]) => {
    const p1Id = p1.join();
    const p2Id = p2.join();
    graph.addNode(p1Id, p1);
    graph.addNode(p2Id, p2);
    graph.addLink(p2Id, p1Id, getDistance(p1, p2));
  });

  return graph;
};

const cloneMesh = (navMesh: Graph<Vector2, number>) => {
  const g = createGraph<Vector2, number>();
  navMesh.forEachNode(node => { g.addNode(node.id, node.data); });
  navMesh.forEachLink(link => { g.addLink(link.fromId, link.toId, link.data); });
  return g;
};

const isValidLink = (candidateLink: Line2, edges: Edge[], allowNonOptimalPaths?: boolean): boolean => {
  const angle = getAngleBetweenPoints(...candidateLink);
  return edges.every(possibleCollision => {
    const intersection = getIntersection(candidateLink, possibleCollision.line);
    if (!intersection) {
      return true;
    }
    if (!isSameVector2(intersection, candidateLink[0]) && !isSameVector2(intersection, candidateLink[1])) {
      return false;
    }
    const intersectedCorner = possibleCollision.corners.find(c => isSameVector2(c.p, intersection));
    if (!intersectedCorner) {
      return isSameVector2(intersection, candidateLink[1])
        || isInsideOrSameAngle(angle, possibleCollision.angleOpposite, possibleCollision.angle);
    }
    if (allowNonOptimalPaths) {
      if (isSameVector2(intersection, candidateLink[0])) {
        return isInsideOrSameAngle(angle, intersectedCorner.thetaAOpposite, intersectedCorner.thetaB);
      }
      return isInsideOrSameAngle(angle, intersectedCorner.thetaA, intersectedCorner.thetaBOpposite);
    }
    return isInsideOrSameAngle(angle, intersectedCorner.thetaA, intersectedCorner.thetaB)
      || isInsideOrSameAngle(angle, intersectedCorner.thetaAOpposite, intersectedCorner.thetaBOpposite);
  });
};

export const getPath = (navMesh: Graph<Vector2, number>, edges: Edge[], start: Vector2, end: Vector2) => {
  const clone = cloneMesh(navMesh);
  const startId = start.join();
  const endId = end.join();
  const startToEnd: Line2 = [ start, end ];
  const canLinkStartToEnd = isValidLink(startToEnd, edges, true);

  clone.addNode(startId, start);
  clone.addNode(endId, end);
  if (canLinkStartToEnd) {
    clone.addLink(startId, endId, getDistance(start, end));
  }

  edges.forEach(edge => {
    const otherEdges = removeFirst(edges, edge);
    const p = edge.line[0];
    const startLink = line(start, p);
    const endLink = line(p, end);
    if (isValidLink(startLink, otherEdges, true)) {
      clone.addLink(startId, p.join(), getDistance(start, p));
    }
    if (isValidLink(endLink, otherEdges, true)) {
      clone.addLink(p.join(), endId, getDistance(p, end));
    }
  });

  const pathfinder = aStar(clone, { distance: (_from, _to, link) => link.data });
  return pathfinder.find(startId, endId).map(n => n.data).reverse().slice(1);
};
