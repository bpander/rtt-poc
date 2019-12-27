import React from 'react';

import { Grid } from 'components/Grid';
import { Vector2, Line2, Shape2 } from 'geo2d/core';
import { getNavMesh2d } from 'geo2d/navMesh2d';

const scaleFactor = 50;

const scaleVector2 = (v2: Vector2) => v2.map(n => n * scaleFactor) as Vector2;
const scaleLine2 = (line2: Line2) => line2.map(scaleVector2) as Line2;

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [5, 4], [5, 5], [2, 5] ],
];

export const App: React.FC = () => {
  const links = getNavMesh2d(colliders);

  return (
    <svg width={800} height={450} viewBox="0 0 800 450" style={{ border: '1px solid black' }}>
      <Grid width={800} height={450} scale={scaleFactor} />
      <g stroke="black" strokeWidth="3" fill="rgba(0, 0, 0, 0.2)">
        {colliders.map((collider, i) => (
          <polygon key={i} points={collider.map(scaleVector2).map(p => p.join()).join(' ')} />
        ))}
      </g>
      <g stroke="red">
        {links.map(scaleLine2).map(([[x1, y1], [x2, y2]], i) => (
          <line key={i} {...{x1, y1, x2, y2}} />
        ))}
      </g>
    </svg>
  );
};
