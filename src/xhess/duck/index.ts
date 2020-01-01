import { createSlice } from 'modules/create-slice';

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
  selected: [ 'player_scissors' ],
  teams: [],
  playerTeam: 'blue',
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;
