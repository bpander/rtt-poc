import { createSlice } from 'lib/create-slice';

import { Camera, emptyCamera } from '../models/Camera';
import { Entity } from '../models/Entity';

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
