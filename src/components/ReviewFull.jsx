import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useCookies} from 'react-cookie';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import {setReviewId} from '../redux/user.comments.js';

import {sagaGetReview} from '../redux/saga/user.reviews.js';

import ReviewRating from './ReviewRating';
import ReviewLike from './ReviewLike';

export default function ReviewFull(props) {
	const [cookies,, removeCookie] = useCookies();
	const {t} = useTranslation();
	const review = useSelector((state) => state.userReviews.dataItem);
	const reviewLoading = useSelector((state) => state.userReviews.dataItemLoading);

	const dispatch = useDispatch();
	let params = useParams();
	let [firstRender, setFirstRender] = useState(true);

	useEffect(() => {
		dispatch(sagaGetReview({id: params.id, isUser: isUser(cookies.Roles)}));
		setFirstRender(false);
	}, []);

	useEffect(() => {
		if(review) dispatch(setReviewId(review.id));
	}, [review]);

	let content, contentComments;

	if(reviewLoading || firstRender) {
		content = <h2>loading...</h2>
	} else {
		content = <Container className="border border-primary rounded bg-light mt-1 mb-1">
			<Row className="mt-2">
				<Col className="text-center"><div>
					{isUser(cookies.Roles)?<ReviewRating data={review.ratings || []} reviewId={review.id} />:null}
				</div></Col><Col sm="auto"><div>
					{isUser(cookies.Roles)?<ReviewLike data={review.likes || []} reviewId={review.id} />:null}
				</div></Col>
			</Row>
			<Row>
				<Col className="text-center">
					<span className="h2">{review.groupTitle?.group?.group || 'Unknown'}</span>
					<span className="h2"> / </span>
					<span className="h2">{review.groupTitle?.title?.title || 'Unknown'}</span>
				</Col>
			</Row>
			<Row className="border-bottom border-top border-primary pt-1 pb-1 mt-3 mb-3">
				<Col><ReactMarkdown>{review.groupTitle?.title?.description || 'UNKNOWN'}</ReactMarkdown></Col>
			</Row>
			<Row className="float-start border border-primary rounded row-cols-1 text-center" style={{marginRight: '5px'}}>
				<Col><span className="h1 text-info">{review.authorRating || 0}</span></Col>
				<Col>
					{review.user?<Link to={'/reviews'+'?'+queryString.stringify({authors: [review.userId]}, {arrayFormat: 'bracket'})}>
						<span>{review.user?.userInfo?.first_name || 'Unknown'} {review.user?.userInfo?.last_name || 'Unknown'}</span>
					</Link>:<>
						<span className="text-secondary">{review.user?.userInfo?.first_name || 'Unknown'} {review.user?.userInfo?.last_name || 'Unknown'}</span>
					</>}
				</Col>
			</Row>
			<Row>
				<Col><ReactMarkdown>{review.text}</ReactMarkdown></Col>
			</Row>
			<Row className="justify-content-center">
				<Col>
					<Row className="float-start border border-primary rounded row-cols-1 text-center text-success">
						<Col><h1>{review.averageEditorRating || 0}</h1></Col>
						<Col><strong>Average Editors rating</strong></Col>
					</Row>
				</Col>
				<Col>
					<Row className="float-start border border-primary rounded row-cols-1 text-center text-danger">
						<Col><h1>{review.averageUserRating || 0}</h1></Col>
						<Col><strong>Average Users rating</strong></Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col>{(review.tags || []).map((entry, index) => {
					return <span key={index} className="m-2"><Link to={'/reviews'+'?'+queryString.stringify({tags: [entry.id]}, {arrayFormat: 'bracket'})}>{entry.tag}</Link></span>
				})}</Col>
			</Row>
			<Row className="text-end">
				<Col><span className="text-secondary">{t('intlDateTime', {val: new Date(props.date)})}</span></Col>
			</Row>
		</Container>
	}

	return (<>{content}</>)
}
