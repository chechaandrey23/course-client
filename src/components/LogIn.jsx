import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {useNavigate, Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Nav} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {errorLogin, login as loginAC} from '../redux/user.user.js';
import {sagaLogin} from '../redux/saga/user.user.js';

const validationSchema = Yup.object().shape({
	user: Yup.string().required('Username is required')
		.min(4, 'Username must be at least 4 characters')
		.max(20, 'Username must not exceed 20 characters'),
	password: Yup.string().required('Password is required')
		.min(6, 'Password must be at least 6 characters')
		.max(40, 'Password must not exceed 40 characters')
});

export default function LogIn(props) {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const error = useSelector((state) => state.userUser.errorLogin);
	const login = useSelector((state) => state.userUser.login);

	useEffect(() => {
		if(login) {
			navigate('/user');
			dispatch(loginAC(false));
		}
	}, [login]);

	const {register, handleSubmit, watch, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

	return (
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			<Row className="mt-2">
				<Col>
					{error?<Alert variant="danger" onClose={() => {dispatch(errorLogin(false))}} dismissible>
						<Alert.Heading>Server Error Message</Alert.Heading>
						<p>{error.data.message || error.data.reason}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto">
					<h4>Authorization</h4>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form onSubmit={handleSubmit((data) => {dispatch(sagaLogin(data))})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
							<Form.Label column sm="2">User login</Form.Label>
							<Col sm="10">
								<Form.Control {...register("user")} type="text" placeholder="Enter login" isInvalid={!!errors.user} />
								<Form.Control.Feedback type="invalid">
									{errors.user?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
							<Form.Label column sm="2">Password</Form.Label>
							<Col sm="10">
								<Form.Control {...register("password")} type="password" placeholder="Password" isInvalid={!!errors.password} />
								<Form.Control.Feedback type="invalid">
									{errors.password?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Row className="justify-content-end">
							<Col md="auto">
								<Button variant="outline-primary" type="submit">LogIn</Button>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
			<Row className="border-top border-primary mt-2 mb-2"></Row>
			<Row className="mb-2 justify-content-center">
				<Col md="auto">
					<a href="/auth/api/github" class="btn btn-outline-success" role="button" aria-pressed="true">logIn with GitHub</a>
				</Col>
			</Row>
		</Container>
	)
}
