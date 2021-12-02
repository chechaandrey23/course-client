import React, { Component, useRef, useLayoutEffect, useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import Rating from 'react-rating';

import Filler from './Filler';

import {sagaNewRating} from '../redux/saga/user.ratings.js';

export default function ReviewRating(props) {
	const {t} = useTranslation();
	const dispatch = useDispatch();

	const [newRating, setNewRating] = useState(null);
	const rating = useSelector((state) => state.userRatings.rating);
	const loadNewRating = useSelector((state) => state.userRatings.loadNewRating);

	const currentEvent = useRef(false);

	useLayoutEffect(() => {
		if(!firstUpdate.current && currentEvent.current) {
			setNewRating(rating);
			currentEvent.current = false;
		}
	}, [rating]);

	const firstUpdate = useRef(true);
	useLayoutEffect(() => {
		if(firstUpdate.current) firstUpdate.current = false;
	});

	const defValue = props.data.length > 0?props.data[0].userRating:(newRating !== null?newRating:0);
	const isDisabled = props.data.length > 0 || newRating !== null;

	return (
		<>
			{loadNewRating && currentEvent.current?<Filler size='1.5rem' />:null}
			<Rating readonly={isDisabled} initialRating={defValue} onChange={(value) => {
				currentEvent.current = true;
				dispatch(sagaNewRating({rating: value, reviewId: props.reviewId}));
			}} />
		</>
	)
}
