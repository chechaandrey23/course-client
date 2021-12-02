import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getThemes, startLoadThemes, endLoadThemes} from "../user.themes.js";

function* getAllThemesSaga({payload = {}}) {
	yield put(startLoadThemes());
	const res = yield call(request, {
		method: 'get',
		url: `/user/themes`,
		...defaultRequestSettings
	});
	yield put(getThemes(res.data));
	yield put(endLoadThemes());
}

const FETCH_GET_ALL_THEMES = 'FETCH_GET_ALL_THEMES';

export const userThemesSagas = createSagas([
	[FETCH_GET_ALL_THEMES, getAllThemesSaga]
]);

export const {sagaGetAllThemes} = createActions({
	sagaGetAllThemes: FETCH_GET_ALL_THEMES,
});
