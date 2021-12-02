import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreReviews, startLoadMoreReviews, endLoadMoreReviews, getReviews, startLoadGetReviews, endLoadGetReviews,
		startLoadNewReview, endLoadNewReview, errorNewReview, newReview,
		removeReview, startLoadRemoveReview, endLoadRemoveReview, errorRemoveReview,
		getReview, startLoadGetReview, endLoadGetReview, startLoadSetReview, endLoadSetReview, errorSetReview} from "../editor.reviews.js";


function* getReviewsSaga({payload = {}}) {
	yield put(startLoadGetReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/reviews`,
		params: payload,
		...defaultRequestSettings
	});
	yield put(getReviews(res.data));
	yield put(endLoadGetReviews());
}

function* moreReviewsSaga({payload = {}}) {
	yield put(startLoadMoreReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/reviews`,
		...defaultRequestSettings
	});
	yield put(moreReviews(res.data));
	yield put(endLoadMoreReviews());
}

function* getReviewSaga({payload = {}}) {
	yield put(startLoadGetReview());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/review/`+payload,
		...defaultRequestSettings
	});
	yield put(getReview(res.data));
	yield put(endLoadGetReview());
}

function* editReviewSaga({payload = {}}) {
	try {
		yield put(startLoadSetReview());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/review-edit`,
			data: {	id: payload.id, groupId: payload.group, titleId: payload.title, description: payload.description || '', text: payload.text || '',
					tags: payload.tags || [], authorRating: payload.authorRating || 0, draft: payload.draft},
			...defaultRequestSettings
		});
		yield put(getReview(res.data));
	} catch(e) {
		delete e.config
		yield put(errorSetReview(e));
	} finally {
		yield put(endLoadSetReview());
	}
}

function* newReviewSaga({payload = {}}) {
	try {
		yield put(startLoadNewReview());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/review-new`,
			data: {},
			...defaultRequestSettings
		});
		yield put(newReview(res.data));
	} catch(e) {
		delete e.config
		yield put(errorNewReview(e));
	} finally {
		yield put(endLoadNewReview());
	}
}

function* removeReviewSaga({payload = {}}) {
	try {
		yield put(startLoadRemoveReview());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/review-remove`,
			data: {id: payload.id},
			...defaultRequestSettings
		});
		yield put(removeReview(res.data));
	} catch(e) {
		delete e.config
		yield put(errorRemoveReview(e));
	} finally {
		yield put(endLoadRemoveReview());
	}
}

const FETCH_REVIEWS = 'FETCH_REVIEWS';
const FETCH_MORE_REVIEWS = 'FETCH_MORE_REVIEWS';
const FETCH_REVIEW = 'FETCH_REVIEW';
const FETCH_NEW_REVIEW = 'FETCH_NEW_REVIEW';
const FETCH_EDIT_REVIEW = 'FETCH_EDIT_REVIEW';
const REMOVE_REVIEW = 'REMOVE_REVIEW';

export const editorReviewsSagas = createSagas([
	[FETCH_REVIEWS, getReviewsSaga],
	[FETCH_MORE_REVIEWS, moreReviewsSaga],
	[FETCH_REVIEW, getReviewSaga],
	[FETCH_NEW_REVIEW, newReviewSaga],
	[FETCH_EDIT_REVIEW, editReviewSaga],
	[REMOVE_REVIEW, removeReviewSaga]
]);

export const {sagaGetReviews, sagaMoreReviews, sagaGetReview, sagaNewReview, sagaEditReview, sagaRemoveReview} = createActions({
	sagaGetReviews: FETCH_REVIEWS,
	sagaMoreReviews: FETCH_MORE_REVIEWS,
	sagaGetReview: FETCH_REVIEW,
	sagaNewReview: FETCH_NEW_REVIEW,
	sagaEditReview: FETCH_EDIT_REVIEW,
	sagaRemoveReview: REMOVE_REVIEW
});
