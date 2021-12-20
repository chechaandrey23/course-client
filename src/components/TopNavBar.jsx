import React, {useCallback, useEffect} from "react";
import {Routes, Route, Link, useNavigate, useLocation} from "react-router-dom";
import {useSelector, useDispatch } from 'react-redux';
import {Navbar, Nav, Container, Button, Badge, Row, Col} from 'react-bootstrap';
import {useCookies} from 'react-cookie';
import {useTranslation} from "react-i18next";

import {isUser, isEditor, isAdmin} from '../helpers/roles.js';

import {sagaLogout, sagaGetUser} from '../redux/saga/user.user.js';
import {logout as logoutAC} from '../redux/user.user.js';

export default function TopNavBar() {
	const {t} = useTranslation('components/TopNavBar');
	const [cookies, setCookie, removeCookie] = useCookies();
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

	 useEffect(() => {
		 if(user && user.userInfo) {
			setCookie('Lang', user.userInfo?.lang?.lang);
			setCookie('Theme', user.userInfo?.theme?.theme);
		 }
	 }, [user]);

	let name = `${user.userInfo?.first_name+''} ${user.userInfo?.last_name+''}`;
	if(name.length > 15) name = name.substring(0, 15)+'...';

	return (
		<Navbar variant="light" expand="lg" className="border border-primary rounded">
			<Container>
				<Navbar.Brand href="/">{t('What to play? look? read?')}</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Item><Link className="nav-link" to="/reviews">{t('Reviews')}</Link></Nav.Item>
						{isEditor(cookies.Roles)?<Nav.Item><Link className="nav-link" to="/my-reviews">{t('MyReviews')}</Link></Nav.Item>:<></>}
					</Nav>
					<Nav className="align-items-center">
						{isAdmin(cookies.Roles)?<Nav.Item><Nav.Link href="/admin">{t('ADMIN-PANEL')}</Nav.Link></Nav.Item>:<></>}
						{(!isAdmin(cookies.Roles)&&!isEditor(cookies.Roles)&&!isUser(cookies.Roles))?(<>
							<Nav.Item><Link className="nav-link" to="/registration">{t('Registration')}</Link></Nav.Item>
							<Nav.Item><Link className="nav-link" to="/login">{t('LogIn')}</Link></Nav.Item>
						</>):(<>
							<Nav.Item><Link className="nav-link" to="/user">[{name}]<Badge bg="success">
								{likes} {(likes<1 || likes>4)?t('Likes'):(likes===1?t('Like'):t('Like2'))}
							</Badge></Link></Nav.Item>
							<Nav.Item><Button variant="outline-danger" onClick={logOutFn}>{t('LogOut')}</Button></Nav.Item>
						</>)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}
