import { createSelector } from 'reselect';

import { Shape2, addVector2, areVectorsEqual, getAngleBetweenPoints, Vector2 } from 'geo2d/core';
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
}

const initialEngineState: EngineState = {
  width: 0,
  height: 0,
  camera: emptyCamera,
  entities: [],
};

const { reducer, update, configureAction } = createSlice(initialEngineState, 'ENGINE');

export const engineReducer = reducer;
export const updateEngine = update;

export const tick = configureAction<number>(
  'TICK',
  elapsed => state => {
    const entities = state.entities.map(entity => {
      const agent = entity.facets.find(isFacetType(FacetType.NavMeshAgent));
      if (!agent || !agent.destination) {
        return entity;
      }
      const [ x1, y1 ] = entity.position;
      const [ x2, y2 ] = agent.destination;
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const v = 3; // TODO: Make configurable somewhere
      const d = v * (elapsed / 1000);
      const movement: Vector2 = [ Math.cos(angle) * d, Math.sin(angle) * d ];
      const newPosition = addVector2(entity.position, movement);
      if (areVectorsEqual(agent.destination, newPosition, 0.05)) {
        const facets = removeFirst(entity.facets, agent, { ...agent, destination: null });
        return { ...entity, position: agent.destination, facets };
      }
      return { ...entity, position: newPosition };
    });
    return { ...state, entities };
  },
);

export const addEntities = configureAction<Entity[]>(
  'ADD_ENTITIES',
  entities => state => ({ ...state, entities: [ ...state.entities, ...entities ] }),
);

export const getNavMeshHoles = createSelector(
  (engineState: EngineState) => engineState.entities,
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

export const getNavMesh = createSelector(
  getNavMeshHoles,
  holes => getNavMesh2d(holes),
);
