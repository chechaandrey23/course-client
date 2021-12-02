import React, {Component, useRef, useLayoutEffect, useEffect, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Dropzone from 'react-dropzone'
import {Container, Row, Col, Button, Form, Alert, Modal, Tabs, Tab, Image, ProgressBar} from 'react-bootstrap';

import {sagaNewImage} from '../redux/saga/editor.images.js';
import {selectedImageUploadAC, selectedImageInsertAC, errorNewImageAC, progressLoadNewImageAC} from '../redux/editor.images.js';

export default function ImageUpload() {
	const selectedImageUpload = useSelector(state => state.editorImages.selectedImageUpload);
	const selectedImageInsert = useSelector(state => state.editorImages.selectedImageInsert);
	const errorNewImage = useSelector(state => state.editorImages.errorNewImage);
	const progressLoadNewImage = useSelector(state => state.editorImages.progressLoadNewImage);
	const loadNewImage = useSelector(state => state.editorImages.loadNewImage);
	const newImage = useSelector(state => state.editorImages.newImage);
	const dispatch = useDispatch();

	useEffect(() => {
		if(newImage.length > 0 && selectedImageUpload) {
			dispatch(selectedImageInsertAC(newImage[0]));
		}
	}, [newImage]);

	//useEffect(() => {
	//	dispatch(progressLoadNewImageAC(0));
	//}, [errorNewImage]);

	const uploadFn = useCallback(() => {
		const formData = new FormData();
		formData.append("images[]", selectedImageUpload);
		dispatch(sagaNewImage({data: formData, progress: (e) => {
			dispatch(progressLoadNewImageAC(Math.round((100 * e.loaded) / e.total)));
		}}));
		dispatch(progressLoadNewImageAC(0));
	})

	return selectedImageUpload?(<div>
			<Row>
				<Col>{errorNewImage?<Alert variant="danger" onClose={() => dispatch(errorNewImageAC(false))} dismissible>
						<Alert.Heading>Server Error Message</Alert.Heading>
						<p>{errorNewImage.data.message || errorNewImage.data.reason}</p>
					</Alert>:null}
				</Col>
			</Row>
			<Row className="justify-content-center">
				<Col sm="auto"><Image src={URL.createObjectURL(selectedImageUpload)} style={{height: '250px'}} fluid /></Col>
			</Row>
			<Row className="align-items-center justify-content-center" style={{height: '50px'}}>
				{loadNewImage?<Col>
					<ProgressBar animated variant="info" now={progressLoadNewImage} />
				</Col>:(!selectedImageInsert?<Col sm="auto">
					<Button variant="outline-info" onClick={uploadFn}>Upload</Button>
				</Col>:<Col sm="auto">
					<h2>Upload complete</h2>
				</Col>)}
			</Row>
		</div>):(<Dropzone onDrop={acceptedFiles => {
			dispatch(selectedImageUploadAC(acceptedFiles[0]));
		}}>
			{({getRootProps, getInputProps}) => (
				<section>
					<div {...getRootProps({})}>
						<input {...getInputProps({multiple: false, accept: 'image/*'})} />
						<Row className="justify-content-center align-items-center border border-secondary border-1 bg-info rounded" style={{cursor: 'pointer', height: '300px'}}>
							<Col sm="auto">
								<span className="h3 text-light">Drag 'n' drop some files here, or click to select files</span>
							</Col>
						</Row>
					</div>
				</section>
			)}
		</Dropzone>);
}
