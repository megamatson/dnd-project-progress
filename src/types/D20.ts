import _ from "lodash";

type D20 = 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20

export function clamp(n: number): D20 {
	if (_.isNaN(n))
		throw new Error('NaN');

	return _.clamp(Math.round(n), 1, 20) as D20;
}

export default D20;