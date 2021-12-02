import {createSlice} from '@reduxjs/toolkit'

export const storeEditorTitles = createSlice({
	name: 'editorTitles',
	initialState: {
		titles: [],
		loadTitles: false,
		loadNewTitle: false,
		errorNewTitle: false,
		newTitle: false
	},
	reducers: {
		getTitles(state, action) {
			state.titles = [...action.payload];
		},
		startLoadTitles(state, action) {
			state.loadTitles = true;
		},
		endLoadTitles(state, action) {
			state.loadTitles = false;
		},
		startLoadNewTitle(state, action) {
			state.loadNewTitle = true;
		},
		endLoadNewTitle(state, action) {
			state.loadNewTitle = false;
		},
		errorNewTitle(state, action) {
			state.errorNewTitle = action.payload;
		},
		newTitle(state, action) {
			state.titles = [action.payload, ...state.titles];
			state.newTitle = action.payload;
		}
	}
});

export const {	getTitles, startLoadTitles, endLoadTitles,
				startLoadNewTitle, endLoadNewTitle, errorNewTitle, newTitle} = storeEditorTitles.actions;

export default storeEditorTitles.reducer;
