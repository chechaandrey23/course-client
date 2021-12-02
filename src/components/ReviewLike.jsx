import React, { Component, useRef, useLayoutEffect, useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import Filler from './Filler';

import {sagaNewLike} from '../redux/saga/user.likes.js';

export default function ReviewLike(props) {
	const {t} = useTranslation();
	const dispatch = useDispatch();

	const [newLike, setNewLike] = useState(null);
	const like = useSelector((state) => state.userLikes.like);
	const loadNewLike = useSelector((state) => state.userLikes.loadNewLike);

	const currentEvent = useRef(false);

	useLayoutEffect(() => {//console.log(like, firstUpdate.current, currentEvent.current)
		if(!firstUpdate.current && currentEvent.current) {
			setNewLike(like.like);
			currentEvent.current = false;
		}
	}, [like]);

	const firstUpdate = useRef(true);
	useLayoutEffect(() => {
		if(firstUpdate.current) firstUpdate.current = false;
	});

	const isDisabled = props.data.length > 0 || newLike !== null;

	return (
		<>
			{loadNewLike && currentEvent.current?<Filler size='1.5rem' />:null}
			<Button variant="danger" disabled={isDisabled} size="sm" onClick={() => {
				currentEvent.current = true;
				dispatch(sagaNewLike({reviewId: props.reviewId}));
			}}>Like</Button>
		</>
	)
}
