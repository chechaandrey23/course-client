import queryString from 'query-string';
import strictUriEncode from 'strict-uri-encode';
import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import {Container, Row, Col, Button, Form} from 'react-bootstrap';
import {useForm, useController, Controller} from 'react-hook-form';
import {useSearchParams, useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
	search: Yup.string().required('Query is required')
		.min(3, 'Query must be at least 3 characters')
		.max(255, 'Query must not exceed 255 characters')
});

export default function SearchBar() {
	const {t} = useTranslation('components/SearchBar');
	const navigate = useNavigate();
	const {register, handleSubmit, setValue, control, reset, formState: {errors}} = useForm({resolver: yupResolver(validationSchema)});

	const params = useParams();

	return (
		<Container className="border border-primary rounded mt-1">
			<Row>
				<Col className="mt-3 mb-3">
					<Form onSubmit={handleSubmit((data) => {
						navigate('/search/'+strictUriEncode(data.search));
					})}>
						<Form.Group as={Row}>
							<Col>
								<Form.Control {...register("search")} defaultValue={params.query} type="text" placeholder={t('Enter query')} isInvalid={!!errors.search} />
								<Form.Control.Feedback type="invalid">
									{t(errors.search?.message)}
								</Form.Control.Feedback>
							</Col>
							<Col sm="auto">
								<Button variant="outline-primary" type="submit">{t('Search')}</Button>
							</Col>
						</Form.Group>
					</Form>
				</Col>
			</Row>
		</Container>
	)
}
