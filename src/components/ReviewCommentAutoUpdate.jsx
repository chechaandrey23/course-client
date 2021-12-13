import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {Container, Row, Col, Button, Modal, Form, Alert} from 'react-bootstrap';
import {useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";

import {sagaAutoUpdateComments} from '../redux/saga/user.comments.js';

export default function ReviewCommentAutoUpdate(props) {
	const timeout = props.timeout * 1;
	const dispatch = useDispatch();
	const [timeOut, setTimeOut] = useState(0);

	const commentsAutoUpdateLoading = useSelector((state) => state.userComments.commentsAutoUpdateLoading);
	const comments = useSelector((state) => state.userComments.comments);

	const requestTime = useRef(0);
	const descInterval = useRef(null);
	const currentTimeout = useRef(0);
	useLayoutEffect(() => {
		clearInterval(descInterval.current);
		requestTime.current = Date.now();
		currentTimeout.current = 0;
		setTimeOut(currentTimeout.current);
		descInterval.current = setInterval(() => {
			currentTimeout.current++;
			if(currentTimeout.current >= props.timeout) {
				dispatch(sagaAutoUpdateComments({time: requestTime.current, reviewId: props.reviewId}));
				clearInterval(descInterval.current);
				currentTimeout.current = 0;
				setTimeOut(currentTimeout.current);
			} else {
				setTimeOut(currentTimeout.current);
			}
		}, 1000);
	}, [comments]);

	useLayoutEffect(() => () => {clearInterval(descInterval.current);}, []);

	return (<div>
		{!commentsAutoUpdateLoading?<>
			<span className="h6 text-success">update through </span><span className="h6 text-success">{Math.round(props.timeout-timeOut)}</span>
		</>:<>
			<span className="h6 text-warning">autoupdate...</span>
		</>}
	</div>);
}
