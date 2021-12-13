import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreComments, startLoadMoreComments, endLoadMoreComments,
		getComments, startLoadGetComments, endLoadGetComments,
		autoUpdateComments, startLoadAutoUpdateComments, endLoadAutoUpdateComments,
		startLoadNewComment, endLoadNewComment, newComment, errorNewComment,
		startLoadRemoveComment, removeComment, errorRemoveComment, endLoadRemoveComment,
		startLoadEditComment, endLoadEditComment, errorLoadEditComment, editComment} from "../user.comments.js";


function* getCommentsSaga({payload = {}}) {
	yield put(startLoadGetComments());
	const res = yield call(request, {
		method: 'get',
		url: `/user/comments`,
		params: payload,
		...defaultRequestSettings
	});
	yield put(getComments(res.data));
	yield put(endLoadGetComments());
}

function* moreCommentsSaga({payload = {}}) {
	yield put(startLoadMoreComments());
	const res = yield call(request, {
		method: 'get',
		url: `/user/comments`,
		params: payload,
		...defaultRequestSettings
	});
	yield put(moreComments(res.data));
	yield put(endLoadMoreComments());
}

function* autoUpdateCommentsSaga({payload = {}}) {
	yield put(startLoadAutoUpdateComments());
	const res = yield call(request, {
		method: 'get',
		url: `/user/auto-update-comments`,
		params: {time: payload.time, reviewId: payload.reviewId},
		...defaultRequestSettings
	});
	yield put(autoUpdateComments(res.data));
	yield put(endLoadAutoUpdateComments());
}

function* newCommentSaga({payload = {}}) {
	try {
		yield put(startLoadNewComment());
		const res = yield call(request, {
			method: 'post',
			url: `/user/new-comment`,
			data: {comment: payload.comment, reviewId: payload.reviewId},
			...defaultRequestSettings
		});
		yield put(newComment(res.data));
	} catch(e) {
		delete e.config
		yield put(errorNewComment(e));
	} finally {
		yield put(endLoadNewComment());
	}
}

function* removeCommentSaga({payload = {}}) {
	try {
		yield put(startLoadRemoveComment(payload.id));
		const res = yield call(request, {
			method: 'post',
			url: `/user/remove-comment`,
			data: {id: payload.id},
			...defaultRequestSettings
		});
		yield put(removeComment(res.data));
	} catch(e) {
		delete e.config
		yield put(errorRemoveComment(e));
	} finally {
		yield put(endLoadRemoveComment(payload.id));
	}
}

function* editCommentSaga({payload = {}}) {
	try {
		yield put(startLoadEditComment(payload.id));
		const res = yield call(request, {
			method: 'post',
			url: `/user/edit-comment`,
			data: {comment: payload.comment, reviewId: payload.reviewId, id: payload.id},
			...defaultRequestSettings
		});
		yield put(editComment(res.data));
	} catch(e) {
		delete e.config
		yield put(errorLoadEditComment(e));
	} finally {
		yield put(endLoadEditComment(payload.id));
	}
}

const FETCH_COMMENTS = 'FETCH_COMMENTS';
const FETCH_MORE_COMMENTS = 'FETCH_MORE_COMMENTS';
const FETCH_AUTO_UPDATE_COMMENTS = 'FETCH_AUTO_UPDATE_COMMENTS';
const FETCH_NEW_COMMENT = 'FETCH_NEW_COMMENT';
const FETCH_REMOVE_COMMENT = 'FETCH_REMOVE_COMMENT';
const FETCH_EDIT_COMMENT = 'FETCH_EDIT_COMMENT';

export const userCommentsSagas = createSagas([
	[FETCH_COMMENTS, getCommentsSaga],
	[FETCH_MORE_COMMENTS, moreCommentsSaga],
	[FETCH_AUTO_UPDATE_COMMENTS, autoUpdateCommentsSaga],
	[FETCH_NEW_COMMENT, newCommentSaga],
	[FETCH_REMOVE_COMMENT, removeCommentSaga],
	[FETCH_EDIT_COMMENT, editCommentSaga]
]);

export const {sagaGetComments, sagaMoreComments, sagaAutoUpdateComments, sagaNewComment, sagaRemoveComment, sagaEditComment} = createActions({
	sagaGetComments: FETCH_COMMENTS,
	sagaMoreComments: FETCH_MORE_COMMENTS,
	sagaAutoUpdateComments: FETCH_AUTO_UPDATE_COMMENTS,
	sagaNewComment: FETCH_NEW_COMMENT,
	sagaRemoveComment: FETCH_REMOVE_COMMENT,
	sagaEditComment: FETCH_EDIT_COMMENT
});
