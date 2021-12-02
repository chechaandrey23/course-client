import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Modal, Form} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {setReviewId} from '../redux/user.comments.js';
import {sagaGetComments, sagaMoreComments, sagaAutoUpdateComments, sagaNewComment} from '../redux/saga/user.comments.js';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import ReviewCommentItem from './ReviewCommentItem';
import Filler from './Filler';

const validationSchemaModal = Yup.object().shape({
	title: Yup.string().required('Title is required').min(3, 'Title must be maximum 3 characters'),
	description: Yup.string().max(3000, 'Description must be maximum 3000 characters')
});

export default function ReviewComments(props) {
	const {t} = useTranslation();
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);

	const reviewId = useSelector((state) => state.userComments.reviewId);

	const comments = useSelector((state) => state.userComments.comments);
	const commentsLoading = useSelector((state) => state.userComments.commentsLoading);

	const handleClose = useCallback(() => {setShow(false);}, []);
	const handleShow = useCallback(() => setShow(true), []);

	const {	register: registerModal,
			handleSubmit: handleSubmitModal,
			setValue: setValueModal,
			formState: {errors: errorsModal}} = useForm({resolver: yupResolver(validationSchemaModal)});

	const firstUpdate = useRef(true);
	useEffect(() => {
		if(firstUpdate.current) firstUpdate.current = false;
		if(reviewId) dispatch(sagaGetComments({reviewId}));
	}, [reviewId]);

	useEffect(() => () => {dispatch(setReviewId(null))}, []);

	return <>
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			{commentsLoading?<Filler ignorePadding={true} size='4.5rem' />:null}
			<Row><Col><span className="h4">Comments:</span></Col></Row>
			{comments.length<=0?(<Row><Col><span className="h4">Comments Not Found</span></Col></Row>):(<Row><Col>
				{comments.map((entry, index) => {
					return <ReviewCommentItem key={index} />
				})}
			</Col></Row>)}
			<Row className="mb-3 justify-content-end"><Col sm='auto'>
				<Button variant="outline-primary" onClick={handleShow}>Create Comment</Button>
			</Col></Row>
		</Container>
		<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Modal Create New Comment</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form id="hook-modal-form" onSubmit={handleSubmitModal((data) => {
					console.log(data);
					//dispatch(sagaNewTitle(data));
					//setShow(false);
				})}>
					<Form.Group as={Row} className="mb-3" controlId="formBasicComment">
						<Form.Label column sm="2">comment</Form.Label>
						<Col sm="10">
							<Form.Control as="textarea" {...registerModal("comment")} rows={5} placeholder="Enter comment" isInvalid={!!errorsModal.comment} />
							<Form.Control.Feedback type="invalid">
								{errorsModal.comment?.message}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="outline-secondary" onClick={handleClose}>Close</Button>
				<Button variant="outline-success" type="submit" form="hook-modal-form">Create Comment</Button>
			</Modal.Footer>
		</Modal>
	</>;
}
