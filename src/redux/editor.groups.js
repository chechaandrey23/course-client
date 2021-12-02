import {createSlice} from '@reduxjs/toolkit'

export const storeEditorGroups = createSlice({
	name: 'editorGroups',
	initialState: {
		groups: [],
		loadGroups: false
	},
	reducers: {
		getGroups(state, action) {
			state.groups = [...action.payload];
		},
		startLoadGroups(state, action) {
			state.loadGroups = true;
		},
		endLoadGroups(state, action) {
			state.loadGroups = false;
		}
	}
});

export const {getGroups, startLoadGroups, endLoadGroups} = storeEditorGroups.actions;

export default storeEditorGroups.reducer;
