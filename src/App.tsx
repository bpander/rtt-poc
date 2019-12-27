import React, { useMemo } from 'react';

import { Grid } from 'components/Grid';
import { Vector2, Line2, Shape2 } from 'geo2d/core';
import { getNavMesh2d, getLinks } from 'geo2d/navMesh2d';

const scaleFactor = 50;

const scaleVector2 = (v2: Vector2) => v2.map(n => n * scaleFactor) as Vector2;
const descaleVector2 = (v2: Vector2) => v2.map(n => n / scaleFactor) as Vector2;
const scaleLine2 = (line2: Line2) => line2.map(scaleVector2) as Line2;

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [5, 4], [5, 5], [2, 5] ],
];

const player = scaleVector2([10, 8]);

export const App: React.FC = () => {
  const navMesh = useMemo(() => getNavMesh2d(colliders), []);

  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const destination = descaleVector2([ e.clientX - left, e.clientY - top ]);
    console.log(destination);
  };

  return (
    <svg width={800} height={450} viewBox="0 0 800 450" style={{ border: '1px solid black' }}>
      <rect width={800} height={450} fill="rgba(0, 0, 0, 0)" onClick={onAreaClick} />
      <Grid width={800} height={450} scale={scaleFactor} />
      <g stroke="black" strokeWidth="3" fill="rgba(0, 0, 0, 0.2)">
        {colliders.map((collider, i) => (
          <polygon key={i} points={collider.map(scaleVector2).map(p => p.join()).join(' ')} />
        ))}
      </g>
      <g stroke="red">
        {getLinks(navMesh).map(scaleLine2).map(([[x1, y1], [x2, y2]], i) => (
          <line key={i} {...{x1, y1, x2, y2}} />
        ))}
      </g>
      <circle cx={player[0]} cy={player[1]} r={15} fill="blue" />
    </svg>
  );
};
