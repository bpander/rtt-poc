import { createSlice } from 'lib/create-slice';

interface XhessState {
  selected: string[];
}

const initialXhessState: XhessState = {
  selected: [ 'player_tank' ],
};

const { reducer } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
