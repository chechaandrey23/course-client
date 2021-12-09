import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams, useSearchParams} from "react-router-dom";
import {Container, Row, Col} from 'react-bootstrap';
import {useCookies} from 'react-cookie';

import ReviewItem from './ReviewItem';
import PopoverFilterReviews from './PopoverFilterReviews';

import {sagaGetSearchReviews} from '../redux/saga/user.search.reviews.js';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

export default function ReviewLists() {
	const [cookies,, removeCookie] = useCookies();
	const reviews = useSelector((state) => state.userReviews.data);
	const dispatch = useDispatch();

	const [searchParams] = useSearchParams();
	const params = useParams();

	useEffect(() => {
		dispatch(sagaGetSearchReviews({params: searchParams, query: params.query, isUser: isUser(cookies.Roles)}));
	}, [params, searchParams]);

	return (
		<div>
			<Row><Col>{reviews.map((entry) => {
				return <ReviewItem  key={entry.id}
									id={entry.id}
									title={entry.groupTitle?.title?.title}
									group={entry.groupTitle?.group?.group}
									ratings={entry.ratings || []}
									likes={entry.likes || []}
									description={entry.description}
									date={entry.createdAt}
									authorRating={entry.authorRating}
									author={[entry.user?.userInfo?.first_name || 'Unknown', entry.user?.userInfo?.last_name || 'Unknown']}/>
			})}</Col></Row>
		</div>
	)
}
