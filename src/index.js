import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store.js'
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from 'react-cookie';

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<BrowserRouter>
				<Provider store={store}>
					<App />
				</Provider>
			</BrowserRouter>
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
