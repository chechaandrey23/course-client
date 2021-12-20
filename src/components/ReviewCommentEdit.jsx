import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {Container, Row, Col, Button, Modal, Form, Alert} from 'react-bootstrap';
import {useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {sagaEditComment} from '../redux/saga/user.comments.js';
import {errorLoadEditComment} from '../redux/user.comments.js';

import Filler from './Filler';

const validationSchemaModal = Yup.object().shape({
	comment: Yup.string().required('Comment is required').min(10, 'Commeent must be at least 10 characters').max(3000, 'Comment must be maximum 3000 characters')
});

export default function ReviewCommentEdit(props) {
	const {t} = useTranslation('components/ReviewCommentEdit');
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);

	const commentProcessing = useSelector((state) => state.userComments.commentProcessing);
	const editCommentError = useSelector((state) => state.userComments.editCommentError);

	const handleClose = useCallback(() => {
		dispatch(errorLoadEditComment(false));
		setShow(false);
	}, []);
	const handleShow = useCallback(() => {
		//resetModal();
		setShow(true);
	}, []);

	const {	register: registerModal,
			handleSubmit: handleSubmitModal,
			setValue: setValueModal,
			reset: resetModal,
			formState: {errors: errorsModal}} = useForm({resolver: yupResolver(validationSchemaModal)});

	const comments = useSelector((state) => state.userComments.comments);

	useEffect(() => {
		if(commentProcessing.includes(props.id)) setShow(false);
	}, [comments]);

	useLayoutEffect(() => {
		setValueModal('comment', props.comment);
	}, [props]);

	return (<>
		<Button variant="primary" size="sm" onClick={handleShow}>{t('Edit')}</Button>
		<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>{t('Modal Edit Comment')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{(commentProcessing.includes(props.id))?<Filler size='6rem' />:null}
				<div>
					{editCommentError?<Alert variant="danger" onClose={() => {dispatch(errorLoadEditComment(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{editCommentError.data.reason || editCommentError.data.message}</p>
					</Alert>:null}
				</div>
				<Form id="comment-edit-modal-form" onSubmit={handleSubmitModal((data) => {
					console.log(data);
					dispatch(sagaEditComment({id: props.id, reviewId: props.reviewId, comment: data.comment}));
					//setShow(false);
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
				<Button variant="outline-success" type="submit" form="comment-edit-modal-form">{t('Save Comment')}</Button>
			</Modal.Footer>
		</Modal>
	</>);
}
