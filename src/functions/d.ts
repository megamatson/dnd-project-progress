import _ from "lodash";

export default function d(n: number) {
	return _.random(1, n, false);
}