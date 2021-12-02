import React from "react";
import {Routes, Route, Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import PageLogin from './pages/PageLogin';
import PageRegistration from './pages/PageRegistration';
import PageUser from './pages/PageUser';
import PageReviews from './pages/PageReviews';
import PageReview from './pages/PageReview';
import PageMyReviews from './pages/PageMyReviews';
import PageMyReviewEdit from './pages/PageMyReviewEdit';

export default function App() {
	return (
		<div>
			<Routes>
				<Route path="user" element={<PageUser />} />
				<Route path="registration" element={<PageRegistration />} />
				<Route path="login" element={<PageLogin />} />
				
				<Route path="reviews/order-:order/tag-:tag" element={<PageReviews />} />
				<Route path="reviews/order-:order" element={<PageReviews />} />
				<Route path="reviews/tag-:tag" element={<PageReviews />} />
				<Route path="reviews" element={<PageReviews />} />
				
				<Route path="review/:id" element={<PageReview />} />
				
				<Route path="my-reviews" element={<PageMyReviews />} />
				<Route path="my-review-edit/:id" element={<PageMyReviewEdit />} />
				<Route path="/" element={<PageReviews />} />
			</Routes>
		</div>
	);
}
