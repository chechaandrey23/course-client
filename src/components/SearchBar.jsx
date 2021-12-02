import React, { Component, useRef, useLayoutEffect, useEffect } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link} from "react-router-dom";
import {Container, Row, Col, Button} from 'react-bootstrap';

export default function ReviewLists() {
	
	return (
		<Container className="border border-primary rounded bg-light mt-1">
			<Row>
				<Col className="mt-3 mb-3">
					<Row className="justify-content-end">
						<Col><input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" /></Col>
						<Col sm="auto"><button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button></Col>
					</Row>
				</Col>
			</Row>
		</Container>
	)
}
