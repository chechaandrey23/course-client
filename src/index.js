import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store.js'
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from 'react-cookie';
//import {ThemeSwitcherProvider} from 'react-css-theme-switcher';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import './i18n.js';

//import {setDefaultTheme} from './themes.js';

//setDefaultTheme();

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			{/*<ThemeSwitcherProvider defaultTheme={defaultTheme} themeMap={themeMap}>*/}
				<BrowserRouter>
					<Provider store={store}>
						<App />
					</Provider>
				</BrowserRouter>
			{/*</ThemeSwitcherProvider>*/}
		</CookiesProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
