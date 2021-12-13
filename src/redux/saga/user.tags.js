import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getAllTags, startLoadTags, endLoadTags} from "../user.tags.js";

function* getAllTagsSaga({payload = {}}) {
	yield put(startLoadTags());
	const res = yield call(request, {
		method: 'get',
		url: `/guest/tags${payload.order?'/order-true':''}`,
		...defaultRequestSettings
	});
	yield put(getAllTags(res.data));
	yield put(endLoadTags());
}

const FETCH_GET_ALL_TAGS = 'FETCH_GET_ALL_TAGS';

export const userTagsSagas = createSagas([
	[FETCH_GET_ALL_TAGS, getAllTagsSaga]
]);

export const {sagaGetAllTags} = createActions({
	sagaGetAllTags: FETCH_GET_ALL_TAGS,
});
