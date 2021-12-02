import {createSlice} from '@reduxjs/toolkit'

export const storeUserThemes = createSlice({
	name: 'userThemes',
	initialState: {
		themes: [],
		loadThemes: false
	},
	reducers: {
		getThemes(state, action) {
			state.themes = [...action.payload];
		},
		startLoadThemes(state, action) {
			state.loadThemes = true;
		},
		endLoadThemes(state, action) {
			state.loadThemes = false;
		}
	}
});

export const {getThemes, startLoadThemes, endLoadThemes} = storeUserThemes.actions;

export default storeUserThemes.reducer;
