import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FacetType, Entity } from 'engine/models/Entity';
import { updateEngine, getNavMeshHoles } from 'engine/duck';
import { Tank } from 'xhess/sprites/Tank';
import { Box } from 'xhess/sprites/Box';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess } from 'xhess/duck';

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
    id: 'player_tank',
    position: [ 10, 10 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Tank },
      { type: FacetType.NavMeshAgent, path: [] },
    ],
  },
  {
    id: 'box1',
    position: [ 2, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 2, 2 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 2.5, -0.5 ], [ 2.5, 2.5 ], [ -0.5, 2.5 ] ],
      },
    ],
  },
  {
    id: 'box2',
    position: [ 6, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 2, 2 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 2.5, -0.5 ], [ 2.5, 2.5 ], [ -0.5, 2.5 ] ],
      },
    ],
  },
];

export const MainScene: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateEngine({
      entities: initialEntities,
      navMesh: getNavMeshHoles(initialEntities),
    }));
    dispatch(updateXhess({
      teams: [
        { color: 'blue', entities: [ 'player_tank' ] },
      ],
    }));
  }, [ dispatch ]);

  return null;
}
