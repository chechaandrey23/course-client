import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {getImages, startLoadImages, endLoadImages, moreImages, startLoadMoreImages, endLoadMoreImages,
		startLoadNewImage, endLoadNewImage, errorNewImageAC, newImageAC} from "../editor.images.js";

function* getPartImagesSaga({payload = {}}) {
	yield put(startLoadImages());
	const res = yield call(request, {
		method: 'get',
		url: `/editor/images`,
		...defaultRequestSettings
	});
	yield put(getImages(res.data));
	yield put(endLoadImages());
}

function* morePartImagesSaga({payload = {}}) {
	yield put(startLoadMoreImages());
	const res = yield call(request, {
		method: 'get',
		params: {page: payload.page},
		url: `/editor/images`,
		...defaultRequestSettings
	});
	yield put(moreImages(res.data));
	yield put(endLoadMoreImages());
}

function* newImageSaga({payload = {}}) {
	try {
		yield put(startLoadNewImage());
		const res = yield call(request, {
			method: 'post',
			url: `/editor/image-new`,
			data: payload.data,
			onUploadProgress: payload.progress,
			...defaultRequestSettings
		});
		yield put(newImageAC(res.data));
	} catch(e) {
		delete e.config
		yield put(errorNewImageAC(e));
	} finally {
		yield put(endLoadNewImage());
	}
}

const FETCH_GET_PART_IMAGES = 'FETCH_GET_PART_IMAGES';
const FETCH_NEW_IMAGE = 'FETCH_NEW_IMAGE';
const FETCH_MORE_PART_IMAGES = 'FETCH_MORE_PART_IMAGES';

export const editorImagesSagas = createSagas([
	[FETCH_GET_PART_IMAGES, getPartImagesSaga],
	[FETCH_MORE_PART_IMAGES, morePartImagesSaga],
	[FETCH_NEW_IMAGE, newImageSaga]
]);

export const {sagaGetPartImages, sagaMorePartImages, sagaNewImage} = createActions({
	sagaGetPartImages: FETCH_GET_PART_IMAGES,
	sagaMorePartImages: FETCH_MORE_PART_IMAGES,
	sagaNewImage: FETCH_NEW_IMAGE
});
