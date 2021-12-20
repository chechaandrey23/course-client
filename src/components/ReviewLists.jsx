import React, { Component, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams, useSearchParams} from "react-router-dom";
import {Container, Row, Col, Button} from 'react-bootstrap';
import {useCookies} from 'react-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useTranslation} from "react-i18next";

import ReviewItem from './ReviewItem';
import PopoverFilterReviews from './PopoverFilterReviews';
import Filler from './Filler';

import {sagaGetReviews, sagaMoreReviews} from '../redux/saga/user.reviews.js';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

const sortFields = [
	'authorRating',
	'averageEditorRating',
	'averageUserRating',
	'countComments',
	'createdAt',
	'updatedAt'
];

export default function ReviewLists() {
	const {t} = useTranslation('components/ReviewLists');
	const [cookies,, removeCookie] = useCookies();
	const reviews = useSelector((state) => state.userReviews.data);
	const reviewsLoading = useSelector((state) => state.userReviews.dataLoading);
	const reviewsMoreLoading = useSelector((state) => state.userReviews.dataMoreLoading);
	const reviewPaginator = useSelector((state) => state.userReviews.paginator);
	const dispatch = useDispatch();

	const [searchParams] = useSearchParams();

	useLayoutEffect(() => {
		dispatch(sagaGetReviews({params: searchParams, isUser: isUser(cookies.Roles)}));
	}, [searchParams]);

	const moreFn = useCallback(() => {
		dispatch(sagaMoreReviews({params: new URLSearchParams(searchParams.toString()+'&page='+reviewPaginator.getPageForQuery()), isUser: isUser(cookies.Roles)}));
	}, [searchParams]);

	return (
		<div>
			<Row><Col>
				<Container className="border border-primary rounded mt-1">
				<Row>
					<Col md="auto" className="mt-3 mb-3">
						<PopoverFilterReviews withAuthors={true} sortFields={sortFields} typeFilter="guest" />
					</Col>
				</Row>
				</Container>
			</Col></Row>
			{reviewsLoading?<Row>
				<Col>
					<Container className="border border-primary rounded mt-1 mb-1">
						<Filler ignorePadding={true} className="rounded" size='4rem' />
						<Row><Col style={{minHeight: '100px'}}></Col></Row>
					</Container>
				</Col>
			</Row>:<Row><Col>
				<InfiniteScroll dataLength={reviews.length}
								next={moreFn}
								scrollThreshold={0.99}
								loader={<Container className="border border-primary rounded mt-1 mb-1">
									<Row className="align-items-center justify-content-center mt-1 mb-1">
										<Col>
											{reviewsMoreLoading?<Filler size="2rem" />:null}
											<Button variant="outline-info" style={{width: '100%'}} onClick={moreFn}>{t('more')}</Button>
										</Col>
									</Row>
								</Container>}
								endMessage={<Container className="border border-primary rounded mt-1 mb-1">
									<Row className="align-items-center justify-content-center mt-1 mb-1">
										<Col>
											{reviewsMoreLoading?<Filler size="2rem" />:null}
											<Button variant="outline-info" style={{width: '100%'}} onClick={moreFn}>{t('more')}</Button>
										</Col>
									</Row>
								</Container>}
								hasMore={(() => {
									if(reviews.length < reviewPaginator.getDefaultCountRows()) {
										return false;
									} else {
										return !(reviews.length % reviewPaginator.getDefaultCountRows())
									}
								})()}>
					{reviews.map((entry) => {
						return <ReviewItem  key={entry.id}
											id={entry.id}
											title={entry.groupTitle?.title?.title}
											group={entry.groupTitle?.group?.group}
											groupId={entry.groupTitle?.group?.id}
											ratings={entry.ratings || []}
											likes={entry.likes || []}
											description={entry.description}
											date={entry.createdAt}
											authorRating={entry.authorRating}
											author={[entry.user?.userInfo?.first_name || t('Unknown'), entry.user?.userInfo?.last_name || t('Unknown')]}/>
					})}
				</InfiniteScroll>
			</Col></Row>}
		</div>
	)
}
