import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreReviews, startLoadMoreReviews, endLoadMoreReviews,
		getReviews, startLoadGetReviews, endLoadGetReviews,
		getReviewItem, startLoadGetReviewItem, endLoadGetReviewItem,
		getOtherReviews, startLoadGetOtherReviews, endLoadGetOtherReviews} from "../user.reviews.js";

function* getReviewsSaga({payload = {}}) {
	yield put(startLoadGetReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/${payload.isUser?'user':'guest'}/reviews`,
		params: payload.params,
		...defaultRequestSettings
	});
	yield put(getReviews(res.data));
	yield put(endLoadGetReviews());
}

function* moreReviewsSaga({payload = {}}) {
	yield put(startLoadMoreReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/${payload.isUser?'user':'guest'}/reviews`,
		params: payload.params,
		...defaultRequestSettings
	});
	yield put(moreReviews(res.data));
	yield put(endLoadMoreReviews());
}

function* getReviewSaga({payload = {}}) {
	yield put(startLoadGetReviewItem());
	const res = yield call(request, {
		method: 'get',
		url: `/${payload.isUser?'user':'guest'}/review/${payload.id}`,
		...defaultRequestSettings
	});
	yield put(getReviewItem(res.data));
	yield put(endLoadGetReviewItem());
}

function* getOtherReviewSaga({payload = {}}) {
	yield put(startLoadGetOtherReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/guest/other-short-reviews/${payload.id}`,
		...defaultRequestSettings
	});
	yield put(getOtherReviews(res.data));
	yield put(endLoadGetOtherReviews());
}

const FETCH_MORE_REVIEWS = 'FETCH_MORE_REVIEWS';
const FETCH_GET_REVIEWS = 'FETCH_GET_REVIEWS';
const FETCH_GET_REVIEW = 'FETCH_GET_REVIEW';
const FETCH_OTHER_REVIEWS = 'FETCH_OTHER_REVIEWS';

export const userReviewsSagas = createSagas([
	[FETCH_MORE_REVIEWS, moreReviewsSaga],
	[FETCH_GET_REVIEWS, getReviewsSaga],
	[FETCH_GET_REVIEW, getReviewSaga],
	[FETCH_OTHER_REVIEWS, getOtherReviewSaga]
]);

export const {sagaMoreReviews, sagaGetReviews, sagaGetReview, sagaOtherReviews} = createActions({
	sagaMoreReviews: FETCH_MORE_REVIEWS,
	sagaGetReviews: FETCH_GET_REVIEWS,
	sagaGetReview: FETCH_GET_REVIEW,
	sagaOtherReviews: FETCH_OTHER_REVIEWS
});
