import _ from "lodash";
import Advantage from "../types/Advantage";

export default function d(n: number, advantage: Advantage = 'normal'): number {
	if (advantage === 'advantage')
		return Math.max(d(n), d(n));

	else if (advantage === 'disadvantage')
		return Math.min(d(n), d(n));

	else
		return _.random(1, n, false);
}