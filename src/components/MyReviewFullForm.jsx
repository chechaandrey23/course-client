import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams, useNavigate, useSearchParams} from "react-router-dom";
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

import {sagaGetReview, sagaNewReview, sagaEditReview} from '../redux/saga/editor.reviews.js';
import {sagaGetAllGroups} from '../redux/saga/editor.groups.js';
import {sagaGetPartTitles, sagaNewTitle} from '../redux/saga/editor.titles.js';
import {sagaGetPartTags, sagaNewTag} from '../redux/saga/editor.tags.js';

import {errorSetReview, errorNewReview} from '../redux/editor.reviews.js';

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
	group: Yup.object({
		value: Yup.number().required('Group is required').positive().integer()
	}),
	title: Yup.array().length(1, 'Title is required').of(Yup.object({
		id: Yup.number().positive().integer()
	})),
	description: Yup.string()
					.required('Description is required')
					.min(10, 'Description must be at least 10 characters')
					.max(3000, 'Description must be maximum 3000 characters'),
	text: 	Yup	.string()
				.required('Text is required')
				.min(10, 'Text must be at least 10 characters')
				.max(65000, 'Description must be maximum 65000 characters'),
	tags: Yup.array().of(Yup.object({
		id: Yup.number().positive().integer()
	})),
	authorRating: Yup	.number()
						.required()
						.min(1, 'Author Rating is required')
						.max(10),
	draft: Yup.boolean().required()
});



