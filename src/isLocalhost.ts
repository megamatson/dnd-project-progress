export default function isLocalhost(
	location: string = window.location.hostname
) {
	return location.startsWith('localhost') || location.startsWith('127.0.0.1');
}