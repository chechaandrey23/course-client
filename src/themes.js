import Cookies from 'js-cookie';

const themeMap = {
	slate: 'themes/bootstrap.slate.min.css',
	solar: 'themes/bootstrap.solar.min.css',
	sketchy: 'themes/bootstrap.sketchy.min.css',
	lumen: 'themes/bootstrap.lumen.min.css'
};

export function getCurrentTheme() {
	return currentTheme;
}

export function changeTheme(theme) {
	if(theme !== currentTheme) {
		removeTheme(currentTheme);
		if(theme && themeMap.hasOwnProperty(theme)) {
			addTheme(theme, themeMap[theme]);
			currentTheme = theme;
		}
	}
}

const storage = {};
//let currentTheme = Cookies.get('Theme') || 'default';
let currentTheme = null;

function addTheme(namespace, url) {console.log('add theme', namespace, url)
	const link = document.createElement('link');
	//link.setAttribute('rel', 'preload');
	link.setAttribute('rel', 'stylesheet');
	//link.setAttribute('as', 'style');
	link.setAttribute('type', 'text/css');
	link.setAttribute('href', url);
	//link.setAttribute('media', `(prefers-color-scheme: ${namespace})`);
	//link.onload = (e) => {e.target.rel='stylesheet';}
	document.documentElement.children[0].appendChild(link);
	storage[namespace] = link;
}

function removeTheme(namespace) {
	const link = storage[namespace];
	if(link) document.documentElement.children[0].removeChild(link);
	delete storage[namespace];
}
