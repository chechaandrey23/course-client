export default class Paginator {
	#countRows = 0;
	#currentPage = 1;
	#lastAddCountRow = 0;

	#appands = 0;

	constructor(defaultCountRows) {
		this.#countRows = defaultCountRows * 1;
	}

	replace(state, stateName, data) {
		if(!Array.isArray(data)) throw new Error('Third argument must be Array');
		this.#currentPage = 1;
		state[stateName] = [...data];
		if(data.length >= this.#countRows) {
			this.#currentPage++;// only 1 page
			this.#lastAddCountRow = 0;
		} else {
			this.#lastAddCountRow = data.length;
		}
	}

	remove(state, stateName, fn) {
		if(typeof fn !== 'function') throw new Error('Third argument must be Function');
		const limit = state[stateName].length - this.#lastAddCountRow;
		let appended = 0;
		state[stateName] = state[stateName].filter((entry, index, array) => {
			const res =  fn(entry, index, array);
			if(res) {
				if(entry.__append__) appended++;
				this.#lastAddCountRow--;
				if(this.#lastAddCountRow < 0) {
					this.#lastAddCountRow = this.#countRows - 1;
					this.#currentPage--;
					if(this.#currentPage < 1) this.#currentPage = 1;
				}
			}
			return res;
		});
		this.#appands -= appended;
	}

	append(state, stateName, data) {
		if(!Array.isArray(data)) throw new Error('Third argument must be Array');
		let appended = 0;
		state[stateName] = [...(data.map((entry) => {
			if(entry) {
				entry.__append__ = true;
				appended++;
			}
			return entry;
		})), ...state[stateName]];
		this.#appands += appended;
	}

	addWithReplace(state, stateName, data) {
		if(!Array.isArray(data)) throw new Error('Third argument must be Array');
		if(this.#lastAddCountRow === 0) {
			state[stateName] = [...state[stateName], ...data];
		} else {
			const end = state[stateName].length - this.#lastAddCountRow;
			state[stateName] = [...state[stateName].slice(0, end<0?0:end), ...data];
		}
		if(data.length >= this.#countRows) {
			this.#currentPage++;// only 1 page
			this.#lastAddCountRow = 0;
		} else {
			this.#lastAddCountRow = data.length;
		}
	}
	/*
	addToEnd(state, stateName, data) {
		if(!Array.isArray(data)) throw new Error('Third argument must be Array');
		state[stateName] = [...state[stateName], ...data];
		this.#lastAddCountRow += data.length;
		if(this.#lastAddCountRow >= this.#countRows) {
			this.#currentPage += Math.floor(this.#lastAddCountRow/this.#countRows);
			this.#lastAddCountRow = this.#lastAddCountRow % this.#countRows;
		}
	}
	*/
	getPageForQuery() {
		return this.#currentPage;
	}

	getDefaultCountRows() {
		return this.#countRows;
	}

	getCountRowsWithoutAppends() {
		return this.#countRows - this.#appands;
	}
}
