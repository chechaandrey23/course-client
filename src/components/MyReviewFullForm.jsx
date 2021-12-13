import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
//import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Modal} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import AsyncSelect from 'react-select/async';
import {AsyncPaginate} from 'react-select-async-paginate';

import ModalImage from '../image/ModalImages';

import {sagaGetReview, sagaEditReview} from '../redux/saga/editor.reviews.js';
import {sagaGetAllGroups} from '../redux/saga/editor.groups.js';
import {sagaGetPartTitles, sagaNewTitle} from '../redux/saga/editor.titles.js';
import {sagaGetPartTags, sagaNewTag} from '../redux/saga/editor.tags.js';

import {errorSetReview} from '../redux/editor.reviews.js';

import Filler from './Filler';
import ModalNewTitle from './ModalNewTitle';

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
	//group: Yup.number().required('Group is required'),
	//title: Yup.number().required('Title is required'),
	//description: Yup.string().max(3000, 'Description must be maximum 3000 characters'),
	//text: Yup.string().max(65000, 'Description must be maximum 65000 characters'),
	//tags: Yup.array().of(Yup.number()),
	//authorRating: Yup.number(),
	//draft: Yup.boolean()
});



// groupId, titleId, description, text, tags, authorRating, draft, blocked
export default function MyReviewFullEdit(props) {
	const {t} = useTranslation();

	const ref = useRef();
	const aref = useRef();

	const [selectedTags, setSelectedTags] = useState([]);

	//const review = useSelector((state) => state.editorReviews.dataItem);
	//const reviewLoading = useSelector((state) => state.editorReviews.dataItemLoading);
	const error = useSelector((state) => state.editorReviews.dataItemError);
	const setReviewLoading = useSelector((state) => state.editorReviews.dataItemSetLoading);

	const dispatch = useDispatch();
	const params = useParams();
	const [firstRender, setFirstRender] = useState(true);
	const [show, setShow] = useState(false);






	//const newTitle = useSelector((state) => state.editorTitles.newTitle);

	const tags = useSelector((state) => state.editorTags.tags);
	const loadTags = useSelector((state) => state.editorTags.loadTags);
	const newTag = useSelector((state) => state.editorTags.newTag);
	const loadNewTag = useSelector((state) => state.editorTags.loadNewTag);

	useEffect(() => {
		//dispatch(sagaGetReview(params.id));
		dispatch(sagaGetAllGroups());
		//dispatch(sagaGetAllTitles());
		setFirstRender(false);
	}, []);

	const {register, handleSubmit, setValue, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});



	const handleClose = useCallback(() => {setShow(false);}, []);
	const handleShow = useCallback(() => setShow(true), []);

	/*
	useEffect(() => {
		if(newTitle) {
			setValue('title', newTitle.id);
			ref.current.hideMenu();
		}
	}, [newTitle]);
	*/

	useEffect(() => {
		if(newTag) {
			setSelectedTags([...selectedTags, newTag]);
		}
	}, [newTag]);

	//useEffect(() => {
	//	if(review.tags) setSelectedTags([...review.tags]);
	//}, [review]);

