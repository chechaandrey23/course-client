import React, { Component, useRef, useLayoutEffect, useEffect, useState, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {PluginProps} from 'react-markdown-editor-lite';

import {showModalImage, hideModalImage, setURLImageToInsert} from '../redux/editor.images.js';

export default function MarkdownImages(props) {
	//const [num, setNum] = React.useState(props.config.start);
	const modalImages = useSelector(state => state.editorImages.modalImages);
	const urlImageToInsert = useSelector(state => state.editorImages.urlImageToInsert);
	const dispatch = useDispatch();

	useEffect(() => {
		if(urlImageToInsert && urlImageToInsert.url && urlImageToInsert.key === props.editor) {
			props.editor.insertText(`![This is an image](${urlImageToInsert.url})`);
			dispatch(setURLImageToInsert({key: props.editor, url: null}));
			dispatch(hideModalImage())
		}
	}, [urlImageToInsert]);

	useEffect(() => {
		dispatch(setURLImageToInsert({key: props.editor, url: null}));
	}, []);

	return (<span className="button" title="Custom Images" onClick={() => {
		dispatch(setURLImageToInsert({key: props.editor, url: null}));
		dispatch(showModalImage());
	}}>images</span>);
}
// Define default config if required
MarkdownImages.defaultConfig = {}
MarkdownImages.align = 'left';
MarkdownImages.pluginName = 'custom extends images';
