import { url } from './http';

const checkAuth = (userName) => {
	return fetch(`${url}/checkAuth?userName=${userName}`, {
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((res) => res.json()).then(data => {

		if (data.errMsg) {
			// debugger
			// message.error(data.errMsg);
		}

		return data
	})
}

export { checkAuth }