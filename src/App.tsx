import React from 'react';

import { Grid } from 'components/Grid';
import { Vector2, Line2d, getAngleBetweenPoints } from 'geo2d/geo2d';
import { isSameOrBetween, isBetween } from 'util/numbers';

interface Collider {
  points: Vector2[];
}

const scaleFactor = 25;

const scaleVector2 = (v2: Vector2) => v2.map(n => n * scaleFactor) as Vector2;
const scaleLine2d = (line2d: Line2d) => line2d.map(scaleVector2) as Line2d;

const colliders: Collider[] = [
  { points: [ [2, 2], [5, 2], [5, 3], [2, 3] ] },
  { points: [ [2, 4], [5, 4], [5, 5], [2, 5] ] },
];

const getLinks = () => {
  const links: Line2d[] = [];
  const allPoints = colliders.map(c => c.points).flat();
  colliders.forEach(collider => {
    collider.points.forEach((p, i, points) => {
      const p0 = points[(i + points.length - 1) % points.length];
      const p2 = points[(i + 1) % points.length];
      const theta0 = getAngleBetweenPoints(p, p0);
      const theta2 = getAngleBetweenPoints(p, p2);
      allPoints.forEach(pOther => {
        if (pOther === p) {
          return;
        }
        const thetaOther = getAngleBetweenPoints(p, pOther);
        if (theta0 > theta2) {
          if (!isSameOrBetween(thetaOther, theta0, theta2)) {
            links.push([p, pOther]);
          }
        } else {
          if (isBetween(thetaOther, theta0, theta2)) {
            links.push([p, pOther]);
          }
        }
      });
    });
  });
  return links;
};

export const App: React.FC = () => {
  const links = getLinks();

  return (
    <svg width={800} height={450} viewBox="0 0 800 450" style={{ border: '1px solid black' }}>
      <Grid width={800} height={450} scale={scaleFactor} />
      <g stroke="black" strokeWidth="3" fill="rgba(0, 0, 0, 0.2)">
        {colliders.map((collider, i) => (
          <polygon key={i} points={collider.points.map(scaleVector2).map(p => p.join()).join(' ')} />
        ))}
      </g>
      <g stroke="red">
        {links.map(scaleLine2d).map(([[x1, y1], [x2, y2]], i) => (
          <line key={i} {...{x1, y1, x2, y2}} />
        ))}
      </g>
    </svg>
  );
};
