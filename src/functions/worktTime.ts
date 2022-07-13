import FormValues from "../FormValues";
import Advantage from "../types/Advantage";
import Time from "../types/Time";
import { probabilityOfPassingSavingThrow } from "./dc";

export type TotalProps = Pick<
	FormValues,
	'workableHoursInADay'
	|'workTimeToFinishProject'
	|'workHoursDone'
	|'minimumWorksHoursPerDayBeforeExhaustionSaves'
	|'allowCriticalSavingThrows'
	|'conSTMod'
	|'conSTadvantage'
>

export function estimateTimeToComplete({
	workTimeToFinishProject,
	workHoursDone,
	...v
}: TotalProps): Time {
	/**
	 * TODO:
	 * exhaustion cures
	 * */
	let hours = workTimeToFinishProject - workHoursDone;
	const workPerDay = expectedNumberOfWorkHoursPerDay(v);
	const days = Math.floor(hours / workPerDay);
	hours = hours - days * workPerDay;

	return {
		hours: Math.ceil(hours),
		unroundedHours: hours,
		days
	};
}

export function expectedOvertime({
	workableHoursInADay,
	minimumWorksHoursPerDayBeforeExhaustionSaves,
	conSTMod,
	allowCriticalSavingThrows,
	conSTadvantage
}: PerDayProps): number {
	const possibleOvertime = Math.max(
		workableHoursInADay - minimumWorksHoursPerDayBeforeExhaustionSaves,
		0
	);

	if (possibleOvertime < 1)
		return possibleOvertime;

	let cumulativeOvertime = 1;
	let cumulativeProbability = 1;

	for (
		let overtimeHour = 1;
		overtimeHour < possibleOvertime;
		overtimeHour++
	) {
		const dc = 10 + overtimeHour;
		const probabilityOfPassing = probabilityOfPassingSavingThrow({
			dc,
			savingThrowMod: conSTMod,
			criticals: allowCriticalSavingThrows,
			advantage: conSTadvantage as Advantage,
		});

		if (!probabilityOfPassing)
			break;

		cumulativeProbability = probabilityOfPassing * cumulativeProbability;
		cumulativeOvertime += cumulativeProbability;
	}

	return cumulativeOvertime;
}

export type PerDayProps = Pick<
	FormValues,
	'workableHoursInADay'
	|'minimumWorksHoursPerDayBeforeExhaustionSaves'
	|'allowCriticalSavingThrows'
	|'conSTMod'
	|'conSTadvantage'
>

export function expectedNumberOfWorkHoursPerDay(v: PerDayProps): number {
	return Math.min(
		v.minimumWorksHoursPerDayBeforeExhaustionSaves,
		v.workableHoursInADay
	) + expectedOvertime(v);
}