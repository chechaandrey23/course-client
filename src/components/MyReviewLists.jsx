import React, { Component, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams, useNavigate, useSearchParams} from "react-router-dom";
import {Container, Row, Col, Button, Table, Popover, OverlayTrigger} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useTranslation} from "react-i18next";

import PopoverFilterReviews from './PopoverFilterReviews';
import MyReviewRow from './MyReviewRow';
import Filler from './Filler';

import {sagaGetReviews, sagaMoreReviews} from '../redux/saga/editor.reviews.js';
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
	const {t} = useTranslation('components/MyReviewLists');
	const reviews = useSelector((state) => state.editorReviews.data);
	const loadReviews = useSelector((state) => state.editorReviews.dataLoading);
	const reviewsMoreLoading = useSelector((state) => state.editorReviews.dataMoreLoading);
	const reviewPaginator = useSelector((state) => state.editorReviews.paginator);
	const dispatch = useDispatch();
	const params = useParams();
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();

	useLayoutEffect(() => {
		dispatch(sagaGetReviews({params: searchParams}));
	}, [searchParams]);

	const moreFn = useCallback(() => {
		dispatch(sagaMoreReviews({params: new URLSearchParams(searchParams.toString()+'&page='+reviewPaginator.getPageForQuery())}));
	}, [searchParams]);

	return (
		<div className="border border-primary rounded mt-1 mb-1">
			<Table striped bordered hover className="rounded mb-0">
				<thead>
					<tr>
						<td colSpan="12">
							<PopoverFilterReviews withAuthors={false} sortFields={sortFields} typeFilter="editor" />
						</td>
						<td className="text-center" colSpan="3">
							<Link to="/my-review-new" className="btn btn-outline-success">{t('Create')}</Link>
						</td>
					</tr>
					<tr>
						<th className="text-center">{t('#')}</th>
						<th className="text-center">{t('id')}</th>
						<th className="text-center">{t('Group')}</th>
						<th className="text-center">{t('Title')}</th>
						<th className="text-center">{t('AR')}</th>
						<th className="text-center">{t('AAR')}</th>
						<th className="text-center">{t('AUR')}</th>
						<th className="text-center">{t('comms')}</th>
						<th className="text-center">{t('tags')}</th>
						<th className="text-center">{t('description')}</th>
						<th className="text-center">{t('draft')}</th>
						<th className="text-center">{t('ban')}</th>
						<th className="text-center" colSpan="3">{t('actions')}</th>
					</tr>
				</thead>
				<tbody>
					{loadReviews?<tr><td colSpan="15"><div style={{minHeight: '300px'}}>
						<Filler ignorePadding={true} size="6rem" />
					</div></td></tr>:reviews.map((entry, index) => {
						return <MyReviewRow entry={entry} index={index} key={index} />
					})}
				</tbody>
				<tfoot>
					<tr><td colSpan="15"><div>
						{reviewsMoreLoading?<Filler size="2rem" />:null}
						<Button variant="outline-info" style={{width: '100%'}} onClick={moreFn}>{t('more')}</Button>
					</div></td></tr>
				</tfoot>
			</Table>
		</div>
	)
}
