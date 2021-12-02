import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreComments, startLoadMoreComments, endLoadMoreComments,
		getComments, startLoadGetComments, endLoadGetComments,
		autoUpdateComments, startLoadAutoUpdateComments, endLoadAutoUpdateComments,
		startLoadNewComment, endLoadNewComment, newComment, errorNewComment} from "../user.comments.js";


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
		params: payload,
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

const FETCH_COMMENTS = 'FETCH_COMMENTS';
const FETCH_MORE_COMMENTS = 'FETCH_MORE_COMMENTS';
const FETCH_AUTO_UPDATE_COMMENTS = 'FETCH_AUTO_UPDATE_COMMENTS';
const FETCH_NEW_COMMENT = 'FETCH_NEW_COMMENT';

export const userCommentsSagas = createSagas([
	[FETCH_COMMENTS, getCommentsSaga],
	[FETCH_MORE_COMMENTS, moreCommentsSaga],
	[FETCH_AUTO_UPDATE_COMMENTS, autoUpdateCommentsSaga],
	[FETCH_NEW_COMMENT, newCommentSaga]
]);

export const {sagaGetComments, sagaMoreComments, sagaAutoUpdateComments, sagaNewComment} = createActions({
	sagaGetComments: FETCH_COMMENTS,
	sagaMoreComments: FETCH_MORE_COMMENTS,
	sagaAutoUpdateComments: FETCH_AUTO_UPDATE_COMMENTS,
	sagaNewComment: FETCH_NEW_COMMENT,
});
