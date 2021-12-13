import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
//import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import Filler from './Filler';

import {sagaGetPartTitles, sagaNewTitle} from '../redux/saga/editor.titles.js';
import {errorNewTitle as errorNewTitleAC} from '../redux/editor.titles.js';

const validationSchemaModal = Yup.object().shape({
	title: Yup.string().required('Title is required').min(3, 'Title must be maximum 3 characters'),
	description: Yup.string().max(3000, 'Description must be maximum 3000 characters')
});

// title, closed, successed
export default function ModalNewTitle(props) {
	const {t} = useTranslation();
	const dispatch = useDispatch();

	const newTitle = useSelector((state) => state.editorTitles.newTitle);
	const loadNewTitle = useSelector((state) => state.editorTitles.loadNewTitle);
	const errorNewTitle = useSelector((state) => state.editorTitles.errorNewTitle);

	const {	register, handleSubmit, setValue, formState: {errors}} = useForm({resolver: yupResolver(validationSchemaModal)});

	const countRender = useRef(0);
	useLayoutEffect(() => {
		countRender.current++;
		if(typeof props.successed === 'function' && countRender.current > 1) {
			props.successed.call(null, newTitle);
		}
	}, [newTitle]);

	useLayoutEffect(() => () => {dispatch(errorNewTitleAC(false))}, []);

	return (<>
		<Modal show={true} onHide={props.closed || null} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Modal Create New Title</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{loadNewTitle?<Filler size='6rem' />:null}
				{errorNewTitle?<Alert variant="danger" onClose={() => {dispatch(errorNewTitleAC(false))}} dismissible>
					<Alert.Heading>Server Error Message</Alert.Heading>
					<p>{errorNewTitle.data.reason || errorNewTitle.data.message}</p>
				</Alert>:null}
				<Form id="hook-modal-form" onSubmit={handleSubmit((data) => {
					console.log(data);
					dispatch(sagaNewTitle(data));
				})}>
					<Form.Group as={Row} className="mb-3" controlId="formBasicTitleTitle">
						<Form.Label column sm="2">Title</Form.Label>
						<Col sm="10">
							<Form.Control {...register("title")} type="text" defaultValue={props.title} placeholder="Enter title" isInvalid={!!errors.title} />
							<Form.Control.Feedback type="invalid">
								{errors.title?.message}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3" controlId="formBasicTitleDescription">
						<Form.Label column sm="2">description</Form.Label>
						<Col sm="10">
							<Form.Control as="textarea" {...register("description")} rows={3} placeholder="Enter description" isInvalid={!!errors.description} />
							<Form.Control.Feedback type="invalid">
								{errors.description?.message}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="outline-secondary" onClick={props.closed || null}>Close</Button>
				<Button variant="outline-success" type="submit" form="hook-modal-form">Create Title</Button>
			</Modal.Footer>
		</Modal>
	</>);
}
