import {createSlice} from '@reduxjs/toolkit'

export const storeUserReviews = createSlice({
	name: 'userReviews',
	initialState: {
		data: [],
		dataItem: {},
		dataItemLoading: false
	},
	reducers: {
		moreReviews(state, action) {
			state.data = [...state.data, ...action.payload];
		},
		getReviews(state, action) {
			state.data = [...action.payload];
		},
		getReview(state, action) {
			state.dataItem = action.payload;
			state.dataItemLoading = false;
		},
		getReviewLoading(state, action) {
			state.dataItemLoading = true;
		},
		getReviewError(state, action) {
			state.dataItemLoading = false;
		}
	}
});

export const {moreReviews, getReviews, getReview, getReviewLoading, getReviewError} = storeUserReviews.actions;

export default storeUserReviews.reducer;
