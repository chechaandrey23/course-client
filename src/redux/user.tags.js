import {createSlice} from '@reduxjs/toolkit'

export const storeUserTags = createSlice({
	name: 'userTags',
	initialState: {
		data: []
	},
	reducers: {
		getAllTags(state, action) {
			state.data = [...action.payload];
		}
	}
});

export const {getAllTags} = storeUserTags.actions;

export default storeUserTags.reducer;
