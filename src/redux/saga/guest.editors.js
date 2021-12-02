import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getEditors, startLoadEditors, endLoadEditors} from "../guest.editors.js";

function* getPartEditorsSaga({payload = {}}) {
	yield put(startLoadEditors());
	const res = yield call(request, {
		method: 'get',
		url: `/guest/editor-short-part/`,
		params: {page: payload.page},
		...defaultRequestSettings
	});
	yield put(getEditors(res.data));
	yield put(endLoadEditors());
}

const FETCH_GET_PART_EDITORS = 'FETCH_GET_PART_EDITORS';

export const guestEditorsSagas = createSagas([
	[FETCH_GET_PART_EDITORS, getPartEditorsSaga],
]);

export const {sagaGetPartEditors} = createActions({
	sagaGetPartEditors: FETCH_GET_PART_EDITORS,
});
