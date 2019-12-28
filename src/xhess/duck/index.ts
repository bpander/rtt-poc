import { createSlice } from 'lib/create-slice';

interface XhessState {
  selected: string[];
}

const initialXhessState: XhessState = {
  selected: [],
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;
