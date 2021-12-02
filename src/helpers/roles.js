export function isUser(role) {
	role = Array.isArray(role)?role:[role];
	return role.includes(1);
}

export function isGuest(role) {
	role = Array.isArray(role)?role:[role];
	return role.includes(0);
}

export function isEditor(role) {
	role = Array.isArray(role)?role:[role];
	return role.includes(2);
}

export function isAdmin(role) {
	role = Array.isArray(role)?role:[role];
	return role.includes(3);
}
