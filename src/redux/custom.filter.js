import {createSlice} from '@reduxjs/toolkit'

export const storeCustomFilter = createSlice({
	name: 'customFilter',
	initialState: {
		filter: {},
		editorFilter: {}
	},
	reducers: {
		setFilterData(state, action) {
			state.filter = action.payload;
		},
		setEditorFilterData(state, action) {
			state.editorFilter = action.payload;
		}
	}
});

export const {setFilterData, setEditorFilterData} = storeCustomFilter.actions;

export default storeCustomFilter.reducer;
