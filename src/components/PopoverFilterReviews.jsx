import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col, Button, Form, Alert, Modal, Tabs, Tab, Image, ProgressBar, Popover, OverlayTrigger} from 'react-bootstrap';
import {AsyncTypeahead, Typeahead} from 'react-bootstrap-typeahead';
import {useForm, useController, Controller} from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import {AsyncPaginate} from 'react-select-async-paginate';
import {useSearchParams, useNavigate} from "react-router-dom";

import {unique} from '../helpers/unique.js';

import {sagaGetPartTags} from '../redux/saga/editor.tags.js';
import {sagaGetAllGroups} from '../redux/saga/editor.groups.js';
import {sagaGetPartTitles} from '../redux/saga/editor.titles.js';
import {sagaGetPartEditors} from '../redux/saga/guest.editors.js';

import {setFilterData, setEditorFilterData} from '../redux/custom.filter.js';

// prop with authors, sortField, typeFilter(user|editor)
 export default function PopoverFilterReviews(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {register, handleSubmit, setValue, control, reset, formState: {errors}} = useForm(/*{resolver: yupResolver(validationSchema)}*/);

	const [searchParams, setSearchParams] = useSearchParams();

	const editorFilter = useSelector((state) => state.customFilter.editorFilter);
	const filter = useSelector((state) => state.customFilter.filter);

	const filterData = props.typeFilter === 'editor'?editorFilter:filter;

	const [callbackGroupSelect, setCallbackGroupSelect] = useState(null);
	const [callbackEditorSelect, setCallbackEditorSelect] = useState(null);

	const tags = useSelector((state) => state.editorTags.tags);
	const loadTags = useSelector((state) => state.editorTags.loadTags);

	const groups = useSelector((state) => state.editorGroups.groups);
	const loadGroups = useSelector((state) => state.editorGroups.loadGroups);

	const titles = useSelector((state) => state.editorTitles.titles);
	const loadTitles = useSelector((state) => state.editorTitles.loadTitles);

	//const editors = useSelector((state) => state.guestEditors.editors);
	const partEditors = useSelector((state) => state.guestEditors.partEditors);
	const loadEditors = useSelector((state) => state.guestEditors.loadEditors);

	// with react-select
	useLayoutEffect(() => {
		if(groups && groups.length > 0 && callbackGroupSelect) {
			callbackGroupSelect.callback(groups.map((entry) => ({value: entry.id,  label: entry.group})));
		}
	}, [groups]);

	// with react-select
	useLayoutEffect(() => {
		if(partEditors && callbackEditorSelect) {
			if(partEditors.length > 0) {
				callbackEditorSelect.callback({
					options: partEditors.map((entry) => {
						let userName = (entry.user && entry.social_id)?entry.user+'/'+entry.social_id:(
							entry.user?entry.user:(entry.social_id?entry.social_id:'UNKNOWN')
						);
						if(entry.userInfo) userName += `(${entry.userInfo.first_name} ${entry.userInfo.last_name})`;
						return {value: entry.id,  label: userName};
					}),
					hasMore: true
				});
			} else {
				callbackEditorSelect.callback({
					options: [],
					hasMore: false
				});
			}
		}
	}, [partEditors]);

	return (
		<OverlayTrigger rootClose={true} delay={0} trigger="click" /*key={placement}*/ placement="bottom" overlay={
			<Popover id="popover-filter-reviews" style={{minWidth: '500px'}} >
				<Popover.Header as="h3">Filter Selected Reviews</Popover.Header>
				<Popover.Body>
					<Form onSubmit={handleSubmit((data) => {
						let query = Object.keys(data).reduce((acc, key) => {
							if(data[key]) {
								if(key === 'tags' || key === 'titles') {
									acc[key] = unique(data[key].map((entry) => entry.id));
								} else if(key === 'authors' || key === 'groups') {
									acc[key] = unique(data[key].map((entry) => entry.value));
								} else {
									acc[key] = data[key];
								}
							}
							return acc;
						}, {});
						if(props.typeFilter === 'editor') {
							dispatch(setEditorFilterData(data))
						} else {
							dispatch(setFilterData(data))
						}
						navigate((props.typeFilter === 'editor'?'/my-reviews':'/reviews')+'?'+queryString.stringify(query, {arrayFormat: 'bracket'}));
						document.body.click();
					})}>
						<Form.Group as={Row} className="mb-3" controlId="formTags">
							<Form.Label column sm="2">Tags</Form.Label>
							<Col sm="10">
								<Controller name="tags"
											control={control}
											defaultValue={(() => {
												let tags = searchParams.getAll("tags[]");
												if(tags) {
													//tags = tags.split(',');
													let filterTags = filterData.tags || [];
													return tags.map((entry) => {
														const items = filterTags.filter((item) => item.id == entry);
														if(items.length < 1) {
															return {id: entry*1, tag: 'tag_id_'+entry}
														} else {
															return items.at(-1);
														}
													});
												} else {
													return [];
												}
											})()}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncTypeahead  ref={ref} id="async-autocomplete-tags"
																		minLength={2}
																		delay={300}
																		useCache={false}
																		labelKey="tag"
																		multiple={true}
																		isLoading={loadTags}
																		clearButton
																		//defaultSelected={[review.groupTitle.title]}
																		onChange={onChange}
																		onBlur={onBlur}
																		selected={value}
																		onSearch={(query) => {dispatch(sagaGetPartTags(query))}}
																		options={tags} />
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.tags?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formGroups">
							<Form.Label column sm="2">Groups</Form.Label>
							<Col sm="10">
								<Controller name="groups"
											control={control}
											defaultValue={(() => {
												let groups = searchParams.getAll("groups[]");
												if(groups) {
													//groups = groups.split(',');
													let filterGroups = filterData.groups || [];
													return groups.map((entry) => {
														const items = filterGroups.filter((item) => item.id == entry);
														if(items.length < 1) {
															return {value: entry*1, label: 'group_id_'+entry};
														} else {
															return items.at(-1);
														}
													});
												} else {
													return [];
												}
											})()}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncSelect //cacheOptions={false}
																	loadOptions={(inputValue, callback) => {
																		setCallbackGroupSelect({callback});
																		dispatch(sagaGetAllGroups());
																	}}
																	onChange={onChange}
																	value={value}
																	isMulti
																	isSearchable={false}
																	defaultOptions
																	//onInputChange={this.handleInputChange}
																	/>
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.groups?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formTitles">
							<Form.Label column sm="2">Titles</Form.Label>
							<Col sm="10">
								<Controller name="titles"
											control={control}
											defaultValue={(() => {
												let titles = searchParams.getAll("titles[]");
												if(titles) {
													//titles = titles.split(',');
													let filterTitles = filterData.titles || [];
													return titles.map((entry) => {
														const items = filterTitles.filter((item) => item.id == entry);
														if(items.length < 1) {
															return {id: entry*1, title: 'title_id_'+entry};
														} else {
															return items.at(-1);
														}
													});
												} else {
													return [];
												}
											})()}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncTypeahead  ref={ref} id="async-autocomplete-titles"
																		minLength={3}
																		delay={300}
																		useCache={false}
																		labelKey="title"
																		multiple={true}
																		isLoading={loadTitles}
																		clearButton
																		//defaultSelected={[review.groupTitle.title]}
																		onChange={onChange}
																		onBlur={onBlur}
																		selected={value}
																		onSearch={(query) => {dispatch(sagaGetPartTitles(query))}}
																		options={titles} />
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.tags?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						{props.withAuthors?<Form.Group as={Row} className="mb-3" controlId="formAuthos">
							<Form.Label column sm="2">Authors</Form.Label>
							<Col sm="10">
								<Controller name="authors"
											control={control}
											defaultValue={(() => {
												let authors = searchParams.getAll("authors[]");
												if(authors) {
													//authors = authors.split(',');
													let filterAuthors = filterData.authos || [];
													return authors.map((entry) => {
														const items = filterAuthors.filter((item) => item.id == entry);
														if(items.length < 1) {
															return {value: entry*1, label: 'author_id_'+entry};
														} else {
															return items.at(-1);
														}
													});
												} else {
													return [];
												}
											})()}
											render={({ field: {onChange, onBlur, value, ref} }) => {
												return <AsyncPaginate   //cacheOptions={false}
																		isMulti
																		isSearchable={false}
																		loadOptions={async (search, loadedOptions, {page}) => {
																			dispatch(sagaGetPartEditors({page}));
																			const res = await new Promise((res, rej) => {
																				setCallbackEditorSelect({callback: (o) => {
																					o.additional = {page: page + 1}
																					res(o);
																				}});
																			});
																			return res;
																		}}
																		onChange={onChange}
																		value={value}
																		additional={{page: 1}}
																		defaultOptions />
											}} />
								<Form.Control.Feedback type="invalid">
									{errors.groups?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>:null}

						<Form.Group as={Row} className="mb-3">
							<Form.Label column sm="2">Sorting</Form.Label>
							<Col sm="5">
								<Form.Select {...register("sortField")} defaultValue={searchParams.get("sortField")} isInvalid={!!errors.sortField} >
									<option value="" selected disabled>Chose field</option>
									{props.sortFields.map((entry, index) => {
										return <option key={index} value={entry}>{entry}</option>
									})}
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{errors.sortField?.message}
								</Form.Control.Feedback>
							</Col>

							<Form.Label column sm="2">type</Form.Label>
							<Col sm="3">
								<Form.Select {...register("sortType")} defaultValue={searchParams.get("sortType")} isInvalid={!!errors.sortType} >
									<option value="" selected disabled>Chose type</option>
									<option value="ASC" >ASC</option>
									<option value="DESC">DESC</option>
								</Form.Select>
								<Form.Control.Feedback type="invalid">
									{errors.sortType?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Row className="justify-content-end">
							<Col sm="auto">
								<Button variant="outline-danger" type="button" onClick={() => {
									navigate('?');
									setValue('groups', []);
									setValue('authors', []);
									setValue('tags', []);
									setValue('titles', []);
									setValue('sortField', null);
									setValue('sortType', null);
								}}>reset</Button>
							</Col>
							<Col sm="auto">
								<Button variant="outline-success" type="submit">filter</Button>
							</Col>
						</Row>
					</Form>
				</Popover.Body>
			</Popover>
		} >
			<Button variant="outline-primary">Filters</Button>
		</OverlayTrigger>
	)
}
