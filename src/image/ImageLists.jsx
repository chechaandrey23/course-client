import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Container, Row, Col, Button, Form, Alert, Modal, Tabs, Tab, Image, ProgressBar} from 'react-bootstrap';

import Filler from '../components/Filler';

import {sagaGetPartImages, sagaMorePartImages} from '../redux/saga/editor.images.js';
import {selectedImageUploadAC, selectedImageInsertAC, errorNewImageAC, progressLoadNewImageAC} from '../redux/editor.images.js';

const PAGE_IMAGES = 20;

export default function ImageLists() {
	const [page, setPage] = useState(1);
	const images = useSelector(state => state.editorImages.images);
	const loadImages = useSelector(state => state.editorImages.loadImages);
	const selectedImageInsert = useSelector(state => state.editorImages.selectedImageInsert);
	const loadMoreImages = useSelector(state => state.editorImages.loadMoreImages);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(sagaGetPartImages());
	}, []);

	useEffect(() => {
		if(page * PAGE_IMAGES - PAGE_IMAGES > images.length) setPage(page - 1);
	}, [images]);

	return (
		<Container>
			{loadImages?<Filler size="3.25rem" />:null}
			<Row className="align-items-center">
				{images.map((image, index) => {
					let selClasses = '';
					let selStyles = {}

					if(selectedImageInsert && image.url === selectedImageInsert.url) {
						selClasses = 'border border-warning border-5 bg-warning bg-gradient';
						selStyles = {maxWidth: '181px', maxHeight: '181px'};
					}

					return <Col key={index} sm="auto" className={"text-center"+" "+selClasses} style={{width: '191px', height: '191px', padding: '0px'}}>
						<span><Image src={image.url} style={{...{maxWidth: '191px', maxHeight: '191px'}, ...selStyles}} onClick={() => {
							if(selectedImageInsert && selectedImageInsert.url !== image.url) dispatch(selectedImageUploadAC(null));
							dispatch(selectedImageInsertAC(image));
						}} thumbnail /></span>
					</Col>
				})}
			</Row>
			<Row className="mt-3">
				<Col>
					{loadMoreImages?<Filler size="1.25rem" />:null}
					<Button variant="outline-primary" style={{width: '100%'}} onClick={() => {
						dispatch(sagaMorePartImages({page: page + 1}));
						setPage(page + 1);
					}} >more images</Button>
				</Col>
			</Row>
		</Container>
	);
}
