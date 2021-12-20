import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Modal, Form, Alert, ListGroup} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import {sagaOtherReviews} from '../redux/saga/user.reviews.js';

import Filler from './Filler';

export default function OtherAuthorReviews(props) {
	const {t} = useTranslation('components/OtherAuthorReviews');
	const dispatch = useDispatch();

	const review = useSelector((state) => state.userReviews.currentReview);

	const otherData = useSelector((state) => state.userReviews.otherData);
	const otherDataLoading = useSelector((state) => state.userReviews.otherDataLoading);

	const firstUpdate = useRef(true);
	useEffect(() => {
		if(review) {
			dispatch(sagaOtherReviews({id: review.titleGroupId}));
			if(firstUpdate.current) firstUpdate.current = false;
		}
	}, [review]);

	return (review?<div style={{width: '302px'}} className="border border-primary rounded mb-1">
			{(otherDataLoading)?<Filler ignorePadding={true} size='3rem' />:null}
			<Row className="justify-content-center mb-2 mt-2">
				<Col sm="auto">
					<span className="h6">{t('Other')} (<span className="h6">{review?.groupTitle?.group?.group || t('Unknown')}</span>
					<span className="h6"> / </span>
					<span className="h6">{review?.groupTitle?.title?.title || t('Unknown')}</span>) {t('Reviews')}</span>
				</Col>
			</Row>
			<Row><Col>
				<ListGroup>{otherData.map((entry, index) => {
					return <ListGroup.Item style={{border: '0px', borderTopLeftRadius: '0px', borderTopRightRadius: '0px'}} key={index} active={review.id == entry.id}>
						{review.id != entry.id?<Link to={'/review/'+entry.id}>
							<span>{entry.groupTitle?.group?.group || t('Unknown')} / {entry.groupTitle?.title?.title || t('Unknown')}({entry.user?.userInfo?.first_name} {entry.user?.userInfo?.last_name})</span>
						</Link>:<>
							<span>{entry.groupTitle?.group?.group || t('Unknown')} / {entry.groupTitle?.title?.title || t('Unknown')}({entry.user?.userInfo?.first_name} {entry.user?.userInfo?.last_name})</span>
						</>}
					</ListGroup.Item>
				})}</ListGroup>
			</Col></Row>
		</div>:<div style={{width: '302px'}} className="border border-primary rounded mt-1 mb-1 pt-3 pb-3">
			<Row className="justify-content-center">
				<Col sm="auto"><span className="h5">{t('Other Reviews NOT FOUND!!!')}</span></Col>
			</Row>
		</div>);
}
