import { createSlice } from 'lib/create-slice';

interface Team {
  name: string;
  entities: string[];
  color: string;
}

interface XhessState {
  selected: string[];
  teams: Team[];
  playerTeam: string;
}

const initialXhessState: XhessState = {
  selected: [],
  teams: [],
  playerTeam: 'blue',
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;
