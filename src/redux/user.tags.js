import {createSlice} from '@reduxjs/toolkit'

export const storeUserTags = createSlice({
	name: 'userTags',
	initialState: {
		data: [],
		loadTags: false
	},
	reducers: {
		getAllTags(state, action) {
			state.data = [...action.payload];
		},
		startLoadTags(state, action) {
			state.loadTags = true;
		},
		endLoadTags(state, action) {
			state.loadTags = false;
		}
	}
});

export const {getAllTags, startLoadTags, endLoadTags} = storeUserTags.actions;

export default storeUserTags.reducer;
