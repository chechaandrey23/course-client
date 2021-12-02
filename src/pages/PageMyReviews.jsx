import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import MyReviewLists from '../components/MyReviewLists';
import SearchBar from '../components/SearchBar';

export default function PageReviews() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<MyReviewLists />
		</Container>
	)
}
