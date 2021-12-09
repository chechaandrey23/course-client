import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import BodyContent from '../components/BodyContent';
import SearchReviewLists from '../components/SearchReviewLists';
import RightBar from '../components/RightBar';
import SearchBar from '../components/SearchBar';

export default function PageReviews() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<BodyContent content={<SearchReviewLists />} rightbar={<RightBar />} />
		</Container>
	)
}
