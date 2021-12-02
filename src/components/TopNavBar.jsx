import React, {useCallback, useEffect} from "react";
import {Routes, Route, Link, useNavigate, useLocation} from "react-router-dom";
import {useSelector, useDispatch } from 'react-redux';
import {Navbar, Nav, Container, Button, Badge, Row, Col} from 'react-bootstrap';
import {useCookies} from 'react-cookie';

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import {sagaLogout, sagaGetUser} from '../redux/saga/user.user.js';
import {logout as logoutAC} from '../redux/user.user.js';

export default function TopNavBar() {
	const [cookies,, removeCookie] = useCookies();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const logout = useSelector((state) => state.userUser.logout);
	const user = useSelector((state) => state.userUser.user);
	const likes = useSelector((state) => state.userLikes.likes);

	const logOutFn = useCallback(() => {dispatch(sagaLogout())}, []);

	useEffect(() => {
		if(logout) {
			navigate('/');
			dispatch(logoutAC());
			removeCookie('Roles');
		}
	}, [logout]);

	useEffect(() => {
		if(isAdmin(cookies.Roles) || isEditor(cookies.Roles) || isUser(cookies.Roles)) dispatch(sagaGetUser());
	}, []);

	let name = `${user.userInfo?.first_name+''} ${user.userInfo?.last_name+''}`;
	if(name.length > 15) name = name.substring(0, 15)+'...';

	return (
		<Navbar bg="light" variant="light" expand="lg" className="border border-primary rounded">
			<Container>
				<Navbar.Brand href="/">What to play? look? read?</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Item><Link className="nav-link" to="/reviews">Reviews</Link></Nav.Item>
						{isEditor(cookies.Roles)?<Nav.Item><Link className="nav-link" to="/my-reviews">MyReviews</Link></Nav.Item>:<></>}
					</Nav>
					<Nav>
						{isAdmin(cookies.Roles)?<Nav.Item><Nav.Link href="/admin">ADMIN-PANEL</Nav.Link></Nav.Item>:<></>}
						{(!isAdmin(cookies.Roles)&&!isEditor(cookies.Roles)&&!isUser(cookies.Roles))?(<>
							<Nav.Item><Link className="nav-link" to="/registration">Registration</Link></Nav.Item>
							<Nav.Item><Link className="nav-link" to="/login">Login</Link></Nav.Item>
						</>):(<>
							<Nav.Item><Link className="nav-link" to="/user">[{name}]<Badge bg="success">{likes} Likes</Badge></Link></Nav.Item>
							<Nav.Item><Button variant="outline-danger" onClick={logOutFn}>LogOut</Button></Nav.Item>
						</>)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
