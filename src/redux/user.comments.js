import {createSlice} from '@reduxjs/toolkit'

import Paginator from './helpers/Paginator.js'

export const storeUserComments = createSlice({
	name: 'userComments',
	initialState: {
		paginator: new Paginator(10),

		comments: [],
		commentsLoading: false,
		commentsMoreLoading: false,
		commentsAutoUpdateLoading: false,

		newComment: false,
		newCommentLoading: false,
		newCommentError: false,

		commentProcessing: [],

		editCommentError: false,
	},
	reducers: {
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
			state.paginator.append(state, 'comments', [action.payload]);
		},
		errorNewComment(state, action) {
			state.newCommentError = action.payload;
		},

		autoUpdateComments(state, action) {
			state.paginator.append(state, 'comments', action.payload);
		},
		startLoadAutoUpdateComments(state, action) {
			state.commentsAutoUpdateLoading = true;
		},
		endLoadAutoUpdateComments(state, action) {
			state.commentsAutoUpdateLoading = false;
		},

		startLoadRemoveComment(state, action) {
			state.commentProcessing = [...state.commentProcessing, action.payload];
		},
		removeComment(state, action) {
			state.paginator.remove(state, 'comments', (entry) => entry.id != action.payload.id);
		},
		errorRemoveComment(state, action) {
			console.log(action.payload);
		},
		endLoadRemoveComment(state, action) {
			state.commentProcessing = state.commentProcessing.filter((entry) => entry.id == action.payload);
		},

		startLoadEditComment(state, action) {
			state.commentProcessing = [...state.commentProcessing, action.payload];
		},
		endLoadEditComment(state, action) {
			state.commentProcessing = state.commentProcessing.filter((entry) => entry.id == action.payload);
		},
		errorLoadEditComment(state, action) {
			state.editCommentError = action.payload;
		},
		editComment(state, action) {
			state.comments = state.comments.map((entry) => {
				return entry.id == action.payload.id?action.payload:entry;
			});
		},

	}
});

export const {	moreComments, startLoadMoreComments, endLoadMoreComments,
				getComments, startLoadGetComments, endLoadGetComments,
				autoUpdateComments, startLoadAutoUpdateComments, endLoadAutoUpdateComments,
				startLoadNewComment, endLoadNewComment, newComment, errorNewComment,
				startLoadRemoveComment, removeComment, errorRemoveComment, endLoadRemoveComment,
				startLoadEditComment, endLoadEditComment, errorLoadEditComment, editComment,
				setReviewId} = storeUserComments.actions;

export default storeUserComments.reducer;
