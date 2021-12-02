import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {errorRegistration, registration as registrationAC} from '../redux/user.user.js';
import {sagaRegistration} from '../redux/saga/user.user.js';

const validationSchema = Yup.object().shape({
	user: Yup.string().required('Username is required')
		.min(4, 'Username must be at least 4 characters')
		.max(20, 'Username must not exceed 20 characters'),
	password: Yup.string().required('Password is required')
		.min(6, 'Password must be at least 6 characters')
		.max(40, 'Password must not exceed 40 characters'),
	password2: Yup.string().required('Password2 is required')
		.min(6, 'Password2 must be at least 6 characters')
		.max(40, 'Password2 must not exceed 40 characters')
		.oneOf([Yup.ref('password'), null], 'Passwords must match'),
	email: Yup.string().required('Email is required')
		.min(6, 'Email must be at least 6 characters')
		.max(40, 'Email must not exceed 40 characters')
		.email('Invalid Email'),
	first_name: Yup.string(),
	last_name: Yup.string(),
});

export default function LogIn(props) {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const error = useSelector((state) => state.userUser.errorRegistration);
	const registration = useSelector((state) => state.userUser.registration);
	
	const {register, handleSubmit, watch, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});
	
	useEffect(() => {
		if(registration) {
			navigate('/user');
			dispatch(registrationAC(false));
		}
	}, [registration]);
	
	return (
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			<Row className="mt-2">
				<Col>
					{error?<Alert variant="danger" onClose={() => {dispatch(errorRegistration(false))}} dismissible>
						<Alert.Heading>Server Error Message</Alert.Heading>
						<p>{error.data.reason}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto">
					<h4>Registration</h4>
				</Col>
			</Row>
			<Row className="mb-2">
				<Col>
					<Form onSubmit={handleSubmit((data) => {dispatch(sagaRegistration(data))})}>
						<Form.Group as={Row} className="mb-3" controlId="formBasicFullName">
							<Form.Label column sm="2">Password</Form.Label>
							<Col sm="5">
								<Form.Control {...register("first_name")} type="text" placeholder="First name" isInvalid={!!errors.first_name} />
								<Form.Control.Feedback type="invalid">
									{errors.first_name?.message}
								</Form.Control.Feedback>
							</Col>
							<Col sm="5">
								<Form.Control {...register("last_name")} type="text" placeholder="Last name" isInvalid={!!errors.last_name} />
								<Form.Control.Feedback type="invalid">
									{errors.last_name?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicUsername">
							<Form.Label column sm="2">User login</Form.Label>
							<Col sm="10">
								<Form.Control {...register("user")} type="text" placeholder="Enter login" isInvalid={!!errors.user} />
								<Form.Control.Feedback type="invalid">
									{errors.user?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
							<Form.Label column sm="2">Email</Form.Label>
							<Col sm="10">
								<Form.Control {...register("email")} type="email" placeholder="email@email" isInvalid={!!errors.email} />
								<Form.Control.Feedback type="invalid">
									{errors.email?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
							<Form.Label column sm="2">Password</Form.Label>
							<Col sm="5">
								<Form.Control {...register("password")} type="password" placeholder="Password" isInvalid={!!errors.password} />
								<Form.Control.Feedback type="invalid">
									{errors.password?.message}
								</Form.Control.Feedback>
							</Col>
							<Col sm="5">
								<Form.Control {...register("password2")} type="password" placeholder="Password 2" isInvalid={!!errors.password2} />
								<Form.Control.Feedback type="invalid">
									{errors.password2?.message}
								</Form.Control.Feedback>
							</Col>
						</Form.Group>
						<Row className="justify-content-center">
							<Col md="auto">
								<Button variant="outline-primary" type="submit">Registration</Button>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}
