import _ from "lodash";
import Advantage from "./types/Advantage";

export interface Params {
	dc: number,
	savingThrowMod: number,
	criticals: boolean,
	advantage: Advantage
}

export function numberOfSuccessfulOutcomes({
	dc,
	savingThrowMod,
	criticals,
	advantage
}: Params): number {
	if (!advantage)
		advantage = 'normal';

	const criticalMod = criticals ? 1 : 0;
	let numberToGet = _.clamp(
		dc - savingThrowMod,
		1 + criticalMod,
		21 - criticalMod
	);

	if (advantage === 'normal') {
		return 21 - numberToGet;
	}

	if (advantage === 'disadvantage')
		return 441 - 42 * numberToGet + numberToGet * numberToGet;

	return 399 + 2 * numberToGet - numberToGet * numberToGet;
}

export function probabilityOfPassingSavingThrow(params: Params): number {
	const {advantage} = params;
	return (
		numberOfSuccessfulOutcomes(params)
		/ (!advantage || advantage === 'normal' ? 20 : 400)
	);
}