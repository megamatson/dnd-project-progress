import _ from "lodash";

type Advantage = 'normal'|'advantage'|'disadvantage';

export function cast(s: any): Advantage {
	if (_.isString(s)) {
		if (s === 'advantage' || s === 'disadvantage')
			return s;

		return 'normal';
	} else if (s === true)
		return 'advantage';
	else
		return 'normal';
}


export default Advantage;