import {createSlice} from '@reduxjs/toolkit'

export const storeEditorReviews = createSlice({
	name: 'editorReviews',
	initialState: {
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
		
		newReview: false
	},
	reducers: {
		moreReviews(state, action) {
			state.data = [...state.data, ...action.payload];
		},
		startLoadMoreReviews(state, action) {
			state.dataMoreLoading = true;
		},
		endLoadMoreReviews(state, action) {
			state.dataMoreLoading = false;
		},
		
		getReviews(state, action) {
			state.data = [...action.payload];
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
			state.data = state.data.filter((entry) => entry.id !== action.payload.id);
		}
	}
});

export const {	moreReviews, startLoadMoreReviews, endLoadMoreReviews, getReviews, startLoadGetReviews, endLoadGetReviews,
				startLoadNewReview, endLoadNewReview, errorNewReview, newReview,
				removeReview, startLoadRemoveReview, endLoadRemoveReview, errorRemoveReview,
				getReview, startLoadGetReview, endLoadGetReview, startLoadSetReview, endLoadSetReview, errorSetReview} = storeEditorReviews.actions;

export default storeEditorReviews.reducer;