// groupId, titleId, description, text, tags, authorRating, draft, blocked
export default function MyReviewFullForm(props) {
	const {t} = useTranslation('components/MyReviewFullForm');
	const dispatch = useDispatch();
	const params = useParams();
	const {register, handleSubmit, setValue, control, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});
	const navigate = useNavigate();

	// title
	const refNewTitle = useRef('');
	const refTitleTypeAHead = useRef(null);
	const refTitleHelper = useRef(0);
	const [showModalNewTitle, setShowModalNewTitle] = useState(false);
	const titles = useSelector((state) => state.editorTitles.titles);
	const loadTitles = useSelector((state) => state.editorTitles.loadTitles);
	const loadNewTitle = useSelector((state) => state.editorTitles.loadNewTitle);

	// group
	const [callbackGroupSelect, setCallbackGroupSelect] = useState(null);
	const groups = useSelector((state) => state.editorGroups.groups);
	const loadGroups = useSelector((state) => state.editorGroups.loadGroups);
	useLayoutEffect(() => {
		if(groups && groups.length > 0 && callbackGroupSelect) {
			callbackGroupSelect.callback(groups.map((entry) => ({value: entry.id,  label: entry.group})));
		}
	}, [groups]);

	// tags
	const refTagsTypeAHead = useRef(null);
	const refSelectedTags = useRef([]);
	const tags = useSelector((state) => state.editorTags.tags);
	const loadTags = useSelector((state) => state.editorTags.loadTags);
	const newTag = useSelector((state) => state.editorTags.newTag);
	const loadNewTag = useSelector((state) => state.editorTags.loadNewTag);
	useEffect(() => {
		if(newTag) {
			setValue('tags', [...refSelectedTags.current, newTag]);
		}
	}, [newTag]);

	useLayoutEffect(() => () => {
		dispatch(errorSetReview(false));
		dispatch(errorNewReview(false));
	}, []);

	const errorSet = useSelector((state) => state.editorReviews.dataItemError);
	const setReviewLoading = useSelector((state) => state.editorReviews.dataItemSetLoading);
	const errorNew = useSelector((state) => state.editorReviews.dataNewError);
	const newReviewLoading = useSelector((state) => state.editorReviews.dataItemNewLoading);

	const newReview = useSelector((state) => state.editorReviews.newReview);
	const review = useSelector((state) => state.editorReviews.dataItem);

	const firstRenderNewReview = useRef(true);
	useEffect(() => {
		if(!firstRenderNewReview.current && newReview) {
			navigate('/my-review-edit/'+newReview.id);
		}
		firstRenderNewReview.current = false;
	}, [newReview]);

	const [saveSuccessed, setSaveSuccessed] = useState(false);
	const firstRenderSetReview = useRef(true);
	useEffect(() => {
		let timeout;
		if(!firstRenderSetReview.current) {
			setSaveSuccessed(true);
			timeout = setTimeout(() => {setSaveSuccessed(false);}, 5000);
		}
		firstRenderSetReview.current = false;
		return () => {
			clearTimeout(timeout);
		}
	}, [review]);

	return(
		<Container className="border border-primary rounded mt-1 mb-1">
			{setReviewLoading?<Filler size="6rem" />:null}
			{newReviewLoading?<Filler size="6rem" />:null}
			<ModalImage />
			{showModalNewTitle?<ModalNewTitle 	title={refNewTitle.current}
												closed={() => {setShowModalNewTitle(false)}}
												successed={(newTitle) => {
													if(refTitleTypeAHead.current) refTitleTypeAHead.current.blur();
													setShowModalNewTitle(false);
													setValue('title', [newTitle], {
														shouldValidate: true,
														shouldDirty: true
													});
												}} />:null}
			<Row className="justify-content-center mt-2 mb-2">
				<Col sm="auto">
					{(props.id)?<h4>{t('Edit Review "{} => {}/{}"', {id: props.id, group: props.group?.group, title: props.title?.title})}</h4>:<h4>{t('Create New Review')}</h4>}
				</Col>
			</Row>
			{props.blocked?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="danger">
						<h4>{t('This review has been banned and cannot be published!')}</h4>
						<h4>{t('Please contact the Moderator for details!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
			{errorSet?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="danger" onClose={() => {dispatch(errorSetReview(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{errorSet.data.reason || errorSet.data.message}</p>
					</Alert>
				</Col>
			</Row>:null}
			{errorNew?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="danger" onClose={() => {dispatch(errorNewReview(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{errorNew.data.reason || errorNew.data.message}</p>
					</Alert>
				</Col>
			</Row>:null}
			{saveSuccessed?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="success" onClose={() => {dispatch(setSaveSuccessed(false))}} dismissible>
						<Alert.Heading>{t('You Review Save Success')}</Alert.Heading>
					</Alert>
				</Col>
			</Row>:null}
			<Row className="mb-2 mt-2">
				<Col>
					<Form id="hook-create-edit-review-form" onSubmit={handleSubmit((data) => {
						const queryData = {
							group: data.group.value,
							title: data.title[0].id,
							description: data.description,
							text: data.text,
							tags: data.tags.map((entry) => entry.id),
							authorRating: data.authorRating,
							draft: data.draft
						};

						if(props.id) {
							dispatch(sagaEditReview({id: props.id, ...queryData}));
						} else {
							dispatch(sagaNewReview(queryData));
						}
					})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicGroup">
							<Form.Label column sm="2">{t('Group')}</Form.Label>
							<Col sm="10">
								<Controller name="group"
											control={control}
											isInvalid={!!errors.group}
											defaultValue={{value: props.group?.id, label: props.group?.group}}
											render={({ field: {onChange, onBlur, value, ref}, fieldState: {error} }) => {
												return <AsyncSelect //cacheOptions={false}
																	loadOptions={(inputValue, callback) => {
																		setCallbackGroupSelect({callback});
																		dispatch(sagaGetAllGroups());
																	}}
																	onChange={onChange}
																	value={value}
																	isSearchable={false}
																	defaultOptions
																	styles={{control: (styles, state) => {
																		return ({
																			...styles,
																			...(error?{
																				"&:hover": {borderColor: '#dc3545'},
																				borderColor: '#dc3545',
																				boxShadow: state.isFocused?'0 0 0 0.25rem rgb(220 53 69 / 25%)':'none'
																			}:{})
																		 })
																	}}}
																	//onInputChange={this.handleInputChange}
																	/>
											}} />
								<Form.Control.Feedback type="invalid" style={errors.group?{display: 'block'}:{}}>
									{t(errors.group?.value?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTitle">
							<Form.Label column sm="2">{t('Title')}</Form.Label>
							<Col sm="10">
								{loadNewTitle?<Filler size="1.25rem" />:null}
								<Controller name="title"
											ref={refTitleTypeAHead}
											control={control}
											isInvalid={!!errors.title}
											defaultValue={props.title?[props.title]:[]}
											render={({ field: {onChange, onBlur, value, ref}, fieldState: {error} }) => {
												return <AsyncTypeahead  ref={ref}
																		id="async-autocomplete-title"
																		minLength={3}
																		delay={300}
																		useCache={false}
																		allowNew={true}
																		isInvalid={!!error}
																		newSelectionPrefix={<span className="text-danger">{t('New Title: ')}</span>}
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
																			if(refTitleHelper.current < 1 && query.length >= 3) dispatch(sagaGetPartTitles(query));
																			refTitleHelper.current++;
																		}}
																		onSearch={(query) => {console.log(query);dispatch(sagaGetPartTitles(query))}}
																		options={titles.length>0?titles:(props.title?[props.title]:[])} />
											}} />
								<Form.Control.Feedback type="invalid" style={errors.title?{display: 'block'}:{}}>
									{t(errors.title?.message || errors.title?.id?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicDescription">
							<Form.Label column sm="2">{t('Description')}</Form.Label>
							<Col sm="10">
								<Controller name="description"
											control={control}
											isInvalid={!!errors.description}
											defaultValue={props.description || ''}
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
						<Form.Group as={Row} className="mb-3" controlId="formBasicText">
							<Form.Label column sm="2">{t('Review')}</Form.Label>
							<Col sm="10">
							<Controller name="text"
										control={control}
										isInvalid={!!errors.text}
										defaultValue={props.text || ''}
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
																theme="dark"
																onBlur={onBlur}
																value={value} />
										}} />
								<Form.Control.Feedback type="invalid" style={errors.text?{display: 'block'}:{}}>
									{t(errors.text?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTags">
							<Form.Label column sm="2">{t('Tags')}</Form.Label>
							<Col sm="10">
								{loadNewTag?<Filler size="1.25rem" />:null}
								<Controller name="tags"
											ref={refTagsTypeAHead}
											control={control}
											isInvalid={!!errors.tags}
											defaultValue={props.tags?props.tags:[]}
											render={({ field: {onChange, onBlur, value, ref}, fieldState: {error} }) => {
												return <AsyncTypeahead  ref={ref} id="async-autocomplete-tags"
																		minLength={2}
																		delay={300}
																		useCache={false}
																		labelKey="tag"
																		multiple={true}
																		isInvalid={!!error}
																		isLoading={loadTags}
																		clearButton
																		allowNew={true}
																		newSelectionPrefix={<span className="text-danger">{t('New Tag: ')}</span>}
																		selectHintOnEnter={true}
																		onChange={(selected) => {
																			if(selected.length > 0) {
																				if(!selected.every((entry) => !entry.customOption)) {
																					refSelectedTags.current = selected.filter((entry) => !entry.customOption);
																					dispatch(sagaNewTag(selected.filter((entry) => entry.customOption)[0].tag));
																				} else {
																					onChange.call(null, selected);
																				}
																			} else {
																				onChange.call(null, []);
																			}
																		}}
																		onBlur={onBlur}
																		selected={value}
																		onSearch={(query) => {dispatch(sagaGetPartTags(query))}}
																		options={tags.length>0?tags:(Array.isArray(props.tags)?props.tags:[])} />
											}} />
								<Form.Control.Feedback type="invalid">
									{t(errors.tags?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formAuthorRating">
							<Form.Label column sm="2">{t('Author rating')}</Form.Label>
							<Col sm="10">
								<Form.Select 	{...register("authorRating")}
												{...(props.authorRating?{defaultValue: props.authorRating}:{})}
												isInvalid={!!errors.authorRating} >
									<option disabled selected value="0">{t('Chose ratings')}</option>
									{[1,2,3,4,5,6,7,8,9,10].map((value, index) => {
										return <option key={index} value={value}>{value}</option>
									})}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{t(errors.authorRating?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formIsDraft">
							<Form.Label column sm="2">{t('Is Draft')}</Form.Label>
							<Col sm="10">
								<Form.Check type="checkbox" style={{width: '2rem', height: '2rem'}} {...register("draft")} defaultChecked={props.hasOwnProperty('draft')?!!props.draft:true} />
								<Form.Control.Feedback type="invalid">
									{t(errors.draft?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
					</Form>
				</Col>
			</Row>
			{errorSet?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="danger" onClose={() => {dispatch(errorSetReview(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{errorSet.data.reason || errorSet.data.message}</p>
					</Alert>
				</Col>
			</Row>:null}
			{errorNew?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="danger" onClose={() => {dispatch(errorNewReview(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{errorNew.data.reason || errorNew.data.message}</p>
					</Alert>
				</Col>
			</Row>:null}
			{saveSuccessed?<Row className="mt-2 mb-2">
				<Col>
					<Alert variant="success" onClose={() => {dispatch(setSaveSuccessed(false))}} dismissible>
						<Alert.Heading>{t('You Review Save Success')}</Alert.Heading>
					</Alert>
				</Col>
			</Row>:null}
			{props.blocked?<Row className="justify-content-center mt-2 text-center">
				<Col>
					<Alert variant="danger">
						<h4>{t('This review has been banned and cannot be published!')}</h4>
						<h4>{t('Please contact the Moderator for details!')}</h4>
					</Alert>
				</Col>
			</Row>:null}
			<Row className="justify-content-center mt-2 mb-2">
				<Col sm="auto">
					<Link to="/my-reviews" className="btn btn-outline-secondary">{t('My Reviews')}</Link>
				</Col>
				<Col sm="auto">
					<Button variant="outline-danger" type="button" onClick={() => {
						setValue('group', {value: undefined});
						setValue('title', []);
						setValue('description', '');
						setValue('text', '');
						setValue('tags', []);
						setValue('authorRating', 0);
						setValue('draft', true);
					}}>{t('Reset')}</Button>
				</Col>
				<Col sm="auto">
					<Button variant="outline-primary" type="submit" form="hook-create-edit-review-form">{props.id?t('Save'):t('Create')}</Button>
				</Col>
			</Row>
		</Container>
	)
}