/*


<AsyncTypeahead ref={ref} id="async-title"
	minLength={3}
	allowNew={true}
	delay={300}
	useCache={false}
	labelKey="title"
	isLoading={loadTitles}
	clearButton
	defaultSelected={props.title?[props.title]:[]}
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
	options={titles.length>0?titles:(props.title?[props.title]:[])} />
<Form.Control {...register("title")} defaultValue={props.title?.id || null} type="text" isInvalid={!!errors.title} />
*/
	const refNewTitle = useRef('');
	const refTitleTypeAHead = useRef(null);
	const refTitleHelper = useRef(0);
	const [showModalNewTitle, setShowModalNewTitle] = useState(false);
	const titles = useSelector((state) => state.editorTitles.titles);
	const loadTitles = useSelector((state) => state.editorTitles.loadTitles);
	const loadNewTitle = useSelector((state) => state.editorTitles.loadNewTitle);

	// groups
	const [callbackGroupSelect, setCallbackGroupSelect] = useState(null);
	const groups = useSelector((state) => state.editorGroups.groups);
	const loadGroups = useSelector((state) => state.editorGroups.loadGroups);
	useLayoutEffect(() => {
		if(groups && groups.length > 0 && callbackGroupSelect) {
			callbackGroupSelect.callback(groups.map((entry) => ({value: entry.id,  label: entry.group})));
		}
	}, [groups]);

	return(
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			<ModalImage />
			{showModalNewTitle?<ModalNewTitle 	title={refNewTitle.current}
												closed={() => {setShowModalNewTitle(false)}}
												successed={(newTitle) => {
													if(refTitleTypeAHead.current) refTitleTypeAHead.current.blur();
													setShowModalNewTitle(false);
													setValue('title', [newTitle]);

												}} />:null}
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
					<Form onSubmit={handleSubmit((data) => {
						console.log(data);
						//dispatch(sagaEditReview({id: props.id, ...data}))
					})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicGroup">
							<Form.Label column sm="2">Group</Form.Label>
							<Col sm="10">
								<Controller name="group"
											control={control}
											defaultValue={{value: props.group?.id, label: props.group?.group}}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncSelect //cacheOptions={false}
																	loadOptions={(inputValue, callback) => {
																		setCallbackGroupSelect({callback});
																		dispatch(sagaGetAllGroups());
																	}}
																	onChange={onChange}
																	value={value}
																	isSearchable={false}
																	defaultOptions
																	//onInputChange={this.handleInputChange}
																	/>
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.group?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTitle">
							<Form.Label column sm="2">Title</Form.Label>
							<Col sm="10">
								{loadNewTitle?<Filler size="1.25rem" />:null}
								<Controller name="title"
											ref={refTitleTypeAHead}
											control={control}
											defaultValue={props.title?[props.title]:[]}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncTypeahead  ref={ref}
																		id="async-autocomplete-title"
																		minLength={3}
																		delay={300}
																		useCache={false}
																		allowNew={true}
																		newSelectionPrefix={<span className="text-danger">New Title: </span>}
																		selectHintOnEnter={true}
																		labelKey="title"
																		isLoading={loadTitles}
																		clearButton
																		onChange={(selected) => {
																			if(selected.length > 0) {
																				if(selected[0].customOption) {
																					refNewTitle.current = selected[0].title;
																					setShowModalNewTitle(true);
																				}
																				onChange.call(null, selected);
																			} else {
																				onChange.call(null, []);

																			}
																		}}
																		onBlur={onBlur}
																		selected={value}
																		onFocus={() => {refTitleHelper.current = 0;}}
																		onInputChange={(query) => {
																			if(refTitleHelper.current < 1) dispatch(sagaGetPartTitles(query));
																			refTitleHelper.current++;
																		}}
																		onSearch={(query) => {console.log(query);dispatch(sagaGetPartTitles(query))}}
																		options={titles.length>0?titles:(props.title?[props.title]:[])} />
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.title?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicDescription">
							<Form.Label column sm="2">description</Form.Label>
							<Col sm="10">
								<MdEditor style={{ height: '500px' }} renderHTML={text => {
									return <ReactMarkdown>{text}</ReactMarkdown>
								}} onChange={({ html, text }) => {
									//console.log(html)
								}} />
								<Form.Control as="textarea" {...register("description")} rows={5} defaultValue={props.description || ''} placeholder="Enter description" isInvalid={!!errors.description} />
								<Form.Control.Feedback type="invalid">
									{errors.description?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicText">
							<Form.Label column sm="2">review</Form.Label>
							<Col sm="10">
								<MdEditor style={{ height: '500px' }} renderHTML={text => {
									return <ReactMarkdown>{text}</ReactMarkdown>
								}} onChange={({ html, text }) => {
									//console.log(html)
								}} />
								<Form.Control as="textarea" {...register("text")} rows={10} defaultValue={props.text || ''} placeholder="Enter text review" isInvalid={!!errors.text} />
								<Form.Control.Feedback type="invalid">
									{errors.text?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTags">
							<Form.Label column sm="2">Tags</Form.Label>
							<Col sm="10">
								<AsyncTypeahead ref={aref} id="async-tags"
												minLength={2}
												allowNew={true}
												selectHintOnEnter={true}
												delay={300}
												useCache={false}
												labelKey="tag"
												isLoading={loadTags}
												clearButton
												defaultSelected={Array.isArray(props.tags)?props.tags:[]}
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
												onSearch={(query) => {console.log(query);dispatch(sagaGetPartTags(query))}}
												options={tags.length>0?tags.filter((entry) => {
													return !~aref.current.state.selected.findIndex((item) => item.id == entry.id)
												}):(Array.isArray(props.tags)?props.tags:[])} />
								<Form.Control {...register("tags")} value={selectedTags.map((entry) => entry.id).join(' ')} type="text" isInvalid={!!errors.title} />
								<Form.Control.Feedback type="invalid">
									{errors.tags?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formAuthorRating">
							<Form.Label column sm="2">Author rating</Form.Label>
							<Col sm="10">
								<Form.Select {...register("authorRating")}
										{...(props.authorRating?{defaultValue: props.authorRating}:{})} isInvalid={!!errors.authorRating} >
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
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{errors.authorRating?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>

						<Form.Group as={Row} className="mb-3" controlId="formIsDraft">
							<Form.Label column sm="2">Is Draft</Form.Label>
							<Col sm="10">
								<Form.Check type="checkbox" defaultChecked={!!props.draft} />
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

		</Container>
	)
}
