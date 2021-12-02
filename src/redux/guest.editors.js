import {createSlice} from '@reduxjs/toolkit'

export const storeEditorEditors = createSlice({
	name: 'guestEditors',
	initialState: {
		//editors: [],
		partEditors: [],
		loadEditors: false
	},
	reducers: {
		getEditors(state, action) {
			//state.editors = [...state.editors, ...action.payload];
			state.partEditors = [...action.payload];
		},
		startLoadEditors(state, action) {
			state.loadTiltes = true;
		},
		endLoadEditors(state, action) {
			state.loadTiltes = false;
		}
	}
});

export const {getEditors, startLoadEditors, endLoadEditors} = storeEditorEditors.actions;

export default storeEditorEditors.reducer;
