import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {setRating, newRating, startLoadNewRating, endLoadNewRating, errorNewRating} from "../user.ratings.js";

function* newRatingSaga({payload = {}}) {
	try {
		yield put(startLoadNewRating());
		const res = yield call(request, {
			method: 'post',
			url: `/user/rating-new`,
			data: {rating: payload.rating, reviewId: payload.reviewId},
			...defaultRequestSettings
		});
		yield put(newRating(res.data));
	} catch(e) {
		yield put(errorNewRating(e));
	} finally {
		yield put(endLoadNewRating());
	}
}

const FETCH_NEW_RATING = 'FETCH_NEW_RATING';

export const userRatingsSagas = createSagas([
	[FETCH_NEW_RATING, newRatingSaga]
]);

export const {sagaNewRating} = createActions({
	sagaNewRating: FETCH_NEW_RATING,
});
