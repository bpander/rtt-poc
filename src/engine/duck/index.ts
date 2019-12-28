import { createSelector } from 'reselect';

import { Shape2, addVector2, areVectorsEqual, Vector2 } from 'geo2d/core';
import { getNavMesh2d } from 'geo2d/navMesh2d';
import { createSlice } from 'lib/create-slice';

import { Camera, emptyCamera } from '../models/Camera';
import { Entity, isFacetType, FacetType } from '../models/Entity';
import { removeFirst } from 'util/arrays';

export interface EngineState {
  width: number;
  height: number;
  camera: Camera;
  entities: Entity[];
  navMesh: Shape2[];
}

const initialEngineState: EngineState = {
  width: 0,
  height: 0,
  camera: emptyCamera,
  entities: [],
  navMesh: [],
};

const { reducer, update, configureAction } = createSlice(initialEngineState, 'ENGINE');

export const engineReducer = reducer;
export const updateEngine = update;

export const tick = configureAction<number>(
  'TICK',
  elapsed => state => {
    const entities = state.entities.map(entity => {
      const agent = entity.facets.find(isFacetType(FacetType.NavMeshAgent));
      if (!agent) {
        return entity;
      }
      const [ wayPoint, ...restOfPath ] = agent.path;
      if (!wayPoint) {
        return entity;
      }
      const [ x1, y1 ] = entity.position;
      const [ x2, y2 ] = wayPoint;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const v = 6; // TODO: Make configurable somewhere
      const d = v * (elapsed / 1000);
      const movement: Vector2 = [ Math.cos(angle) * d, Math.sin(angle) * d ];
      const newPosition = addVector2(entity.position, movement);
      if (areVectorsEqual(agent.path[0], newPosition, 0.05)) {
        const facets = removeFirst(entity.facets, agent, { ...agent, path: restOfPath });
        return { ...entity, position: wayPoint, facets };
      }
      return { ...entity, position: newPosition };
    });
    return { ...state, entities };
  },
);

export const getNavMeshHoles = createSelector(
  (entities: Entity[]) => entities,
  entities => {
    const holes: Shape2[] = [];
    entities.forEach(entity => {
      const holeFacets = entity.facets.filter(isFacetType(FacetType.NavMeshHole));
      const holeShapes = holeFacets.map(f => f.shape.map(v2 => addVector2(v2, entity.position)));
      holes.push(...holeShapes);
    });
    return holes;
  },
);

export const getNavMeshGraph = createSelector(
  (engineState: EngineState) => engineState.navMesh,
  navMesh => getNavMesh2d(navMesh),
);
