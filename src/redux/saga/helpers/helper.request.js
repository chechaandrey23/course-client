import axios from 'axios';

export function request(opts) {
	opts = opts || {};
	return new Promise((res, rej) => {
		axios(opts).then((response) => {
			res(response);
		}).catch((e) => {
			if(e.response && e.response.status === 401 && opts.JWTRefreshUpdate) {
				axios({
					method: opts.JWTRefreshUpdateMethod || 'GET',
					url: opts.JWTRefreshUpdateURL
				}).then((response) => {
					axios(opts).then((response) => {
						res(response);
					}).catch((e) => {
						rej(getError(e))
					});
				}).catch((e) => {
					rej(getError(e))
				});
			} else {
				rej(getError(e))
			}
		});
	});
}

function getError(e) {
	if(e.response) {
		if(!e.response.data) e.response.data = e;
		return e.response;
	} else if(e.request) {
		if(!e.request.data) e.request.data = e;
		return e.request;
	} else {
		if(!e.data) e.data = e;
		return e;
	}
}
