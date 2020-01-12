import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { FacetType } from 'modules/engine/models/Entity';
import { updateEngine, getNavMeshHoles } from 'modules/engine/duck';
import { Scissors } from 'xhess/sprites/Scissors';
import { Box } from 'xhess/sprites/Box';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess, togglePause } from 'xhess/duck';
import { getEdges } from 'modules/geo2d/navMesh2d';
import { regularPolygon } from 'modules/geo2d/core';
import { XhessEntity } from 'xhess/models/XhessEntity';
import { useRootState } from 'root';
import { EntityName } from 'xhess/enums/EntityName';
import { Ring } from 'xhess/sprites/Ring';
import { KeyboardContext } from 'modules/keyboard/Keyboard';
import { HealerEntity, HealerActor } from 'xhess/prefabs/HealerActor';
import { removeFirst } from 'util/arrays';

const initialEntities: XhessEntity[] = [
  {
    ...HealerEntity,
    position: [ 2.5, 1.5 ],
    facets: removeFirst(
      HealerEntity.facets,
      HealerActor,
      { ...HealerActor, hp: 5, selected: true, teamName: 'blue' },
    ),
  },
  {
    ...HealerEntity,
    position: [ 3.5, 1.5 ],
    rotation: 0,
  },
  {
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

  const spaceIsDown = useContext(KeyboardContext).pressed[' '];
  useEffect(() => {
    if (spaceIsDown) { dispatch(togglePause({})); }
  }, [ dispatch, spaceIsDown ]);

  return (
    <React.Fragment>
      <NavigableArea />
      {engine.entities.map((entity, i) => {
        switch (entity.name) {
          // TODO: There's probably a more concise way of doing this
          // TODO: Would be nice to key off of something other than the index
          case EntityName.Box: return <Box key={i} entity={entity} />;
          case EntityName.Ring: return <Ring key={i} entity={entity} />;
          case EntityName.Player: return <Scissors key={i} entity={entity} />;
          default: return null;
        }
      })}
    </React.Fragment>
  );
};
