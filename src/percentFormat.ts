import removeExtraneousZeros from "./removeExtraneousZeros";

export default function percentFormat(n: number): string {
	let ret = (n * 100).toFixed(2);
	return removeExtraneousZeros(ret) + '%';
}