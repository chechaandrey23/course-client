import {createSlice} from '@reduxjs/toolkit'

export const storeUserLangs = createSlice({
	name: 'userLangs',
	initialState: {
		langs: [],
		loadLangs: false
	},
	reducers: {
		getLangs(state, action) {
			state.langs = [...action.payload];
		},
		startLoadLangs(state, action) {
			state.loadLangs = true;
		},
		endLoadLangs(state, action) {
			state.loadLangs = false;
		}
	}
});

export const {getLangs, startLoadLangs, endLoadLangs} = storeUserLangs.actions;

export default storeUserLangs.reducer;
