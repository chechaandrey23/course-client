import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Routes, Route, Link, useParams} from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import {Container, Row, Col, Button, Form, Alert, Modal, Tabs, Tab} from 'react-bootstrap';
import {useTranslation} from "react-i18next";
import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {showModalImage, hideModalImage, setURLImageToInsert, selectedImageUploadAC, selectedImageInsertAC} from '../redux/editor.images.js';

import ImageUpload from './ImageUpload';
import ImageLists from './ImageLists';

export default function ModalImages() {
	const [key, setKey] = useState('UploadImage');

	const modalImages = useSelector(state => state.editorImages.modalImages);
	const selectedImageInsert = useSelector(state => state.editorImages.selectedImageInsert);
	const selectedImageUpload = useSelector(state => state.editorImages.selectedImageUpload);
	const urlImageToInsert = useSelector(state => state.editorImages.urlImageToInsert);
	const dispatch = useDispatch();

	return (<>
		<Modal show={modalImages} onHide={() => {dispatch(hideModalImage())}} animation={false} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Tabs activeKey={key} onSelect={(k) => setKey(k)} id="uncontrolled-tab" className="mb-3">
					<Tab eventKey="ImageLists" title="ImageLists">
						<ImageLists />
					</Tab>
					<Tab eventKey="UploadImage" title="UploadImage">
						<ImageUpload />
					</Tab>
				</Tabs>
			</Modal.Body>
			<Modal.Footer className="justify-content-center">
				<Button variant="outline-secondary" onClick={() => {dispatch(hideModalImage())}}>Close</Button>
				<Button variant="outline-secondary" disabled={!selectedImageInsert && !selectedImageUpload} onClick={() => {
					dispatch(selectedImageUploadAC(null));
					dispatch(selectedImageInsertAC(null));
				}}>Reset</Button>
				<Button variant="outline-primary" disabled={!selectedImageInsert} onClick={() => {
					dispatch(selectedImageUploadAC(null));
					dispatch(selectedImageInsertAC(null));
					dispatch(setURLImageToInsert({key: urlImageToInsert.key, url: selectedImageInsert.url}));
				}}>Insert Image</Button>
			</Modal.Footer>
		</Modal>
	</>)
}
