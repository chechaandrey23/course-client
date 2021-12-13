import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {Container, Row, Col, Button, Modal, Form} from 'react-bootstrap';
import {useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";

import ReviewCommentRemove from './ReviewCommentRemove';
import ReviewCommentEdit from './ReviewCommentEdit';
import Filler from './Filler';

export default function ReviewCommentItem(props) {
	const {t} = useTranslation();

	const user = useSelector((state) => state.userUser.user);

	const commentProcessing = useSelector((state) => state.userComments.commentProcessing);

	return (<Row className="border border-primary rounded bg-light mt-1 mb-1 pt-2 pb-2">
		{(commentProcessing.includes(props.id))?<Filler ignorePadding={true} size='4.5rem' />:null}
		<Col><span className="text-secondary">{props.author[0]} {props.author[1]}</span></Col>
		<Col sm="auto">
			{(user.id == props.authorId)?<ReviewCommentEdit id={props.id} comment={props.comment} reviewId={props.reviewId} />:null}
		</Col>
		<Col sm="auto">
			{(user.id == props.authorId)?<ReviewCommentRemove id={props.id} />:null}
		</Col>
		<Col sm="12"><span>{props.comment}</span></Col>
		<Col sm="12"><span className="text-secondary">{t('intlDateTime', {val: new Date(props.date)})}</span></Col>
	</Row>);
}
