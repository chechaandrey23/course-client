import React, {useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {useCookies} from 'react-cookie';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import TopNavBar from '../components/TopNavBar';
import BodyContent from '../components/BodyContent';
import ReviewFull from '../components/ReviewFull';
import RightBar from '../components/RightBar';
import SearchBar from '../components/SearchBar';
import ReviewComments from '../components/ReviewComments';

export default function PageReview() {
	const [cookies,, removeCookie] = useCookies();

	return (
		<Container>
			<TopNavBar />
			<SearchBar />
			<BodyContent content={<ReviewFull />} addContent={isUser(cookies.Roles)?<ReviewComments />:null} rightbar={<RightBar />} />
		</Container>
	)
}
