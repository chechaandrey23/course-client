import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import {sagaRemoveReview} from '../redux/saga/editor.reviews.js';

export default function MyReviewRow(props) {
	const {t} = useTranslation('components/MyReviewRow');
	const dispatch = useDispatch();

	const entry = props.entry;

	const [show, setShow] = useState(false);

	const handleClose = useCallback(() => setShow(false), []);
	const handleShow = useCallback(() => setShow(true), []);
	const handleOKClose = useCallback(() => {
		dispatch(sagaRemoveReview(entry));
		setShow(false);
	}, [entry]);

	return (
		<>
			<tr>
				<td>{props.index+1}</td>
				<td>{entry.id}</td>
				<td>{entry.groupTitle?.group?.group}</td>
				<td>{entry.groupTitle?.title?.title}</td>
				<td>{entry.authorRating}</td>
				<td>{entry.averageEditorRating}</td>
				<td>{entry.averageUserRating}</td>
				<td>{entry.countComments}</td>
				<td>{entry.tags.map((entry) => entry.tag).join(', ')}</td>
				<td>{entry.description}</td>
				<td>{entry.draft+''}</td>
				<td>{entry.blocked+''}</td>
				<td><Link to={"/my-review-view/"+entry.id} className="btn btn-outline-info btn-sm" role="button" aria-pressed="true">{t('V')}</Link></td>
				<td><Link to={"/my-review-edit/"+entry.id} className="btn btn-outline-primary btn-sm" role="button" aria-pressed="true">{t('E')}</Link></td>
				<td><Button variant="outline-danger" size="sm" onClick={handleShow}>{t('R')}</Button></td>
			</tr>
			<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>{t('Modal Confirm Removing Review')}</Modal.Title>
				</Modal.Header>
				<Modal.Body>{t('Are you sure you want to remove review id: {} {}/{}?', {id: entry.id, group: entry.groupTitle?.group?.group, title: entry.groupTitle?.title?.title})}</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button variant="secondary" onClick={handleClose}>{t('Close')}</Button>
					<Button variant="danger" onClick={handleOKClose}>{t('Remove Review')}</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
