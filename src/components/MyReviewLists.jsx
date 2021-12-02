import React, { Component, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams, useNavigate, useSearchParams} from "react-router-dom";
import {Container, Row, Col, Button, Table, Popover, OverlayTrigger} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import PopoverFilterReviews from './PopoverFilterReviews';
import MyReviewRow from './MyReviewRow';

import {sagaGetReviews, sagaNewReview} from '../redux/saga/editor.reviews.js';
import {newReview as newReviewAC} from '../redux/editor.reviews.js';

const sortFields = [
	'authorRating',
	'averageEditorRating',
	'averageUserRating',
	'countComments',
	'createdAt',
	'draft',
	'updatedAt'
];

export default function MyReviewLists() {
	const reviews = useSelector((state) => state.editorReviews.data);
	const newReview = useSelector((state) => state.editorReviews.newReview);
	const loadReviews = useSelector((state) => state.editorReviews.dataLoading);
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	useEffect(() => {
		dispatch(sagaGetReviews(searchParams));
	}, [searchParams]);

	const createReview = useCallback(() => {dispatch(sagaNewReview())});

	useEffect(() => {
		if(newReview) {
			navigate('/my-review-edit/'+newReview.id);
			dispatch(newReviewAC(false));
		}
	}, [newReview]);

	return (
		<div className="border border-primary rounded bg-light mt-1 mb-1">
			<Table striped bordered hover className="rounded mb-0">
				<thead>
					<tr>
						<td colSpan="10">
							<PopoverFilterReviews withAuthors={false} sortFields={sortFields} typeFilter="editor" />
						</td>
						<td className="text-center" colSpan="3">
							<Button variant="outline-success" onClick={createReview}>Create</Button>
						</td>
					</tr>
					<tr>
						<th className="text-center">#</th>
						<th className="text-center">Group</th>
						<th className="text-center">Title</th>
						<th className="text-center">AR</th>
						<th className="text-center">AAR</th>
						<th className="text-center">AUR</th>
						<th className="text-center">comms</th>
						<th className="text-center">tags</th>
						<th className="text-center">description</th>
						<th className="text-center">draft</th>
						<th className="text-center" colSpan="3">actions</th>
					</tr>
				</thead>
				<tbody>
					{reviews.map((entry, index) => {
						return <MyReviewRow entry={entry} imdex={index} key={index} />
					})}
				</tbody>
			</Table>
		</div>
	)
}
