import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getGroups, startLoadGroups, endLoadGroups} from "../editor.groups.js";

function* getAllGroupsSaga({payload = {}}) {
	yield put(startLoadGroups());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/groups`,
		...defaultRequestSettings
	});
	yield put(getGroups(res.data));
	yield put(endLoadGroups());
}

const FETCH_GET_ALL_GROUPS = 'FETCH_GET_ALL_GROUPS';

export const editorGroupsSagas = createSagas([
	[FETCH_GET_ALL_GROUPS, getAllGroupsSaga]
]);

export const {sagaGetAllGroups} = createActions({
	sagaGetAllGroups: FETCH_GET_ALL_GROUPS,
});
