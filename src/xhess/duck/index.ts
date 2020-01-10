import { createSlice } from 'modules/create-slice';

interface Team {
  name: string;
  color: string;
}

interface XhessState {
  teams: Team[];
  playerTeam: string;
}

const initialXhessState: XhessState = {
  teams: [],
  playerTeam: 'blue',
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;
