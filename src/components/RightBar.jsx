import queryString from 'query-string';
import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import ReactWordcloud from 'react-wordcloud';

import {sagaGetAllTags} from '../redux/saga/user.tags.js';

import Filler from './Filler';

export default function ReviewItem(props) {
	const {t} = useTranslation();
	const tags = useSelector((state) => state.userTags.data);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const loadTags = useSelector((state) => state.userTags.loadTags);

	const wordIndexs = {};
	const words = tags.map((entry) => {wordIndexs[entry.tag] = entry.id; return {value: entry.countReview, text: entry.tag}})

	useEffect(() => {
		dispatch(sagaGetAllTags({order: true}));
	}, []);

	return (
		<div style={{minHeight: '300px', minWidth: '300px'}} className="border border-primary rounded mt-1 mb-1">
			{loadTags?<Filler ignorePadding={false} size='4.5rem' />:null}
			<ReactWordcloud words={words}
							options={{
								rotations: 2,
								rotationAngles: [0, 0],
							}}
							callbacks={{
								getWordTooltip: (word) => {return '';/*`Matches found for tag ${word.text} - ${word.value}`*/},
								onWordClick: (word, event) => {
									navigate('/reviews'+'?'+queryString.stringify({tags: [wordIndexs[word.text]]}, {arrayFormat: 'bracket'}));
								},
								onWordMouseOut: (word, event) => {
									event.target.setAttribute('font-size', (Number.parseInt(event.target.getAttribute('font-size')) / 2) + 'px');
									event.target.setAttribute('text-decoration', 'none');
								},
								onWordMouseOver: (word, event) => {
									event.target.setAttribute('font-size', (Number.parseInt(event.target.getAttribute('font-size')) * 2) + 'px');
									event.target.setAttribute('text-decoration', 'underline');
								}
							}}
							size={[300, 300]} />
		</div>
	)
}
