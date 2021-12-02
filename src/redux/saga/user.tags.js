import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getAllTags} from "../user.tags.js";

// editing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function* getAllTagsSaga({payload = {}}) {
	try {
		const res = yield call(request, {
			method: 'get',
			url: `/guest/tags${payload.order?'/order-true':''}`,
			...defaultRequestSettings
		});
		yield put(getAllTags(res.data));
	} catch(e) {
		throw e;
	}
}

const FETCH_GET_ALL_TAGS = 'FETCH_GET_ALL_TAGS';

export const userTagsSagas = createSagas([
	[FETCH_GET_ALL_TAGS, getAllTagsSaga]
]);

export const {sagaGetAllTags} = createActions({
	sagaGetAllTags: FETCH_GET_ALL_TAGS,
});
