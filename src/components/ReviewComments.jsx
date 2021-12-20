import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Modal, Form, Alert} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import InfiniteScroll from 'react-infinite-scroll-component';

import {errorNewComment} from '../redux/user.comments.js';
import {sagaGetComments, sagaMoreComments, sagaAutoUpdateComments, sagaNewComment} from '../redux/saga/user.comments.js';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import ReviewCommentItem from './ReviewCommentItem';
import ReviewCommentAutoUpdate from './ReviewCommentAutoUpdate';
import Filler from './Filler';

const validationSchemaModal = Yup.object().shape({
	comment: Yup.string().required('Comment is required').min(10, 'Commeent must be at least 10 characters').max(3000, 'Comment must be maximum 3000 characters')
});

export default function ReviewComments(props) {
	const {t} = useTranslation('components/ReviewComments');
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);

	//const reviewId = useSelector((state) => state.userComments.reviewId);
	const review = useSelector((state) => state.userReviews.currentReview);

	const comments = useSelector((state) => state.userComments.comments);
	const commentsLoading = useSelector((state) => state.userComments.commentsLoading);
	const commentsMoreLoading = useSelector((state) => state.userComments.commentsMoreLoading);
	const commentPaginator = useSelector((state) => state.userComments.paginator);

	const newCommentLoading = useSelector((state) => state.userComments.newCommentLoading);
	const newCommentError = useSelector((state) => state.userComments.newCommentError);
	const newComment = useSelector((state) => state.userComments.newComment);

	const handleClose = useCallback(() => {
		dispatch(errorNewComment(false));
		setShow(false);
	}, []);
	const handleShow = useCallback(() => {
		resetModal();
		setShow(true);
	}, []);

	const {	register: registerModal,
			handleSubmit: handleSubmitModal,
			setValue: setValueModal,
			reset: resetModal,
			formState: {errors: errorsModal}} = useForm({resolver: yupResolver(validationSchemaModal)});

	const firstUpdate = useRef(true);
	useLayoutEffect(() => {
		if(review) {
			dispatch(sagaGetComments({reviewId: review.id}));
			if(firstUpdate.current) firstUpdate.current = false;
		}
	}, [review]);

	const moreFn = useCallback(() => {
		dispatch(sagaMoreComments({page: commentPaginator.getPageForQuery(), reviewId: review.id}));
	}, [review]);

	useEffect(() => {
		if(newComment && show) handleClose();
	}, [newComment]);

	return (review?<>
		<Container className="border border-primary rounded mt-1 mb-1">
			{(commentsLoading)?<Filler ignorePadding={true} size='4.5rem' />:null}
			<Row className="mb-3 mt-3"><Col><span className="h4">{t('Comments')}:</span></Col></Row>
			{(!commentsLoading && !firstUpdate.current)?<Row className="justify-content-end">
				<Col sm="auto">
					<ReviewCommentAutoUpdate timeout={10} reviewId={review.id} />
				</Col>
			</Row>:null}
			{comments.length<=0?(<Row className="justify-content-center"><Col sm="auto"><span className="h4">{t('Not Found')}</span></Col></Row>):(<Row><Col>
				<InfiniteScroll dataLength={comments.length}
								next={moreFn}
								scrollThreshold={0.99}
								style={{overflow: 'inherit'}}
								loader={<Row className="border border-primary rounded mt-1 mb-1 pt-2 pb-2">
									<Col>
										{commentsMoreLoading?<Filler size="2rem" />:null}
										<Button variant="outline-info" style={{width: '100%'}} onClick={moreFn}>{t('more')}</Button>
									</Col>
								</Row>}
								endMessage={<Row className="border border-primary rounded mt-1 mb-1 pt-2 pb-2">
									<Col>
										{commentsMoreLoading?<Filler size="2rem" />:null}
										<Button variant="outline-info" style={{width: '100%'}} onClick={moreFn}>{t('more')}</Button>
									</Col>
								</Row>}
								hasMore={(() => {
									const length = commentPaginator.getCountRowsWithoutAppends();
									if(comments.length < length) {
										return false;
									} else {
										return !(comments.length % length)
									}
								})()}>
					{comments.map((entry, index) => {
						return <ReviewCommentItem   key={index}
													id={entry.id}
													comment={entry.comment}
													reviewId={review.id}
													date={entry.updatedAt}
													authorId={entry.userId}
													author={[entry.user?.userInfo?.first_name || t('Unknown'), entry.user?.userInfo?.last_name || t('Unknown')]} />
					})}
				</InfiniteScroll>

			</Col></Row>)}
			<Row className="mb-3 mt-3 justify-content-end"><Col sm='auto'>
				<Button variant="outline-primary" disabled={newCommentLoading} onClick={handleShow}>{t('Create Comment')}</Button>
			</Col></Row>
		</Container>
		<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>{t('Modal Create New Comment')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{newCommentLoading?<Filler ignorePadding={true} size='6rem' />:null}
				<div>
					{newCommentError?<Alert variant="danger" onClose={() => {dispatch(errorNewComment(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{newCommentError.data.reason || newCommentError.data.message}</p>
					</Alert>:null}
				</div>
				<Form id="comments-modal-form" onSubmit={handleSubmitModal((data) => {
					console.log(data);
					dispatch(sagaNewComment({comment: data.comment, reviewId: review.id}));
				})}>
					<Form.Group as={Row} className="mb-3" controlId="formBasicComment">
						<Form.Label column sm="2">{t('comment')}</Form.Label>
						<Col sm="10">
							<Form.Control as="textarea" {...registerModal("comment")} rows={5} placeholder={t('Enter comment')} isInvalid={!!errorsModal.comment} />
							<Form.Control.Feedback type="invalid">
								{t(errorsModal.comment?.message)}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="outline-secondary" onClick={handleClose}>{t('Close')}</Button>
				<Button variant="outline-success" type="submit" form="comments-modal-form">{t('Add Comment')}</Button>
			</Modal.Footer>
		</Modal>
	</>:<Container className="border border-primary rounded mt-1 mb-1 pt-3 pb-3">
		<Row className="justify-content-center">
			<Col sm="auto"><span className="h3">{t('Comments NOT FOUND!!!')}</span></Col>
		</Row>
	</Container>);
}
