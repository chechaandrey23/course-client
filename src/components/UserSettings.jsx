import React, {Component, useRef, useLayoutEffect, useEffect, useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Tabs, Tab} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Filler from './Filler';

import {sagaGetAllLangs} from '../redux/saga/user.langs.js';
import {sagaGetAllThemes} from '../redux/saga/user.themes.js';
import {errorSetUser} from '../redux/user.user.js';
import {sagaSetUser} from '../redux/saga/user.user.js';

const validationSchema = Yup.object().shape({
	first_name: Yup.string(),
	last_name: Yup.string(),
	langId: Yup.number().required('lang ID is required'),
	themeId: Yup.number().required('Theme ID is required')
});

export default function UserSettings(props) {
	const {t} = useTranslation();
	const [firstRender, setFirstRender] = useState(true);
	const dispatch = useDispatch();
	const user = useSelector((state) => state.userUser.user);
	const loadGetUser = useSelector((state) => state.userUser.loadGetUser);
	const error = useSelector((state) => state.userUser.errorSetUser);
	const loadSetUser = useSelector((state) => state.userUser.loadSetUser);

	const langs = useSelector((state) => state.userLangs.langs);
	const loadLangs = useSelector((state) => state.userLangs.loadLangs);
	const themes = useSelector((state) => state.userThemes.themes);
	const loadThemes = useSelector((state) => state.userThemes.loadThemes);

	const {register, handleSubmit, watch, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

	useLayoutEffect(() => {
		dispatch(sagaGetAllLangs());
		dispatch(sagaGetAllThemes());
		setFirstRender(false);
	}, []);

	return (
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			{(loadGetUser || !user.userInfo)?<Filler ignorePadding={true} className="rounded" size="3.5rem" />:null}
			{loadSetUser?<Filler ignorePadding={true} className="rounded" size="5rem" />:null}
			<Row className="mt-2">
				<Col>
					{error?<Alert variant="danger" onClose={() => {dispatch(errorSetUser(false))}} dismissible>
						<Alert.Heading>Server Error Message</Alert.Heading>
						<p>{error.data.reason || error.data.message}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto">
					<h4>User Settings</h4>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<Form onSubmit={handleSubmit((data) => {dispatch(sagaSetUser({id: user.userInfo?.id, ...data}))})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicFirstName">
							<Form.Label column sm="2">First name</Form.Label>
							<Col sm="7">
								{(!firstRender && !loadGetUser && user.userInfo)?<Form.Control {...register("first_name")} defaultValue={user.userInfo.first_name} type="text" placeholder="Enter first name" isInvalid={!!errors.first_name} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.first_name?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicLastName">
							<Form.Label column sm="2">Last name</Form.Label>
							<Col sm="7">
								{(!firstRender && !loadGetUser && user.userInfo)?<Form.Control {...register("last_name")} defaultValue={user.userInfo.last_name} type="text" placeholder="Enter last name" isInvalid={!!errors.last_name} />:null}
								<Form.Control.Feedback type="invalid">
									{errors.last_name?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicLang">
							<Form.Label column sm="2">Language</Form.Label>
							<Col sm="7">
								{loadLangs?<Filler size="1.25rem" />:null}
								{(!firstRender && !loadLangs && user.userInfo)?<Form.Select {...register("langId")} defaultValue={user.userInfo.langId} isInvalid={!!errors.lang}>
									{langs.map((entry, index) => {
										return <option key={index} value={entry.id}>{entry.title}</option>
									})}
								</Form.Select>:null}
								<Form.Control.Feedback type="invalid">
									{errors.lang?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicTheme">
							<Form.Label column sm="2">Theme</Form.Label>
							<Col sm="7">
								{loadThemes?<Filler size="1.25rem" />:null}
								{(!firstRender && !loadThemes && user.userInfo)?<Form.Select {...register("themeId")} defaultValue={user.userInfo.themeId} isInvalid={!!errors.theme}>
									{themes.map((entry, index) => {
										return <option key={index} value={entry.id}>{entry.title}</option>
									})}
								</Form.Select>:null}
								<Form.Control.Feedback type="invalid">
									{errors.theme?.message}
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
