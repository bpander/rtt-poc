import { createSelector } from 'reselect';

import { Shape2, addVector2 } from 'geo2d/core';
import { getNavMesh2d } from 'geo2d/navMesh2d';
import { createSlice } from 'lib/create-slice';

import { Camera, emptyCamera } from '../models/Camera';
import { Entity, isFacetType, FacetType } from '../models/Entity';

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
  () => state => state,
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
