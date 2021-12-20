import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Alert} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useCookies} from 'react-cookie';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

//import {setReviewId} from '../redux/user.comments.js';
import {getReviewItem, setCurrentReview} from '../redux/user.reviews.js';

import {sagaGetReview} from '../redux/saga/user.reviews.js';
import {sagaGetReview as sagaGetReviewEditor} from '../redux/saga/editor.reviews.js';

import ReviewRating from './ReviewRating';
import ReviewLike from './ReviewLike';
import Filler from './Filler';

export default function ReviewFull(props) {
	const [cookies,, removeCookie] = useCookies();
	const {t} = useTranslation('components/ReviewFull');
	const userReview = useSelector((state) => state.userReviews.dataItem);
	const userReviewLoading = useSelector((state) => state.userReviews.dataItemLoading);
	const editorReview = useSelector((state) => state.editorReviews.dataItem);
	const editorReviewLoading = useSelector((state) => state.editorReviews.dataItemLoading);

	const review = props.mode==='editor'?editorReview:userReview;
	const reviewLoading = props.mode==='editor'?editorReviewLoading:userReviewLoading;

	const dispatch = useDispatch();
	let params = useParams();
	//let [firstRender, setFirstRender] = useState(true);

	const firstRender = useRef(true);
	useLayoutEffect(() => {
		if(props.mode==='editor') {
			dispatch(sagaGetReviewEditor(params.id));
		} else {
			dispatch(sagaGetReview({id: params.id, isUser: isUser(cookies.Roles)}));
		}
		firstRender.current = false;
		//setFirstRender(false);
	}, [params]);

	useEffect(() => {
		if(review && review.id) {
			dispatch(setCurrentReview(review));
		}
	}, [userReview, editorReview]);

	useLayoutEffect(() => () => {
		dispatch(getReviewItem(null));
		dispatch(setCurrentReview(null));
	}, [params]);

	//useLayoutEffect(() => () => {}, []);

	return (<>
		{(reviewLoading || firstRender.current)?<Container className="border border-primary rounded mt-1 mb-1">
			<Filler ignorePadding={true} className="rounded" size='6rem' />
			<Row><Col style={{minHeight: '200px'}}></Col></Row>
		</Container>:(review?<Container className="border border-primary rounded mt-1 mb-1">
			{review.blocked?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="danger">
						<h4>{t('This review has been banned and cannot be published!')}</h4>
						<h4>{t('Please contact the Moderator for details!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
			{review.draft?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="warning">
						<h4>{t('This review is marked as a draft and has not been published!')}</h4>
						<h4>{t('You can change this by specifying the appropriate options!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
			<Row className="mt-2">
				<Col className="text-center"><div>
					{isUser(cookies.Roles)?<ReviewRating data={review.ratings || []} reviewId={review.id} />:null}
				</div></Col><Col sm="auto"><div>
					{isUser(cookies.Roles)?<ReviewLike data={review.likes || []} reviewId={review.id} />:null}
				</div></Col>
			</Row>
			<Row>
				<Col className="text-center">
					<span className="h2">{review.groupTitle?.group?.group || t('Unknown')}</span>
					<span className="h2"> / </span>
					<span className="h2">{review.groupTitle?.title?.title || t('Unknown')}</span>
				</Col>
			</Row>
			<Row className="border-bottom border-top border-primary pt-1 pb-1 mt-3 mb-3">
				<Col><ReactMarkdown>{review.groupTitle?.title?.description || t('Unknown')}</ReactMarkdown></Col>
			</Row>
			<Row className="float-start border border-primary rounded row-cols-1 text-center" style={{marginRight: '5px'}}>
				<Col><span className="h1 text-info">{review.authorRating || 0}</span></Col>
				<Col>
					{review.user?<Link to={'/reviews'+'?'+queryString.stringify({authors: [review.userId]}, {arrayFormat: 'bracket'})}>
						<span>{review.user?.userInfo?.first_name || t('Unknown')} {review.user?.userInfo?.last_name || t('Unknown')}</span>
					</Link>:<>
						<span className="text-secondary">{review.user?.userInfo?.first_name || t('Unknown')} {review.user?.userInfo?.last_name || t('Unknown')}</span>
					</>}
				</Col>
			</Row>
			<Row>
				<Col><ReactMarkdown>{review.text}</ReactMarkdown></Col>
			</Row>
			<Row>
				<Col>
					<Row className="justify-content-center">
						<Col sm="auto">
							<Row className="float-start border border-primary rounded row-cols-1 text-center text-success">
								<Col><h1>{review.averageEditorRating || 0}</h1></Col>
								<Col><strong>{t('Average Editors rating')}</strong></Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row className="justify-content-center">
						<Col sm="auto">
							<Row className="float-start border border-primary rounded row-cols-1 text-center text-danger">
								<Col><h1>{review.averageUserRating || 0}</h1></Col>
								<Col><strong>{t('Average Users rating')}</strong></Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row>
				<Col>{(review.tags || []).map((entry, index) => {
					return <span key={index} className="m-2"><Link to={'/reviews'+'?'+queryString.stringify({tags: [entry.id]}, {arrayFormat: 'bracket'})}>{entry.tag}</Link></span>
				})}</Col>
			</Row>
			<Row className="text-end">
				<Col><span className="text-secondary">{t('intlDateTime', {val: new Date(review.createdAt)})}</span></Col>
			</Row>
			{review.draft?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="warning">
						<h4>{t('This review is marked as a draft and has not been published!')}</h4>
						<h4>{t('You can change this by specifying the appropriate options!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
			{review.blocked?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="danger">
						<h4>{t('This review has been banned and cannot be published!')}</h4>
						<h4>{t('Please contact the Moderator for details!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
		</Container>:<Container className="border border-primary rounded mt-1 mb-1">
			<Row className="mt-3 mb-3">
				<Col className="text-center">
					<span className="h3">{t('Review')} "{params.id}" {t('NOT FOUND!!!')}</span>
				</Col>
			</Row>
		</Container>)}
	</>);
}
