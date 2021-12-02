import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreReviews, getReviews, getReview, getReviewLoading, getReviewError} from "../user.reviews.js";
/// EDITINIG !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function* moreReviewsSaga({payload={}}) {
	try {
		const res = yield call(request, {
			method: 'get',
			url: `/${payload.isUser?'user':'guest'}/reviews`,
			params: payload.params,
			...defaultRequestSettings
		});
		yield put(moreReviews(res.data));
	} catch(e) {
		throw e;
	}
}

function* getReviewsSaga({payload={}}) {
	try {
		const res = yield call(request, {
			method: 'get',
			url: `/${payload.isUser?'user':'guest'}/reviews`,
			params: payload.params,
			...defaultRequestSettings
		});
		yield put(getReviews(res.data));
	} catch(e) {
		throw e;
	}
}

function* getReviewSaga({payload}) {
	try {
		yield put(getReviewLoading());
		const res = yield call(request, {
			method: 'get',
			url: `/${payload.isUser?'user':'guest'}/review/${payload.id}`,
			...defaultRequestSettings
		});
		yield put(getReview(res.data));
	} catch(e) {
		throw e;
	}
}

const FETCH_MORE_REVIEWS = 'FETCH_MORE_REVIEWS';
const FETCH_GET_REVIEWS = 'FETCH_GET_REVIEWS';
const FETCH_GET_REVIEW = 'FETCH_GET_REVIEW';

export const userReviewsSagas = createSagas([
	[FETCH_MORE_REVIEWS, moreReviewsSaga],
	[FETCH_GET_REVIEWS, getReviewsSaga],
	[FETCH_GET_REVIEW, getReviewSaga]
]);

export const {sagaMoreReviews, sagaGetReviews, sagaGetReview} = createActions({
	sagaMoreReviews: FETCH_MORE_REVIEWS,
	sagaGetReviews: FETCH_GET_REVIEWS,
	sagaGetReview: FETCH_GET_REVIEW
});
