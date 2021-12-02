import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import {useCookies} from 'react-cookie';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import ReviewRating from './ReviewRating';
import ReviewLike from './ReviewLike';

export default function ReviewItem(props) {
	const {t} = useTranslation();
	const [cookies,, removeCookie] = useCookies();

	return (
		<Container className="border border-primary rounded bg-light mt-1 mb-1">
			<Row className="align-items-center mt-1 mb-1">
				<Col>
					<span className="h6">{props.group}</span>
					<span> / </span>
					<Link to={"/review/"+props.id}><span className="h6">{props.title}</span></Link>
				</Col>
				<Col md="auto">
					{isUser(cookies.Roles)?<ReviewRating data={props.ratings} reviewId={props.id} />:null}
				</Col>
				<Col md="auto">
					{isUser(cookies.Roles)?<ReviewLike data={props.likes} reviewId={props.id} />:null}
				</Col>
			</Row>
			<Row>
				<Col sm="3">
					<Row className="float-start border border-primary rounded row-cols-1 text-center" style={{marginRight: '5px'}}>
						<Col className="text-info"><h1>{props.authorRating}</h1></Col>
						<Col><span className="text-secondary">{props.author[0]} {props.author[1]}</span></Col>
					</Row>
				</Col>
				<Col><ReactMarkdown>{props.description}</ReactMarkdown></Col>
			</Row>
			<Row className="align-items-center mt-1 mb-1">
				<Col><span className="text-secondary">{t('intlDateTime', {val: new Date(props.date)})}</span></Col>
				<Col md="auto">
					<Link to={"/review/"+props.id}><span className="h6">full review</span></Link>
				</Col>
			</Row>
		</Container>
	)
}
