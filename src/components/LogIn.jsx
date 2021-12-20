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
	const {t} = useTranslation('components/Login');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const error = useSelector((state) => state.userUser.errorLogin);
	const login = useSelector((state) => state.userUser.login);
	const user = useSelector((state) => state.userUser.user);

	useEffect(() => {
		if(login) {
			navigate('/user');
			dispatch(loginAC(false));
		}
	}, [login]);

	const {register, handleSubmit, watch, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

	useEffect(() => () => {dispatch(errorLogin(false))}, [user]);

	return (
		<Container className="border border-primary rounded mt-1 mb-1">
			<Row className="mt-2">
				<Col>
					{error?<Alert variant="danger" onClose={() => {dispatch(errorLogin(false))}} dismissible>
						<Alert.Heading>{t('Server Error Message')}</Alert.Heading>
						<p>{error.data.message || error.data.reason}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto">
					<h4>{t('Authorization')}</h4>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form onSubmit={handleSubmit((data) => {dispatch(sagaLogin(data))})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
							<Form.Label column sm="2">{t('User login')}</Form.Label>
							<Col sm="10">
								<Form.Control {...register("user")} type="text" placeholder={t('Enter login')} isInvalid={!!errors.user} />
								<Form.Control.Feedback type="invalid">
									{t(errors.user?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
							<Form.Label column sm="2">{t('Password')}</Form.Label>
							<Col sm="10">
								<Form.Control {...register("password")} type="password" placeholder={t('Entre password')} isInvalid={!!errors.password} />
								<Form.Control.Feedback type="invalid">
									{t(errors.password?.message)}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Row className="justify-content-end">
							<Col md="auto">
								<Button variant="outline-primary" type="submit">{t('LogIn')}</Button>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
			<Row className="border-top border-primary mt-2 mb-2"></Row>
			<Row className="mb-2 justify-content-center">
				<Col md="auto">
					<a href="/auth/api/github" className="btn btn-outline-success" role="button" aria-pressed="true">{t('logIn with GitHub')}</a>
				</Col>
				<Col md="auto">
					<a href="/auth/api/facebook" className="btn btn-outline-primary" role="button" aria-pressed="true">{t('logIn with FaceBook')}</a>
				</Col>
				<Col md="auto">
					<a href="/auth/api/google" className="btn btn-outline-warning" role="button" aria-pressed="true">{t('logIn with Google')}</a>
				</Col>
			</Row>
		</Container>
	)
}
