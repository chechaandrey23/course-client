import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getTags, startLoadTags, endLoadTags, startLoadNewTag, endLoadNewTag, errorNewTag, newTag} from "../editor.tags.js";

function* getPartTagsSaga({payload = {}}) {
	yield put(startLoadTags());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/part-tags/`+encodeURIComponent(payload),
		...defaultRequestSettings
	});
	yield put(getTags(res.data));
	yield put(endLoadTags());
}

function* newTagSaga({payload = {}}) {
	try {
		yield put(startLoadNewTag());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/tag-new`,
			data: {tag: payload},
			...defaultRequestSettings
		});
		yield put(newTag(res.data));
	} catch(e) {
		delete e.config
		yield put(errorNewTag(e));
	} finally {
		yield put(endLoadNewTag());
	}
}

const FETCH_GET_PART_TAGS = 'FETCH_GET_PART_TAGS';
const FETCH_NEW_TAG = 'FETCH_NEW_TAG';

export const editorTagsSagas = createSagas([
	[FETCH_GET_PART_TAGS, getPartTagsSaga],
	[FETCH_NEW_TAG, newTagSaga]
]);

export const {sagaGetPartTags, sagaNewTag} = createActions({
	sagaGetPartTags: FETCH_GET_PART_TAGS,
	sagaNewTag: FETCH_NEW_TAG
});
