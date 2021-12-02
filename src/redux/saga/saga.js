import { call, takeEvery, put, all, spawn, take, cancel } from 'redux-saga/effects';

import {userReviewsSagas} from './user.reviews.js';
import {userTagsSagas} from './user.tags.js';
import {userUserSagas} from './user.user.js';
import {userLangsSagas} from './user.langs.js';
import {userThemesSagas} from './user.themes.js';
import {editorReviewsSagas} from './editor.reviews.js';
import {editorGroupsSagas} from './editor.groups.js';
import {editorTitlesSagas} from './editor.titles.js';
import {editorTagsSagas} from './editor.tags.js';
import {editorImagesSagas} from './editor.images.js';
import {guestEditorsSagas} from './guest.editors.js';
import {userRatingsSagas} from './user.ratings.js';
import {userLikesSagas} from './user.likes.js';
import {userCommentsSagas} from './user.comments.js';

// takeLatest
// takeLatest
export default function* rootSaga() {
	//yield fork(socketFetchSaga);
	const sagas = [
		...userReviewsSagas,
		...userTagsSagas,
		...userUserSagas,
		...userLangsSagas,
		...userThemesSagas,
		...editorReviewsSagas,
		...editorGroupsSagas,
		...editorTitlesSagas,
		...editorTagsSagas,
		...editorImagesSagas,
		...guestEditorsSagas,
		...userRatingsSagas,
		...userLikesSagas,
		...userCommentsSagas
	];

	yield all(sagas.map((o) => {
		return spawn(function *() {
			while(true) {
				try {
					if(o.pattern) {
						let lastTask
						while(true) {
							const action = yield take(o.pattern);
							// cancel is no-op if the task has already terminated
							if(lastTask) yield cancel(lastTask);
							//lastTask = yield fork(saga, ...args.concat(action));
							lastTask = yield call(o.saga, action);
						}
					} else {
						yield call(o);
					}
					break;
				} catch(e) {
					// error
					//console.error(e);
					throw e;
				}
			}
		});
	}));
}
