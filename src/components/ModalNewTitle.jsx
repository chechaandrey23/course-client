import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
//import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {sagaGetPartTitles, sagaNewTitle} from '../redux/saga/editor.titles.js';
import {errorNewTitle as errorNewTitleAC} from '../redux/editor.titles.js';

import Filler from './Filler';
import ModalImage from '../image/ModalImages';

// markdown
import ReactMarkdown from 'react-markdown'
//import MarkdownIt from 'markdown-it';
import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import MarkdownImages from '../helpers/markdown.image.jsx';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

//const mdParser = new MarkdownIt(/* Markdown-it options */);

MdEditor.unuse(Plugins.Image);
MdEditor.use(MarkdownImages);

const validationSchemaModal = Yup.object().shape({
	title: Yup.string().required('Title is required')
						.min(3, 'Title must be minimum 3 characters')
						.max(255, 'Title must be maximum 255 characters'),
	description: Yup.string().required('Description is required')
								.min(10, 'Description must be at least 10 characters')
								.max(3000, 'Description must be maximum 3000 characters')
});

// title, closed, successed
export default function ModalNewTitle(props) {
	const {t} = useTranslation('components/ModalNewTitle');
	const dispatch = useDispatch();

	const newTitle = useSelector((state) => state.editorTitles.newTitle);
	const loadNewTitle = useSelector((state) => state.editorTitles.loadNewTitle);
	const errorNewTitle = useSelector((state) => state.editorTitles.errorNewTitle);

	const {	register, handleSubmit, setValue, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchemaModal)});

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
				<Modal.Title>{t('Modal Create New Title')}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<ModalImage />
				{loadNewTitle?<Filler size='6rem' />:null}
				{errorNewTitle?<Alert variant="danger" onClose={() => {dispatch(errorNewTitleAC(false))}} dismissible>
					<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
					<p>{errorNewTitle.data.reason || errorNewTitle.data.message}</p>
				</Alert>:null}
				<Form id="hook-modal-form" onSubmit={handleSubmit((data) => {
					console.log(data);
					dispatch(sagaNewTitle(data));
				})}>
					<Form.Group as={Row} className="mb-3" controlId="formBasicTitleTitle">
						<Form.Label column sm="2">{t('Title')}</Form.Label>
						<Col sm="10">
							<Form.Control {...register("title")} type="text" defaultValue={props.title} placeholder={t('Enter title')} isInvalid={!!errors.title} />
							<Form.Control.Feedback type="invalid">
								{t(errors.title?.message)}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
					<Form.Group as={Row} className="mb-3" controlId="formBasicTitleDescription">
						<Form.Label column sm="2">{t('Description')}</Form.Label>
						<Col sm="10">
							<Controller name="description"
										control={control}
										isInvalid={!!errors.description}
										render={({ field: {onChange, onBlur, value, ref}, fieldState: {error} }) => {
											return <MdEditor 	ref={ref}
																style={{
																	height: '500px',
																	borderRadius: '.25rem',
																	...(error?{borderColor: '#dc3545'}:{})
																}}
																renderHTML={text => {
																	return <ReactMarkdown>{text}</ReactMarkdown>
																}}
																onChange={({ html, text }) => {
																	onChange.call(null, text);
																}}
																onBlur={onBlur}
																value={value} />
										}} />
							<Form.Control.Feedback type="invalid" style={errors.description?{display: 'block'}:{}}>
								{t(errors.description?.message)}
							</Form.Control.Feedback>
						</Col>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="outline-secondary" onClick={props.closed || null}>{t('Close')}</Button>
				<Button variant="outline-success" type="submit" form="hook-modal-form">{t('Create Title')}</Button>
			</Modal.Footer>
		</Modal>
	</>);
}
