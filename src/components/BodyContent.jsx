import React from "react";
import {Routes, Route, Link} from "react-router-dom";
import {Navbar, Nav, Container, Button, Row, Col} from 'react-bootstrap';

export default function BodyContent(props) {

	return (
		<Row>
			<Col style={{paddingRight: '.125rem'}}>{props.content}{props.addContent?props.addContent:null}</Col>
			<Col md="auto" style={{paddingLeft: '.125rem'}}>{props.rightbar}</Col>
		</Row>
	)
}
