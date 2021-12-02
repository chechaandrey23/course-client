import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {newLike, startLoadNewLike, endLoadNewLike, errorNewLike} from "../user.likes.js";

function* newLikeSaga({payload = {}}) {
	try {
		yield put(startLoadNewLike());
		const res = yield call(request, {
			method: 'post',
			url: `/user/like-new`,
			data: {reviewId: payload.reviewId},
			...defaultRequestSettings
		});
		yield put(newLike(res.data));
	} catch(e) {
		yield put(errorNewLike(e));
	} finally {
		yield put(endLoadNewLike());
	}
}

const FETCH_NEW_LIKE = 'FETCH_NEW_LIKE';

export const userLikesSagas = createSagas([
	[FETCH_NEW_LIKE, newLikeSaga]
]);

export const {sagaNewLike} = createActions({
	sagaNewLike: FETCH_NEW_LIKE,
});
