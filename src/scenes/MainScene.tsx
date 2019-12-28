import React, { useState, useMemo, useEffect } from 'react';
import { Grid } from 'sprites/Grid';
import { getNavMesh2d, getPath } from 'geo2d/navMesh2d';
import { Vector2, Shape2, scaleVector2 } from 'geo2d/core';
import { FacetType, Entity, Facet, FacetMap, FacetBase } from 'engine/models/Entity';
import { Tank } from 'sprites/Tank';
import { Box } from 'sprites/Box';
import { useDispatch } from 'react-redux';
import { addEntities } from 'engine/duck';
import { useRootState } from 'root';

const colliders: Shape2[] = [
  [ [2, 2], [5, 2], [5, 3], [2, 3] ],
  [ [2, 4], [8, 4], [8, 6], [2, 6] ],
];

const playerStart: Vector2 = [ 10, 8 ];

enum ChessFacetType {
  Team = 'Team',
}

interface TeamFacet {
  type: ChessFacetType.Team;
  name: string;
}

type ChessFacetMap = FacetMap & {
  [ChessFacetType.Team]: TeamFacet;
}

type ValueOf<T> = T[keyof T];
type ChessFacet = Facet | ValueOf<ChessFacetMap>;
interface ChessEntity extends Entity {
  chessFacets: ChessFacet[];
}

const initialEntities: ChessEntity[] = [
  {
    id: 'grid',
    position: [0, 0],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 0, 0 ], Component: Grid },
    ],
    chessFacets: [],
  },
  {
    id: 'player_tank',
    position: [ 10, 10 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Tank },
      { type: FacetType.NavMeshAgent, destination: null },
    ],
    chessFacets: [
      { type: ChessFacetType.Team, name: '' },
    ],
  },
  {
    id: 'box1',
    position: [ 2, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 2, 2 ], Component: Box },
    ],
    chessFacets: [],
  },
];

export const MainScene: React.FC = () => {
  const dispatch = useDispatch();
  const { camera } = useRootState('engine');
  useEffect(() => {
    dispatch(addEntities(initialEntities));
  }, [ dispatch ]);

  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    setDestination(scaleVector2([ e.clientX - left, e.clientY - top ], camera.scale));
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
