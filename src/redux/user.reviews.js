import {createSlice} from '@reduxjs/toolkit'

import Paginator from './helpers/Paginator.js'

export const storeUserReviews = createSlice({
	name: 'userReviews',
	initialState: {
		paginator: new Paginator(10),

		currentReview: null,

		data: [],
		dataLoading: false,
		dataMoreLoading: false,

		dataItem: null,
		dataItemLoading: false,

		otherData: [],
		otherDataLoading: false
	},
	reducers: {
		setCurrentReview(state, action) {
			state.currentReview = action.payload || null;
		},

		moreReviews(state, action) {
			state.paginator.addWithReplace(state, 'data', action.payload);
		},
		startLoadMoreReviews(state, action) {
			state.dataMoreLoading = true;
		},
		endLoadMoreReviews(state, action) {
			state.dataMoreLoading = false;
		},

		getReviews(state, action) {
			state.paginator.replace(state, 'data', action.payload);
		},
		startLoadGetReviews(state, action) {
			state.dataLoading = true;
		},
		endLoadGetReviews(state, action) {
			state.dataLoading = false;
		},

		getReviewItem(state, action) {
			state.dataItem = action.payload;
		},
		startLoadGetReviewItem(state, action) {
			state.dataItemLoading = true;
		},
		endLoadGetReviewItem(state, action) {
			state.dataItemLoading = false;
		},

		getOtherReviews(state, action) {
			state.otherData = action.payload;
		},
		startLoadGetOtherReviews(state, action) {
			state.otherDataLoading = true;
		},
		endLoadGetOtherReviews(state, action) {
			state.otherDataLoading = false;
		},
	}
});

export const {  setCurrentReview,
				moreReviews, startLoadMoreReviews, endLoadMoreReviews,
				getReviews, startLoadGetReviews, endLoadGetReviews,
				getReviewItem, startLoadGetReviewItem, endLoadGetReviewItem,
				getOtherReviews, startLoadGetOtherReviews, endLoadGetOtherReviews} = storeUserReviews.actions;

export default storeUserReviews.reducer;
