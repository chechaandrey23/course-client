import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
//import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';

import ModalImage from '../image/ModalImages';

import {sagaGetReview, sagaEditReview} from '../redux/saga/editor.reviews.js';
import {sagaGetAllGroups} from '../redux/saga/editor.groups.js';
import {sagaGetPartTitles, sagaNewTitle} from '../redux/saga/editor.titles.js';
import {sagaGetPartTags, sagaNewTag} from '../redux/saga/editor.tags.js';

import {errorSetReview} from '../redux/editor.reviews.js';

import Filler from './Filler';

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


const validationSchema = Yup.object().shape({
	group: Yup.number().required('Group is required'),
	title: Yup.number().required('Title is required'),
	description: Yup.string().max(3000, 'Description must be maximum 3000 characters'),
	text: Yup.string().max(65000, 'Description must be maximum 65000 characters'),
	tags: Yup.array().of(Yup.number()),
	authorRating: Yup.number(),
	draft: Yup.boolean()
});

const validationSchemaModal = Yup.object().shape({
	title: Yup.string().required('Title is required').min(3, 'Title must be maximum 3 characters'),
	description: Yup.string().max(3000, 'Description must be maximum 3000 characters')
});

export default function MyReviewFullEdit(props) {
	const {t} = useTranslation();

	const ref = useRef();
	const aref = useRef();

	const [selectedTags, setSelectedTags] = useState([]);

	const review = useSelector((state) => state.editorReviews.dataItem);
	const reviewLoading = useSelector((state) => state.editorReviews.dataItemLoading);
	const error = useSelector((state) => state.editorReviews.dataItemError);
	const setReviewLoading = useSelector((state) => state.editorReviews.dataItemSetLoading);

	const dispatch = useDispatch();
	let params = useParams();
	let [firstRender, setFirstRender] = useState(true);
	const [show, setShow] = useState(false);

	const groups = useSelector((state) => state.editorGroups.groups);
	const loadGroups = useSelector((state) => state.editorGroups.loadGroups);

	const titles = useSelector((state) => state.editorTitles.titles);
	const loadTitles = useSelector((state) => state.editorTitles.loadTitles);
	const newTitle = useSelector((state) => state.editorTitles.newTitle);
	const loadNewTitle = useSelector((state) => state.editorTitles.loadNewTitle);

	const tags = useSelector((state) => state.editorTags.tags);
	const loadTags = useSelector((state) => state.editorTags.loadTags);
	const newTag = useSelector((state) => state.editorTags.newTag);
	const loadNewTag = useSelector((state) => state.editorTags.loadNewTag);

	useEffect(() => {
		dispatch(sagaGetReview(params.id));
		dispatch(sagaGetAllGroups());
		//dispatch(sagaGetAllTitles());
		setFirstRender(false);
	}, []);

	const {register, handleSubmit, setValue, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});
	const {	register: registerModal,
			handleSubmit: handleSubmitModal,
			setValue: setValueModal,
			formState: {errors: errorsModal}} = useForm({resolver: yupResolver(validationSchemaModal)});

	console.log(review, errors);

	const handleClose = useCallback(() => {setShow(false);}, []);
	const handleShow = useCallback(() => setShow(true), []);

	useEffect(() => {
		if(newTitle) {
			setValue('title', newTitle.id);
			ref.current.hideMenu();
		}
	}, [newTitle]);

	useEffect(() => {
		if(newTag) {
			setSelectedTags([...selectedTags, newTag]);
		}
	}, [newTag]);

	useEffect(() => {
		if(review.tags) setSelectedTags([...review.tags]);
	}, [review]);

	return(
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			<ModalImage />
			<Row className="mt-2">
				<Col>
					{error?<Alert variant="danger" onClose={() => {dispatch(errorSetReview(false))}} dismissible>
						<Alert.Heading>Server Error Message</Alert.Heading>
						<p>{error.data.reason || error.data.message}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto">
					<h4>Create New Review</h4>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<Form onSubmit={handleSubmit((data) => {console.log(data);dispatch(sagaEditReview({id: review.id, ...data}))})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicGroup">
							<Form.Label column sm="2">Group</Form.Label>
							<Col sm="10">
								{loadGroups?<Filler size="1.25rem" />:null}
								{(!firstRender && !loadGroups && !reviewLoading)?<Form.Select {...register("group")} defaultValue={review.groupTitle.group.id} isInvalid={!!errors.group}>
									{groups.map((entry, index) => {
										return <option key={index} value={entry.id}>{entry.group}</option>
									})}
								</Form.Select>:null}
								<Form.Control.Feedback type="invalid">
									{errors.group?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTitle">
							<Form.Label column sm="2">Title</Form.Label>
							<Col sm="10">
								{loadNewTitle?<Filler size="1.25rem" />:null}
								{(!firstRender && !reviewLoading)?<AsyncTypeahead ref={ref} id="async-title"
												minLength={3}
												allowNew={true}
												delay={300}
												useCache={false}
												labelKey="title"
												isLoading={loadTitles}
												clearButton
												defaultSelected={[review.groupTitle.title]}
												onChange={(selected) => {
													if(selected.length > 0) {
														if(selected[0].customOption) {
															setShow(true);
															setValueModal('title', selected[0].title);
															setValueModal('description', '');
														} else {
															setValue('title', selected[0].id)
														}
													} else {
														setValue('title', undefined);
													}
												}}
												onSearch={(query) => {dispatch(sagaGetPartTitles(query))}}
												options={titles.length>0?titles:[review.groupTitle.title]} />:null}
								{(!firstRender && !reviewLoading)?<Form.Control {...register("title")} defaultValue={review.groupTitle.title.id} type="hidden" isInvalid={!!errors.title} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.title?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicDescription">
							<Form.Label column sm="2">description</Form.Label>
							<Col sm="10">
								{(!firstRender && !reviewLoading)?<MdEditor style={{ height: '500px' }} renderHTML={text => {
									return <ReactMarkdown>{text}</ReactMarkdown>
								}} onChange={({ html, text }) => {
									//console.log(html)
								}} />:null}
								{(!firstRender && !reviewLoading)?<Form.Control as="textarea" {...register("description")} rows={5} defaultValue={review.description} placeholder="Enter description" isInvalid={!!errors.description} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.description?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicText">
							<Form.Label column sm="2">review</Form.Label>
							<Col sm="10">
								{(!firstRender && !reviewLoading)?<MdEditor style={{ height: '500px' }} renderHTML={text => {
									return <ReactMarkdown>{text}</ReactMarkdown>
								}} onChange={({ html, text }) => {
									//console.log(html)
								}} />:null}
								{(!firstRender && !reviewLoading)?<Form.Control as="textarea" {...register("text")} rows={10} defaultValue={review.text} placeholder="Enter text review" isInvalid={!!errors.text} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.text?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTags">
							<Form.Label column sm="2">Tags</Form.Label>
							<Col sm="10">
								{(!firstRender && !reviewLoading)?<AsyncTypeahead ref={aref} id="async-tags"
												minLength={2}
												multiple={true}
												allowNew={true}
												delay={300}
												useCache={false}
												labelKey="tag"
												isLoading={loadTags}
												clearButton
												defaultSelected={review.tags}
												onChange={(selected) => {
													if(selected.length > 0) {
														if(selected.at(-1).customOption) {
															dispatch(sagaNewTag(selected.at(-1).tag))
														} else {
															setSelectedTags([...selected]);
														}
													} else {
														setSelectedTags([]);
													}
												}}
												onSearch={(query) => {dispatch(sagaGetPartTags(query))}}
												options={tags.length>0?tags.filter((entry) => {
													return !~aref.current.state.selected.findIndex((item) => item.id == entry.id)
												}):review.tags} />:null}
								{(!firstRender && !reviewLoading)?<Form.Control {...register("tags")} value={selectedTags.map((entry) => entry.id).join(' ')} type="text" isInvalid={!!errors.title} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.tags?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formAuthorRating">
							<Form.Label column sm="2">Author rating</Form.Label>
							<Col sm="10">
								{(!firstRender && !reviewLoading)?<Form.Select {...register("authorRating")}
										{...(review.authorRating?{defaultValue: review.authorRating}:{})} isInvalid={!!errors.authorRating} >
									<option disabled selected>Chose ratings</option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6">6</option>
									<option value="7">7</option>
									<option value="8">8</option>
									<option value="9">9</option>
									<option value="10">10</option>
								</Form.Select>:null}
								<Form.Control.Feedback type="invalid">
									{errors.authorRating?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3" controlId="formIsDraft">
							<Form.Label column sm="2">Is Draft</Form.Label>
							<Col sm="10">
								{(!firstRender && !reviewLoading)?<Form.Check type="checkbox" defaultChecked={!!review.draft} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.draft?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>

						<Row className="justify-content-center">
							<Col md="auto">
								<Button variant="outline-primary" type="submit">Save</Button>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
			<Modal show={show} onHide={handleClose} animation={false} centered size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Modal Create New Title</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form id="hook-modal-form" onSubmit={handleSubmitModal((data) => {
						console.log(data);
						dispatch(sagaNewTitle(data));
						setShow(false);
					})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTitleTitle">
							<Form.Label column sm="2">Title</Form.Label>
							<Col sm="10">
								<Form.Control {...registerModal("title")} type="text" placeholder="Enter title" isInvalid={!!errorsModal.title} />
								<Form.Control.Feedback type="invalid">
									{errorsModal.title?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTitleDescription">
							<Form.Label column sm="2">description</Form.Label>
							<Col sm="10">
								<Form.Control as="textarea" {...registerModal("description")} rows={3} placeholder="Enter description" isInvalid={!!errorsModal.description} />
								<Form.Control.Feedback type="invalid">
									{errorsModal.description?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button variant="outline-secondary" onClick={handleClose}>Close</Button>
					<Button variant="outline-success" type="submit" form="hook-modal-form">Create Title</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	)
}
