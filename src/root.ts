import { combineReducers, createStore, Reducer, CombinedState, compose } from 'redux';
import { useStore, TypedUseSelectorHook, useSelector } from 'react-redux';

import { engineReducer } from 'engine/duck';
import { xhessReducer } from 'xhess/duck';

export const rootReducer = combineReducers({
  engine: engineReducer,
  xhess: xhessReducer,
});

type ExtractState<TReducer> = TReducer extends Reducer<CombinedState<infer S>, any> ? S : never;
export type RootState = ExtractState<typeof rootReducer>;

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const rootStore = createStore(rootReducer, composeEnhancers());

export const useRootState = (): RootState => {
  const store = useStore<RootState>();
  return store.getState();
};

export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
