import React, { useState, useMemo, useContext, useEffect } from 'react';
import { Grid } from 'sprites/Grid';
import { getLinks, getNavMesh2d, getPath } from 'geo2d/navMesh2d';
import { Vector2, Line2, Shape2 } from 'geo2d/core';
import { EngineContext } from 'engine/components/Engine';
import { FacetType, Entity } from 'engine/models/Entity';
import { Tank } from 'sprites/Tank';
import { Box } from 'sprites/Box';

const scaleFactor = 50;

const scaleVector2 = (v2: Vector2) => v2.map(n => n * scaleFactor) as Vector2;
const descaleVector2 = (v2: Vector2) => v2.map(n => n / scaleFactor) as Vector2;
const scaleLine2 = (line2: Line2) => line2.map(scaleVector2) as Line2;

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [8, 4], [8, 6], [2, 6] ],
];

const playerStart: Vector2 = [ 10, 8 ];

const initialEntities: Entity[] = [
  {
    id: 'grid',
    position: [0, 0],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 0, 0 ], Component: Grid },
    ],
  },
  {
    id: 'player_tank',
    position: [ 10, 10 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Tank },
      { type: FacetType.NavMeshAgent, destination: null },
    ],
  },
  {
    id: 'box1',
    position: [ 2, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 2, 2 ], Component: Box },
    ],
  },
];

export const MainScene: React.FC = () => {
  const ctx = useContext(EngineContext);
  const { addEntity } = ctx;
  useEffect(() => { initialEntities.forEach(addEntity); }, [ addEntity ]);

  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setDestination(descaleVector2([ e.clientX - left, e.clientY - top ]));
  };
  const [destination, setDestination] = useState<Vector2>();
  const navMesh = useMemo(() => getNavMesh2d(colliders), []);
  const path = useMemo(() => {
    return destination && getPath(navMesh, colliders, playerStart, destination);
  }, [ destination, navMesh ]);
  return null;

  // return (
  //   <g>
  //     <rect width={ctx.width} height={ctx.height} fill="rgba(0, 0, 0, 0)" onClick={onAreaClick} />
  //     <Grid width={ctx.width} height={ctx.height} />
  //     <g stroke="black" strokeWidth="3" fill="rgba(0, 0, 0, 0.2)">
  //       {colliders.map((collider, i) => (
  //         <polygon key={i} points={collider.map(scaleVector2).map(p => p.join()).join(' ')} />
  //       ))}
  //     </g>
  //     <g stroke="red">
  //       {getLinks(navMesh).map(scaleLine2).map(([[x1, y1], [x2, y2]], i) => (
  //         <line key={i} {...{x1, y1, x2, y2}} />
  //       ))}
  //     </g>
  //     <circle cx={playerStart[0] * scaleFactor} cy={playerStart[1] * scaleFactor} r={15} fill="blue" />
  //     {path && path.map((v2, i) => {
  //       const previous = path[i - 1];
  //       if (!previous) {
  //         return null;
  //       }
  //       const [ x1, y1 ] = scaleVector2(v2);
  //       const [ x2, y2 ] = scaleVector2(previous);
  //       return <line key={i} {...{ x1, y1, x2, y2 }} stroke="blue" strokeWidth="3" />;
  //     })}
  //   </g>
  // )
}
