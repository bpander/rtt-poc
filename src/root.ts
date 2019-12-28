import { combineReducers, createStore, Reducer, CombinedState } from 'redux';
import { useStore } from 'react-redux';

import { engineReducer, updateEngine } from 'engine/duck';
import { emptyCamera } from 'engine/models/Camera';

export const rootReducer = combineReducers({
  engine: engineReducer,
});

type ExtractState<TReducer> = TReducer extends Reducer<CombinedState<infer S>, any> ? S : never;
export type RootState = ExtractState<typeof rootReducer>;

export const rootStore = createStore(rootReducer);

rootStore.dispatch(updateEngine({
  width: 800,
  height: 450,
  camera: { ...emptyCamera, scale: 25 },
}));

export const useRootState = <K extends keyof RootState>(key: K): RootState[K] => {
  const store = useStore<RootState>();
  return store.getState()[key];
};
