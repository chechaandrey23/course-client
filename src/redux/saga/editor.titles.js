import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getTitles, startLoadTitles, endLoadTitles, startLoadNewTitle, endLoadNewTitle, errorNewTitle, newTitle} from "../editor.titles.js";

function* getPartTitlesSaga({payload = {}}) {
	yield put(startLoadTitles());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/part-titles/`+encodeURIComponent(payload),
		...defaultRequestSettings
	});
	yield put(getTitles(res.data));
	yield put(endLoadTitles());
}

function* newTitleSaga({payload = {}}) {
	try {
		yield put(startLoadNewTitle());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/title-new`,
			data: {title: payload.title, description: payload.description},
			...defaultRequestSettings
		});
		yield put(newTitle(res.data));
	} catch(e) {
		delete e.config
		yield put(errorNewTitle(e));
	} finally {
		yield put(endLoadNewTitle());
	}
}

const FETCH_GET_PART_TITLES = 'FETCH_GET_PART_TITLES';
const FETCH_NEW_TITLE = 'FETCH_NEW_TITLE';

export const editorTitlesSagas = createSagas([
	[FETCH_GET_PART_TITLES, getPartTitlesSaga],
	[FETCH_NEW_TITLE, newTitleSaga]
]);

export const {sagaGetPartTitles, sagaNewTitle} = createActions({
	sagaGetPartTitles: FETCH_GET_PART_TITLES,
	sagaNewTitle: FETCH_NEW_TITLE
});
