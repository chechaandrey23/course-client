import React, {useRef, useEffect} from "react";
import {Navbar, Nav, Container, Button, Row, Col, Spinner} from 'react-bootstrap';

// props size(width|height), variant, className, ignorePadding
export default function Filler(props) {
	const element = useRef(null);
	
	useEffect(() => {
		let parent = element.current.parentNode;
		
		let parentStyles = window.getComputedStyle(parent);
		let oldPosition = parentStyles.position;
		parent.style.position = 'relative';
		
		let width = (parseInt(parentStyles.width) - (props.ignorePadding?0:(parseInt(parentStyles.paddingRight) + parseInt(parentStyles.paddingLeft))))+'px';
		let height = (parseInt(parentStyles.height) - (props.ignorePadding?0:(parseInt(parentStyles.paddingTop) + parseInt(parentStyles.paddingBottom))))+'px';
		let left = props.ignorePadding?'0px':parentStyles.paddingLeft;
		let top = props.ignorePadding?'0px':parentStyles.paddingTop;
		
		let blur = document.createElement('div');
		blur.style.position = 'absolute';
		blur.style.display = 'block';
		blur.style.width = width;
		blur.style.height = height;
		blur.style.left = left;
		blur.style.top = top;
		
		parent.appendChild(blur);
		blur.style.zIndex = 10;
		blur.style.opacity = '0.2';
		blur.style.backgroundColor = 'orange';
		blur.classList.add(...(props.className?props.className.split(' '):[]));
		
		let spinner = element.current;
		spinner.style.position = 'absolute';
		spinner.style.display = 'block';
		spinner.style.width = width;
		spinner.style.height = height;
		spinner.style.left = left;
		spinner.style.top = top;
		spinner.style.zIndex = 11;
		
		return () => {
			parent.style.position = oldPosition;
			parent.removeChild(blur);
			spinner.style.display = 'none';
		}
	});
	
	return (
		<div ref={element} style={{display: 'none'}} className={(props.className?props.className.toString():'')}>
			<Row style={{height: '100%'}} className="justify-content-center align-items-center">
				<Col sm="auto">
					<Spinner animation="border" style={{width: props.size || 'auto', height: props.size || 'auto'}} variant={props.variant || 'warning'} />
				</Col>
			</Row>
		</div>
	)
}
