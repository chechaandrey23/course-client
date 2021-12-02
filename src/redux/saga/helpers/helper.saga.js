//{expName: constName}
export function createActions(obj) {
	return Object.keys(obj || {}).reduce((acc, key) => {
		acc[key] = ((constName) => {
			return (data) => ({type: constName, payload: data});
		})(obj[key]);
		
		return acc;
	}, {});
}

// constName, fn | fn
export function createSagas(arr) {
	return (Array.isArray(arr)?arr:[]).reduce((acc, value) => {
		if(typeof value === 'function') {
			acc.push(value);
		} else if(Array.isArray(value) && typeof value[1] === 'function') {
			acc.push({pattern: value[0]+'', saga: value[1]});
		}
		
		return acc;
	}, []);
}
