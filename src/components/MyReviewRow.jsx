import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";

import {sagaRemoveReview} from '../redux/saga/editor.reviews.js';

export default function ReviewItem(props) {
	const {t} = useTranslation();
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
				<td>{entry.id}</td>
				<td>{entry.groupTitle?.group?.group}</td>
				<td>{entry.groupTitle?.title?.title}</td>
				<td>{entry.authorRating}</td>
				<td>{entry.averageEditorRating}</td>
				<td>{entry.averageUserRating}</td>
				<td>{entry.countComments}</td>
				<td>{entry.tags.map((entry) => entry.tag).join(', ')}</td>
				<td><ReactMarkdown>{entry.description}</ReactMarkdown></td>
				<td>{entry.draft+''}</td>
				<td><a href={"/review/"+entry.id} className="btn btn-outline-info btn-sm" role="button" aria-pressed="true">V</a></td>
				<td><a href={"/my-review-edit/"+entry.id} className="btn btn-outline-primary btn-sm" role="button" aria-pressed="true">E</a></td>
				<td><Button variant="outline-danger" size="sm" onClick={handleShow}>R</Button></td>
			</tr>
			<Modal show={show} onHide={handleClose} animation={false} centered size="md">
				<Modal.Header closeButton>
					<Modal.Title>Modal Confirm Removing Review</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to remove review id: {entry.id} {entry.groupTitle?.group?.group}/{entry.groupTitle?.title?.title}?</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button variant="secondary" onClick={handleClose}>Close</Button>
					<Button variant="danger" onClick={handleOKClose}>Remove Review</Button>
				</Modal.Footer>
			</Modal>
		</>
	)
}
