import React, {useLayoutEffect} from "react";
import {Routes, Route, Link} from "react-router-dom";
import {useCookies} from 'react-cookie';
import i18n from 'i18next';
import {changeTheme} from './themes';

import PageLogin from './pages/PageLogin';
import PageRegistration from './pages/PageRegistration';
import PageUser from './pages/PageUser';
import PageReviews from './pages/PageReviews';
import PageReview from './pages/PageReview';
import PageMyReviews from './pages/PageMyReviews';
import PageMyReviewEdit from './pages/PageMyReviewEdit';
import PageSearchReviews from './pages/PageSearchReviews';
import PageMyReviewNew from './pages/PageMyReviewNew';
import PageMyReviewView from './pages/PageMyReviewView';

export default function App() {
	const [cookies] = useCookies();

	useLayoutEffect(() => {
		i18n.changeLanguage(cookies['Lang']);
		changeTheme(cookies['Theme']);
	}, [cookies]);

	return (
		<div>
			<Routes>
				<Route path="user" element={<PageUser />} />
				<Route path="registration" element={<PageRegistration />} />
				<Route path="login" element={<PageLogin />} />

				<Route path="search/:query" element={<PageSearchReviews />} />

				<Route path="reviews" element={<PageReviews />} />

				<Route path="review/:id" element={<PageReview />} />

				<Route path="my-reviews" element={<PageMyReviews />} />
				<Route path="my-review-view/:id" element={<PageMyReviewView />} />
				<Route path="my-review-new" element={<PageMyReviewNew />} />
				<Route path="my-review-edit/:id" element={<PageMyReviewEdit />} />
				<Route path="/" element={<PageReviews />} />
			</Routes>
		</div>
	);
}
