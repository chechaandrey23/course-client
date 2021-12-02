import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from "redux-saga";

import userReviewsReduser from './user.reviews.js';
import userTagsReduser from './user.tags.js';
import userUserReduser from './user.user.js';
import userLikesReduser from './user.likes.js';
import userLangsReduser from './user.langs.js';
import userThemesReduser from './user.themes.js';
import editorReviewsReduser from './editor.reviews.js';
import editorGroupsReduser from './editor.groups.js';
import editorTitlesReduser from './editor.titles.js';
import editorTagsReduser from './editor.tags.js';
import editorImagesReduser from './editor.images.js';
import guestEditorsReduser from './guest.editors.js';
import customFilterReduser from './custom.filter.js';
import userRatingsReduser from './user.ratings.js';
import userCommentsReduser from './user.comments.js';

import saga from "./saga/saga.js";

let sagaMiddleware = createSagaMiddleware();

const store = configureStore({
	reducer: {
		userReviews: userReviewsReduser,
		userTags: userTagsReduser,
		userUser: userUserReduser,
		userLikes: userLikesReduser,
		userLangs: userLangsReduser,
		userThemes: userThemesReduser,
		editorReviews: editorReviewsReduser,
		editorGroups: editorGroupsReduser,
		editorTitles: editorTitlesReduser,
		editorTags: editorTagsReduser,
		editorImages: editorImagesReduser,
		guestEditors: guestEditorsReduser,
		customFilter: customFilterReduser,
		userRatings: userRatingsReduser,
		userComments: userCommentsReduser
	},
	middleware: [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), sagaMiddleware]
});

sagaMiddleware.run(saga);

export default store;
