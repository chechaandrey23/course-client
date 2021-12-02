import {createSlice} from '@reduxjs/toolkit'

export const storeEditorImages = createSlice({
	name: 'editorImages',
	initialState: {
		modalImages: false,
		urlImageToInsert: false,
		images: [],
		loadImages: false,
		loadMoreImages: false,
		loadNewImage: false,
		errorNewImage: false,
		newImage: false,
		progressLoadNewImage: 0,
		selectedImageInsert: null,
		selectedImageUpload: null
	},
	reducers: {
		showModalImage(state, action) {
			state.modalImages = true;
		},
		hideModalImage(state, action) {
			state.modalImages = false;
		},
		setURLImageToInsert(state, action) {
			state.urlImageToInsert = action.payload;
		},
		getImages(state, action) {
			state.images = [...action.payload];
		},
		startLoadImages(state, action) {
			state.loadImages = true;
		},
		endLoadImages(state, action) {
			state.loadImages = false;
		},
		moreImages(state, action) {
			state.images = [...state.images, ...action.payload];
		},
		startLoadMoreImages(state, action) {
			state.loadMoreImages = true;
		},
		endLoadMoreImages(state, action) {
			state.loadMoreImages = false;
		},
		startLoadNewImage(state, action) {
			state.loadNewImage = true;
		},
		endLoadNewImage(state, action) {
			state.loadNewImage = false;
		},
		progressLoadNewImageAC(state, action) {
			state.progressLoadNewImage = action.payload;
		},
		errorNewImageAC(state, action) {
			state.errorNewImage = action.payload;
		},
		newImageAC(state, action) {
			state.images = [...action.payload, ...state.images];
			state.newImage = action.payload;
		},
		selectedImageInsertAC(state, action) {
			state.selectedImageInsert = action.payload;
		},
		selectedImageUploadAC(state, action) {
			state.selectedImageUpload = action.payload;
		}
	}
});

export const {	showModalImage, hideModalImage, setURLImageToInsert,
				getImages, startLoadImages, endLoadImages,
				moreImages, startLoadMoreImages, endLoadMoreImages,
				selectedImageInsertAC, selectedImageUploadAC,
				startLoadNewImage, endLoadNewImage, errorNewImageAC, newImageAC, progressLoadNewImageAC} = storeEditorImages.actions;

export default storeEditorImages.reducer;
