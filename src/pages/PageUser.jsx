import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';

import TopNavBar from '../components/TopNavBar';
import UserSettings from '../components/UserSettings';
import SearchBar from '../components/SearchBar';

export default function PageReview() {
	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<UserSettings />
		</Container>
	)
}
