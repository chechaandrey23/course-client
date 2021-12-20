import {createSlice} from '@reduxjs/toolkit'

import Paginator from './helpers/Paginator.js'

export const storeEditorReviews = createSlice({
	name: 'editorReviews',
	initialState: {
		paginator: new Paginator(10),

		data: [],
		dataLoading: false,
		dataMoreLoading: false,
		dataItem: {},
		dataItemLoading: false,
		dataItemSetLoading: false,
		dataItemError: false,
		dataItemNewLoading: false,

		dataItemRemoveLoading: false,
		dataItemRemoveError: false,

		newReview: false,
		dataNewError: false
	},
	reducers: {
		moreReviews(state, action) {
			//state.data = [...state.data, ...action.payload];
			state.paginator.addWithReplace(state, 'data', action.payload);
		},
		startLoadMoreReviews(state, action) {
			state.dataMoreLoading = true;
		},
		endLoadMoreReviews(state, action) {
			state.dataMoreLoading = false;
		},

		getReviews(state, action) {
			//state.data = [...action.payload];
			state.paginator.replace(state, 'data', action.payload);
		},
		startLoadGetReviews(state, action) {
			state.dataLoading = true;
		},
		endLoadGetReviews(state, action) {
			state.dataLoading = false;
		},

		getReview(state, action) {
			state.dataItem = action.payload;
		},
		startLoadGetReview(state, action) {
			state.dataItemLoading = true;
		},
		endLoadGetReview(state, action) {
			state.dataItemLoading = false;
		},
		startLoadSetReview(state, action) {
			state.dataItemSetLoading = true;
		},
		endLoadSetReview(state, action) {
			state.dataItemSetLoading = false;
		},
		errorSetReview(state, action) {
			state.dataItemError = action.payload;
		},

		startLoadNewReview(state, action) {
			state.dataItemNewLoading = true;
		},
		endLoadNewReview(state, action) {
			state.dataItemNewLoading = false;
		},
		newReview(state, action) {
			state.newReview = action.payload;
		},
		errorNewReview(state, action) {
			state.dataNewError = action.payload;
		},

		startLoadRemoveReview(state, action) {
			state.dataItemRemoveLoading = true;
		},
		endLoadRemoveReview(state, action) {
			state.dataItemRemoveLoading = false;
		},
		errorRemoveReview(state, action) {
			state.dataItemRemoveError = action.payload;
		},
		removeReview(state, action) {
			//state.data = state.data.filter((entry) => entry.id !== action.payload.id);
			state.paginator.remove(state, 'data', (entry) => entry.id != action.payload.id);
		}
	}
});

export const {	moreReviews, startLoadMoreReviews, endLoadMoreReviews, getReviews, startLoadGetReviews, endLoadGetReviews,
				startLoadNewReview, endLoadNewReview, errorNewReview, newReview,
				removeReview, startLoadRemoveReview, endLoadRemoveReview, errorRemoveReview,
				getReview, startLoadGetReview, endLoadGetReview, startLoadSetReview, endLoadSetReview, errorSetReview} = storeEditorReviews.actions;

export default storeEditorReviews.reducer;
