import {createSlice} from '@reduxjs/toolkit'

export const storeEditorTags = createSlice({
	name: 'editorTags',
	initialState: {
		tags: [],
		loadTags: false,
		loadNewTag: false,
		errorNewTag: false,
		newTag: false
	},
	reducers: {
		getTags(state, action) {
			state.tags = [...action.payload];
		},
		startLoadTags(state, action) {
			state.loadTags = true;
		},
		endLoadTags(state, action) {
			state.loadTags = false;
		},
		startLoadNewTag(state, action) {
			state.loadNewTag = true;
		},
		endLoadNewTag(state, action) {
			state.loadNewTag = false;
		},
		errorNewTag(state, action) {
			state.errorNewTag = action.payload;
		},
		newTag(state, action) {
			state.tags = [action.payload, ...state.tags];
			state.newTag = action.payload;
		}
	}
});

export const {	getTags, startLoadTags, endLoadTags,
				startLoadNewTag, endLoadNewTag, errorNewTag, newTag} = storeEditorTags.actions;

export default storeEditorTags.reducer;
