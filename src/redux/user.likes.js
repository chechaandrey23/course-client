import {createSlice} from '@reduxjs/toolkit'

export const storeUserLikes = createSlice({
	name: 'userLikes',
	initialState: {
		likes: 0,
		like: null,
		loadNewLike: false
	},
	reducers: {
		setCountLikes(state, action) {
			state.likes = action.payload * 1;
		},
		newLike(state, action) {
			state.like = action.payload;
			state.likes = state.likes + 1;
		},
		startLoadNewLike(state, action) {
			state.loadNewLike = true;
		},
		endLoadNewLike(state, action) {
			state.loadNewLike = false;
		},
		errorNewLike(state, action) {
			state.errorNewLike = action.payload;
		}
	}
});

export const {setCountLikes, newLike, startLoadNewLike, endLoadNewLike, errorNewLike} = storeUserLikes.actions;

export default storeUserLikes.reducer;
