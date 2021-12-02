import {createSlice} from '@reduxjs/toolkit'

import Paginator from './helpers/Paginator.js'

export const storeUserComments = createSlice({
	name: 'userComments',
	initialState: {
		reviewId: null,

		paginator: new Paginator(20),

		comments: [],
		commentsLoading: false,
		commentsMoreLoading: false,
		commentsAutoUpdateLoading: false,

		newComment: false,
		newCommentLoading: false,
		newCommentError: false
	},
	reducers: {
		setReviewId(state, action) {
			state.reviewId = action.payload;
		},

		moreComments(state, action) {
			//state.data = [...state.data, ...action.payload];
			state.paginator.addWithReplace(state, 'comments', action.payload);
		},
		startLoadMoreComments(state, action) {
			state.commentsMoreLoading = true;
		},
		endLoadMoreComments(state, action) {
			state.commentsMoreLoading = false;
		},

		getComments(state, action) {
			//state.data = [...action.payload];
			state.paginator.replace(state, 'comments', action.payload);
		},
		startLoadGetComments(state, action) {
			state.commentsLoading = true;
		},
		endLoadGetComments(state, action) {
			state.commentsLoading = false;
		},

		startLoadNewComment(state, action) {
			state.newCommentLoading = true;
		},
		endLoadNewComment(state, action) {
			state.newCommentLoading = false;
		},
		newComment(state, action) {
			state.newComment = action.payload;
			// ...
		},
		errorNewComment(state, action) {
			state.newCommentError = action.payload;
		},

		autoUpdateComments(state, action) {
			//state.data = [...state.data, ...action.payload];
			state.paginator.addToEnd(state, 'comments', action.payload);
		},
		startLoadAutoUpdateComments(state, action) {
			state.commentsAutoUpdateLoading = true;
		},
		endLoadAutoUpdateComments(state, action) {
			state.commentsAutoUpdateLoading = false;
		},
	}
});

export const {	moreComments, startLoadMoreComments, endLoadMoreComments,
				getComments, startLoadGetComments, endLoadGetComments,
				autoUpdateComments, startLoadAutoUpdateComments, endLoadAutoUpdateComments,
				startLoadNewComment, endLoadNewComment, newComment, errorNewComment,
				setReviewId} = storeUserComments.actions;

export default storeUserComments.reducer;
