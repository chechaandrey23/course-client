import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {moreReviews, startLoadMoreReviews, endLoadMoreReviews,
		getReviews, startLoadGetReviews, endLoadGetReviews,
		getReviewItem, startLoadGetReviewItem, endLoadGetReviewItem} from "../user.reviews.js";

function* getSearchReviewsSaga({payload = {}}) {
	yield put(startLoadGetReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/${payload.isUser?'user':'guest'}/search/${payload.query}`,
		params: payload.params,
		...defaultRequestSettings
	});
	yield put(getReviews(res.data));
	yield put(endLoadGetReviews());
}

function* moreSearchReviewsSaga({payload = {}}) {
	yield put(startLoadMoreReviews());
	const res = yield call(request, {
		method: 'get',
		url: `/${payload.isUser?'user':'guest'}/search/${payload.query}`,
		params: payload.params,
		...defaultRequestSettings
	});
	yield put(moreReviews(res.data));
	yield put(endLoadMoreReviews());
}

const FETCH_MORE_SEARCH_REVIEWS = 'FETCH_MORE_SEARCH_REVIEWS';
const FETCH_GET_SEARCH_REVIEWS = 'FETCH_GET_SEARCH_REVIEWS';

export const userSearchReviewsSagas = createSagas([
	[FETCH_MORE_SEARCH_REVIEWS, moreSearchReviewsSaga],
	[FETCH_GET_SEARCH_REVIEWS, getSearchReviewsSaga],
]);

export const {sagaMoreSearchReviews, sagaGetSearchReviews} = createActions({
	sagaMoreSearchReviews: FETCH_MORE_SEARCH_REVIEWS,
	sagaGetSearchReviews: FETCH_GET_SEARCH_REVIEWS
});
