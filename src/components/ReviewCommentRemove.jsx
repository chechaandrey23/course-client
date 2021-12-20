import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {Container, Row, Col, Button, Modal, Form} from 'react-bootstrap';
import {useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";

import {sagaRemoveComment} from '../redux/saga/user.comments.js'

export default function ReviewCommentRemove(props) {
	const {t} = useTranslation('components/ReviewCommentRemove');
	const dispatch = useDispatch();

	const [show, setShow] = useState(false);

	const handleClose = useCallback(() => {
		//dispatch(errorNewComment(false));
		setShow(false);
	}, []);
	const handleShow = useCallback(() => {
		//resetModal();
		setShow(true);
	}, []);

	const handleOKClose = useCallback(() => {
		dispatch(sagaRemoveComment({id: props.id}));
		setShow(false);
	}, [props]);

	return (<>
		<Button variant="danger" size="sm" onClick={handleShow}>{t('Remove')}</Button>
		<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>{t('Modal Confirm Removing Comment')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{t('Are you sure you want to remove comment id: {} ?', {id: props.id})}</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="secondary" onClick={handleClose}>{t('Close')}</Button>
				<Button variant="danger" onClick={handleOKClose}>{t('Remove Comment')}</Button>
			</Modal.Footer>
		</Modal>
	</>);
}
