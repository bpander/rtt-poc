import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FacetType } from 'modules/engine/models/Entity';
import { updateEngine, getNavMeshHoles } from 'modules/engine/duck';
import { Scissors } from 'xhess/sprites/Scissors';
import { Box } from 'xhess/sprites/Box';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess } from 'xhess/duck';
import { getEdges } from 'modules/geo2d/navMesh2d';
import { regularPolygon } from 'modules/geo2d/core';
import { XhessEntity, XhessFacetType } from 'xhess/models/XhessEntity';
import { useRootState } from 'root';
import { EntityName } from 'xhess/enums/EntityName';
import { Ring } from 'xhess/sprites/Ring';

const initialEntities: XhessEntity[] = [
  {
    id: 'player_scissors',
    name: EntityName.Player,
    position: [ 2.5, 1.5 ],
    rotation: 0,
    facets: [
      { type: FacetType.NavMeshAgent, path: [], velocity: 9 },
      { type: XhessFacetType.Actor, teamName: 'blue', selected: true },
    ],
  },
  {
    id: 'player_scissors2',
    name: EntityName.Player,
    position: [ 3.5, 1.5 ],
    rotation: 0,
    facets: [
      { type: FacetType.NavMeshAgent, path: [], velocity: 9 },
      { type: XhessFacetType.Actor, teamName: 'blue', selected: true },
    ],
  },
  {
    id: 'box1',
    name: EntityName.Box,
    position: [ 2, 2 ],
    rotation: Math.PI / 16,
    facets: [
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 7.5, -0.5 ], [ 7.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'box2',
    name: EntityName.Box,
    position: [ 4, 11 ],
    rotation: -Math.PI / 4,
    facets: [
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 7.5, -0.5 ], [ 7.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'ring',
    name: EntityName.Ring,
    position: [ 5, 5 ],
    rotation: 0,
    facets: [
      { type: FacetType.NavMeshHole, shape: regularPolygon(2.5, 16) },
    ],
  },
];

export const MainScene: React.FC = () => {
  const dispatch = useDispatch();
  const { engine } = useRootState();
  useEffect(() => {
    dispatch(updateEngine({
      entities: initialEntities,
      navMesh: getEdges(getNavMeshHoles(initialEntities)),
    }));
    dispatch(updateXhess({
      playerTeam: 'blue',
      teams: [
        {
          name: 'blue',
          color: '#3333ee',
        },
      ],
    }));
  }, [ dispatch ]);

  return (
    <React.Fragment>
      <NavigableArea />
      {engine.entities.map(entity => {
        switch (entity.name) {
          // TODO: There's probably a more concise way of doing this
          case EntityName.Box: return <Box key={entity.id} entity={entity} />;
          case EntityName.Ring: return <Ring key={entity.id} entity={entity} />;
          case EntityName.Player: return <Scissors key={entity.id} entity={entity} />;
          default: return null;
        }
      })}
    </React.Fragment>
  );
};
