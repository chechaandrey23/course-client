export function unique(array) {
	return array.filter(onlyUnique);
}

function onlyUnique(value, index, self) {
	return self.lastIndexOf(value) === index;
}
