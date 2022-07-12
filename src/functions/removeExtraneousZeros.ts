export default function removeExtraneousZeros(v: number | string): string {
	v = "" + v;

	if (v.indexOf('.') !== -1)
		v = v.replace(/0+$/, '').replace(/\.$/, '');

	return v;
}