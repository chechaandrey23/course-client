import {createSlice} from '@reduxjs/toolkit'

export const storeUserUser = createSlice({
	name: 'userUser',
	initialState: {
		login: false,
		loadLogin: false,
		errorLogin: false,
		logout: false,
		loadLogout: false,
		errorLogout: false,
		registration: false,
		loadRegistration: false,
		errorRegistration: false,
		user: {},
		loadGetUser: false,
		loadSetUser: false,
		errorSetUser: false,
	},
	reducers: {
		login(state, action) {
			state.login = action.payload;
		},
		startLoadLogin(state, action) {
			state.loadLogin = true;
		},
		endLoadLogin(state, action) {
			state.loadLogin = false;
		},
		errorLogin(state, action) {
			state.errorLogin = action.payload;
		},
		logout(state, action) {
			state.logout = action.payload;
		},
		startLoadLogout(state, action) {
			state.loadLogout = true;
		},
		endLoadLogout(state, action) {
			state.loadLogout = false;
		},
		errorLogout(state, action) {
			state.errorLogout = action.payload;
		},
		registration(state, action) {
			state.registration = action.payload;
		},
		startLoadRegistration(state, action) {
			state.loadRegistration = true;
		},
		endLoadRegistration(state, action) {
			state.loadRegistration = false;
		},
		errorRegistration(state, action) {
			state.errorRegistration = action.payload;
		},
		user(state, action) {
			state.user = {...action.payload};
		},
		userInfo(state, action) {
			const newUser = {...state.user}
			newUser.userInfo = action.payload;
			state.user = newUser;
		},
		startLoadGetUser(state, action) {
			state.loadGetUser = true;
		},
		endLoadGetUser(state, action) {
			state.loadGetUser = false;
		},
		startLoadSetUser(state, action) {
			state.loadSetUser = true;
		},
		endLoadSetUser(state, action) {
			state.loadSetUser = false;
		},
		errorSetUser(state, action) {
			state.errorSetUser = action.payload;
		}
	}
});

export const {	login, startLoadLogin, endLoadLogin, errorLogin, 
				logout, startLoadLogout, endLoadLogout, errorLogout, 
				registration, startLoadRegistration, endLoadRegistration, errorRegistration, 
				userInfo, user, startLoadGetUser, endLoadGetUser, startLoadSetUser, endLoadSetUser, errorSetUser} = storeUserUser.actions;

export default storeUserUser.reducer;
