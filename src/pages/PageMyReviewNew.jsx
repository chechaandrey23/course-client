import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import MyReviewFullNew from '../components/MyReviewFullNew';
import SearchBar from '../components/SearchBar';

export default function PageMyReviewNew() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<MyReviewFullNew />
		</Container>
	)
}
