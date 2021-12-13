import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import {Container, Row, Col, Button, Form, Alert, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import {sagaGetReview} from '../redux/saga/editor.reviews.js';

import Filler from './Filler';
import MyReviewFullForm from './MyReviewFullForm';

export default function MyReviewFullNew(props) {
	const dispatch = useDispatch();
	const params = useParams();

	const review = useSelector((state) => state.editorReviews.dataItem);
	const reviewLoading = useSelector((state) => state.editorReviews.dataItemLoading);

	const firstRender = useRef(true);
	useEffect(() => {
		dispatch(sagaGetReview(params.id));
		firstRender.current = false;
	}, []);

	return (reviewLoading || firstRender.current)?<Container className="border border-primary rounded bg-light mt-1 mb-1" style={{minHeight: '300px'}}>
		<Filler ignorePadding={true} size="6rem" />
	</Container>:<MyReviewFullForm 	id={review?.id}
									groupId={review?.groupTitle?.group?.id}
									group={review?.groupTitle?.group}
									titleId={review?.groupTitle?.title?.id}
									title={review?.groupTitle?.title}
									description={review?.description}
									text={review?.text}
									tags={review?.tags || []}
									authorRating={review?.authorRating}
									draft={review?.draft}
									blocked={review?.blocked} />
}
