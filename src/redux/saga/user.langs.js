import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getLangs, startLoadLangs, endLoadLangs} from "../user.langs.js";

function* getAllLangsSaga({payload = {}}) {
	yield put(startLoadLangs());
	const res = yield call(request, {
		method: 'get',
		url: `/user/langs`,
		...defaultRequestSettings
	});
	yield put(getLangs(res.data));
	yield put(endLoadLangs());
}

const FETCH_GET_ALL_LANGS = 'FETCH_GET_ALL_LANGS';

export const userLangsSagas = createSagas([
	[FETCH_GET_ALL_LANGS, getAllLangsSaga]
]);

export const {sagaGetAllLangs} = createActions({
	sagaGetAllLangs: FETCH_GET_ALL_LANGS,
});
