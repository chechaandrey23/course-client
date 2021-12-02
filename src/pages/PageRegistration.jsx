import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import Registration from '../components/Registration';
import SearchBar from '../components/SearchBar';

export default function PageReview() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<Registration />
		</Container>
	)
}
