import {createSlice} from '@reduxjs/toolkit'

export const storeUserRatings = createSlice({
	name: 'userRatings',
	initialState: {
		rating: 0,
		loadNewRating: false
	},
	reducers: {
		setRating(state, action) {
			state.rating = action.payload * 1;
		},
		newRating(state, action) {
			state.rating = action.payload.userRating;
		},
		startLoadNewRating(state, action) {
			state.loadNewRating = true;
		},
		endLoadNewRating(state, action) {
			state.loadNewRating = false;
		},
		errorNewRating(state, action) {
			state.errorNewRating = action.payload;
		}
	}
});

export const {setRating, newRating, startLoadNewRating, endLoadNewRating, errorNewRating} = storeUserRatings.actions;

export default storeUserRatings.reducer;
