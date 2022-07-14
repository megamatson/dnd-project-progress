import _ from "lodash";
import FormValues, { validationSchema } from "../types/FormValues";
import { cast as castAdvantage } from "../types/Advantage";
import d from "./d";
import { clamp as d20Clamp } from "../types/D20";
import { dcResult } from "./dc";
import pipe from "./pipe";

export function normalizeTime(
	hours: number,
	days: number,
	hoursInADay: number = 24
) {
	if (hours > hoursInADay) {
		const newDays =  Math.floor(hours / hoursInADay);
		days += newDays;
		hours -= newDays * hoursInADay;
	}

	return {
		hours,
		days
	};
}

export type FormValuesChanger = (f: FormValues) => FormValues;

export const identity: FormValuesChanger = f => f;

export const resetDay: FormValuesChanger = (({
	workHoursLeftInTheDay,
	hoursWorkedToday,
	...oldValues
}) => ({
	workHoursLeftInTheDay: oldValues.workableHoursInADay,
	hoursWorkedToday: 0,
	...oldValues
}));

export const resetTime: FormValuesChanger = ({
	daysPassed,
	...oldValues
}) => resetDay({
	daysPassed: 0,
	...oldValues,
});

export const resetProject: FormValuesChanger = ({
	projectName,
	workTimeToFinishProject,
	workHoursDone,
	...oldValues
}) => ({
	...validationSchema.getDefault(),
	...oldValues,
});

export const resetTimeAndProjects: FormValuesChanger = pipe(
	resetTime,
	resetProject
);

export const reset: FormValuesChanger = () => {
	return validationSchema.getDefault();
};

export function nextDay(days = 1): FormValuesChanger {
	return (({
		daysPassed,
		currentLevelOfExhaustion,
		...oldValues
	}) => resetDay({
		daysPassed: daysPassed + days,
		currentLevelOfExhaustion: Math.max(currentLevelOfExhaustion - 1, 0),
		...oldValues,
	}));
}

export function passTime(hours: number, days = 0): FormValuesChanger {
	return (({
		workHoursLeftInTheDay,
		...oldValues
	}: FormValues) => {
		const ret = normalizeTime(hours, days, oldValues.workableHoursInADay);

		hours = ret.hours;
		days = ret.days;

		if (hours >= workHoursLeftInTheDay) {
			days++;
			hours -= workHoursLeftInTheDay;
			workHoursLeftInTheDay = oldValues.workableHoursInADay;
		}

		const change = days ? nextDay(days) : identity;

		return change({
			workHoursLeftInTheDay: workHoursLeftInTheDay - hours,
			...oldValues
		});
	});
}

export function workTime(hours: number, days = 0): FormValuesChanger {
	return (({
		hoursWorkedToday,
		workHoursDone,
		...oldValues
	}) => {
		const workHours = Math.min(
			hours + days * oldValues.workableHoursInADay,
			oldValues.workTimeToFinishProject - workHoursDone
		);

		const normalizedTime = normalizeTime(
			workHours,
			0,
			oldValues.workableHoursInADay
		);

		hours = normalizedTime.hours;
		days = normalizedTime.days;

		return passTime(hours, days)({
			hoursWorkedToday: hoursWorkedToday + hours,
			workHoursDone: Math.min(
				oldValues.workTimeToFinishProject,
				workHoursDone + workHours
			),
			...oldValues
		});
	});
}

export interface Event {
	daysPassed: number,
	hoursPassed: number,
	event: string,
}

export type EventEmitter = (e: Event) => void;

export function workFullTimeEvented(
	emitEvent: EventEmitter,
	values: FormValues
): FormValues {
	const emit = (e: string) => {
		emitEvent({
			daysPassed: values.daysPassed,
			hoursPassed: values.workableHoursInADay - values.workHoursLeftInTheDay,
			event: e,
		});
	};

	const {workTimeToFinishProject, workHoursDone} = values;

	if (workTimeToFinishProject <= workHoursDone) {
		emit(
			(values.projectName ? values.projectName : 'Project')
			+ ' done'
		);
		return values;
	}

	const {currentLevelOfExhaustion} = values;

	if (currentLevelOfExhaustion >= 1) {
		emit(
			'Exhaustion ('
			+ values.currentLevelOfExhaustion
			+ ') >= 1. '
			+ ( values.autoRest ? 'Resting for the day' : 'Stopping')
		);

		return values.autoRest ? nextDay(1)(values) : values;
	}

	const {workHoursLeftInTheDay} = values;

	if (workHoursLeftInTheDay <= 0) {
		emit(`No work hours left. Resting for the day`);

		return nextDay(1)(values);
	}

	const {minimumWorksHoursPerDayBeforeExhaustionSaves} = values;
	const {hoursWorkedToday} = values;

	const safeHoursToWork = _.clamp(
		minimumWorksHoursPerDayBeforeExhaustionSaves - hoursWorkedToday,
		0,
		Math.min(
			workHoursLeftInTheDay,
			values.workTimeToFinishProject - values.workHoursDone
		)
	);

	if (safeHoursToWork) {
		emit(`Working ${safeHoursToWork} hour(s) without a save`);

		values = workTime(safeHoursToWork)(values);
		return safeHoursToWork === workHoursLeftInTheDay ?
			values :
			workFullTimeEvented(emitEvent, values)
		;
	}

	const dc = (
		11
		+ values.hoursWorkedToday
		- values.minimumWorksHoursPerDayBeforeExhaustionSaves
	);

	values = workTime(1)(values);

	const advantage = castAdvantage(values.conSTadvantage);
	const roll = d(20, advantage);
	const mod = values.conSTMod;

	const result = dcResult({
		roll: d20Clamp(roll),
		dc,
		mod,
		allowCritical: values.allowCriticalSavingThrows
	});

	emit(`Exhaustion save ${
		result ? 'PASSED' : 'FAILED'
	}: d20${
		advantage !== 'normal' ? advantage[0] : ''
	}(${roll}) + ${mod} = ${roll + mod} vs DC ${dc}`);

	if (!result) {
		values = {
			...values,
			currentLevelOfExhaustion: values.currentLevelOfExhaustion + 1
		};
	}


	return workFullTimeEvented(emitEvent, values);
}

export function workFullTime(emitEvent: EventEmitter): FormValuesChanger {
	return values => workFullTimeEvented(emitEvent, values);
}

export function workUntilDoneEvented(
	emitEvent: EventEmitter,
	values: FormValues
): FormValues {
	while (values.workTimeToFinishProject > values.workHoursDone)
		values = workFullTimeEvented(emitEvent, values);

	return values;
}

export function workUntilDone(emitEvent: EventEmitter): FormValuesChanger {
	return values => workUntilDoneEvented(emitEvent, values);
}