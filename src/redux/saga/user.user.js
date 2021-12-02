import { take, call, put, select } from 'redux-saga/effects';

import {request} from './helpers/helper.request.js';
import {defaultRequestSettings} from './helpers/helper.default.request.settings.js';
import {createSagas, createActions} from './helpers/helper.saga.js';

import {login, startLoadLogin, endLoadLogin, errorLogin, 
		logout, startLoadLogout, endLoadLogout, errorLogout, 
		registration, startLoadRegistration, endLoadRegistration, errorRegistration, 
		user, userInfo, startLoadGetUser, endLoadGetUser, startLoadSetUser, endLoadSetUser, errorSetUser} from "../user.user.js";
import {setCountLikes} from "../user.likes.js";

function* loginSaga({payload = {}}) {
	try {
		yield put(startLoadLogin());
		const res = yield call(request, {
			method: 'post',
			url: `/auth/api/login`,
			data: {username: payload.user, password: payload.password},
			...defaultRequestSettings
		});
		yield put(login(true));
	} catch(e) {
		yield put(errorLogin(e));
	} finally {
		yield put(endLoadLogin());
	}
}

function* logoutSaga({payload = {}}) {
	yield put(startLoadLogout());
	const res = yield call(request, {
		method: 'post',
		url: `/auth/api/logout`,
		...defaultRequestSettings
	});
	yield put(logout(true));
	yield put(endLoadLogout());
}

function* registrationSaga({payload = {}}) {
	try {
		yield put(startLoadRegistration());
		const res = yield call(request, {
			method: 'post',
			url: `/auth/api/registration`,
			data: {username: payload.user, password: payload.password, password2: payload.password2, email: payload.email, first_name: payload.first_name, last_name: payload.last_name},
			...defaultRequestSettings
		});
		yield put(registration(true));
	} catch(e) {
		delete e.config
		yield put(errorRegistration(e));
	} finally {
		yield put(endLoadRegistration());
	}
}

function* getUserSaga() {
	yield put(startLoadGetUser());
	const res = yield call(request, {
		method: 'get',
		url: `/user/user`,
		...defaultRequestSettings
	});
	
	yield put(setCountLikes(res.data.countUserLike));
	yield put(user(res.data));
	yield put(endLoadGetUser());
}

function* setUserSaga({payload = {}}) {
	try {
		yield put(startLoadSetUser());
		const res = yield call(request, {
			method: 'post',
			url: `/user/user-settings`,
			data: {id: payload.id, first_name: payload.first_name, last_name: payload.last_name, langId: payload.langId, themeId: payload.themeId},
			...defaultRequestSettings
		});
		yield put(userInfo(res.data));
	} catch(e) {
		yield put(errorSetUser(e));
	} finally {
		yield put(endLoadSetUser());
	}
}

const FETCH_LOGIN = 'FETCH_LOGIN';
const FETCH_LOGOUT = 'FETCH_LOGOUT';
const FETCH_REGISTRATION = 'FETCH_REGISTRATION';
const FETCH_GET_USER = 'FETCH_GET_USER';
const FETCH_SET_USER = 'FETCH_SET_USER';

export const userUserSagas = createSagas([
	[FETCH_LOGIN, loginSaga],
	[FETCH_LOGOUT, logoutSaga],
	[FETCH_REGISTRATION, registrationSaga],
	[FETCH_GET_USER, getUserSaga],
	[FETCH_SET_USER, setUserSaga]
]);

export const {sagaLogin, sagaLogout, sagaRegistration, sagaSetUser, sagaGetUser} = createActions({
	sagaLogin: FETCH_LOGIN,
	sagaLogout: FETCH_LOGOUT,
	sagaRegistration: FETCH_REGISTRATION,
	sagaGetUser: FETCH_GET_USER,
	sagaSetUser: FETCH_SET_USER
});
