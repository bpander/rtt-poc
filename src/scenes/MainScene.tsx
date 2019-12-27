import React, { useState, useMemo, useContext } from 'react';
import { Grid } from 'engine/components/Grid';
import { getLinks, getNavMesh2d, getPath } from 'geo2d/navMesh2d';
import { Vector2, Line2, Shape2 } from 'geo2d/core';
import { EngineContext } from 'engine/components/Engine';

const scaleFactor = 50;

const scaleVector2 = (v2: Vector2) => v2.map(n => n * scaleFactor) as Vector2;
const descaleVector2 = (v2: Vector2) => v2.map(n => n / scaleFactor) as Vector2;
const scaleLine2 = (line2: Line2) => line2.map(scaleVector2) as Line2;

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [8, 4], [8, 6], [2, 6] ],
];

const player: Vector2 = [10, 8];
export const MainScene: React.FC = () => {
  const ctx = useContext(EngineContext);
  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setDestination(descaleVector2([ e.clientX - left, e.clientY - top ]));
  };
  const [destination, setDestination] = useState<Vector2>();
  const navMesh = useMemo(() => getNavMesh2d(colliders), []);
  const path = useMemo(() => {
    return destination && getPath(navMesh, colliders, player, destination);
  }, [ destination, navMesh ]);

  return (
    <g>
      <rect width={ctx.width} height={ctx.height} fill="rgba(0, 0, 0, 0)" onClick={onAreaClick} />
      <Grid width={ctx.width} height={ctx.height} />
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
      <circle cx={player[0] * scaleFactor} cy={player[1] * scaleFactor} r={15} fill="blue" />
      {path && path.map((v2, i) => {
        const previous = path[i - 1];
        if (!previous) {
          return null;
        }
        const [ x1, y1 ] = scaleVector2(v2);
        const [ x2, y2 ] = scaleVector2(previous);
        return <line key={i} {...{ x1, y1, x2, y2 }} stroke="blue" strokeWidth="3" />;
      })}
    </g>
  )
}
