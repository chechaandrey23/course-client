import queryString from 'query-string';
import strictUriEncode from 'strict-uri-encode';
import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useForm, useController, Controller} from 'react-hook-form';
import {useSearchParams, useNavigate, useParams} from "react-router-dom";

export default function ReviewLists() {
	const navigate = useNavigate();
	const {register, handleSubmit, setValue, control, reset, formState: {errors}} = useForm(/*{resolver: yupResolver(validationSchema)}*/);

	const params = useParams();

	return (
		<Container className="border border-primary rounded bg-light mt-1">
			<Row>
				<Col className="mt-3 mb-3">
					<Form onSubmit={handleSubmit((data) => {
						navigate('/search/'+strictUriEncode(data.search));
					})}>
						<Form.Group as={Row}>
							<Col>
								<Form.Control {...register("search")} defaultValue={params.query} type="text" placeholder="Search" isInvalid={!!errors.search} />
								<Form.Control.Feedback type="invalid">
									{errors.search?.message}
								</Form.Control.Feedback>
							</Col>
							<Col sm="auto">
								<Button variant="outline-primary" type="submit">Search</Button>
							</Col>
						</Form.Group>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}
