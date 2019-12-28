import { createSlice } from 'lib/create-slice';

interface Team {
  entities: string[];
  color: string;
}

interface XhessState {
  selected: string[];
  teams: Team[];
}

const initialXhessState: XhessState = {
  selected: [],
  teams: [],
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;
