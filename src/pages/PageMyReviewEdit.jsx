import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import MyReviewFullEdit from '../components/MyReviewFullEdit';
import SearchBar from '../components/SearchBar';

export default function PageMyReviewEdit() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<MyReviewFullEdit />
		</Container>
	)
}
