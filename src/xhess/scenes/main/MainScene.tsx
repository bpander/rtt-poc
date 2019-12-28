import React, { useState, useMemo, useEffect } from 'react';
import { Grid } from 'engine/sprites/Grid';
import { getPath, getLinks } from 'geo2d/navMesh2d';
import { Vector2, Shape2 } from 'geo2d/core';
import { FacetType, Entity } from 'engine/models/Entity';
import { Tank } from 'xhess/sprites/Tank';
import { Box } from 'xhess/sprites/Box';
import { useDispatch } from 'react-redux';
import { addEntities, getNavMesh } from 'engine/duck';
import { useRootState } from 'root';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess } from 'xhess/duck';

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [8, 4], [8, 6], [2, 6] ],
];

const playerStart: Vector2 = [ 10, 8 ];

const initialEntities: Entity[] = [
  {
    id: 'navigable_area',
    position: [ 0, 0 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 0, 0 ], Component: NavigableArea },
    ],
  },
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
      { type: FacetType.NavMeshHole, shape: [ [ 0, 0 ], [ 2, 0 ], [ 2, 2 ], [ 0, 2 ] ] },
    ],
  },
];

export const MainScene: React.FC = () => {
  const dispatch = useDispatch();
  const { engine } = useRootState();
  useEffect(() => {
    dispatch(addEntities(initialEntities));
    dispatch(updateXhess({
      teams: [
        { color: 'blue', entities: [ 'player_tank' ] },
      ],
    }));
  }, [ dispatch ]);

  const [destination, setDestination] = useState<Vector2>();
  const navMesh = getNavMesh(engine);
  const links = getLinks(navMesh);
  // console.log(links);
  const path = useMemo(() => {
    return destination && getPath(navMesh, colliders, playerStart, destination);
  }, [ destination, navMesh ]);
  return null;

  // return (
  //   <g>
  //     <g stroke="red">
  //       {getLinks(navMesh).map(scaleLine2).map(([[x1, y1], [x2, y2]], i) => (
  //         <line key={i} {...{x1, y1, x2, y2}} />
  //       ))}
  //     </g>
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
