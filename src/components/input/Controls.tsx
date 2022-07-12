import { useFormikContext } from 'formik';
import _ from 'lodash';
import '../../css/Button.css';
import '../../css/Controls.css';
import d from '../../functions/d';
import FormValues, { validationSchema } from '../../FormValues';
import { FormNumber } from '../../types/FormNumber';
import Category from '../output/Category';
import pipe from '../../functions/pipe';

export interface Props {}

function ControlButton(
	{children, ...props}: Omit<
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>,
		'className'|'button'
	>
) {
	return (<button
		className='control'
		type='button'
		{...props}
	>
		{children}
	</button>);
}

function normalizeTime(
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

type ValuesChanger = (f: FormValues) => FormValues;

const identity: ValuesChanger = f => f;

const resetDay: ValuesChanger = (({
	workHoursLeftInTheDay,
	hoursWorkedToday,
	...oldValues
}) => ({
	workHoursLeftInTheDay: oldValues.workableHoursInADay,
	hoursWorkedToday: 0,
	...oldValues
}));

const resetTime: ValuesChanger = ({
	daysPassed,
	...oldValues
}) => resetDay({
	daysPassed: 0,
	...oldValues,
});

const resetProject: ValuesChanger = ({
	projectName,
	workTimeToFinishProject,
	workHoursDone,
	...oldValues
}) => ({
	...validationSchema.getDefault(),
	...oldValues,
});

const resetTimeAndProjects: ValuesChanger = pipe(resetTime, resetProject);

const reset: ValuesChanger = () => {
	return validationSchema.getDefault();
};

function nextDay(days = 1): ValuesChanger {
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

function passTime(hours: number, days = 0): ValuesChanger {
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

function workTime(hours: number, days = 0): ValuesChanger {
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

interface Event {
	daysPassed: number,
	hoursPassed: number,
	event: string,
}

type EventEmitter = (e: Event) => void;

function workFullTimeEvented(
	emitEventOriginal: EventEmitter,
	values: FormValues
): FormValues {
	const emitEvent = (e: string) => {
		emitEventOriginal({
			daysPassed: values.daysPassed,
			hoursPassed: values.workableHoursInADay - values.workHoursLeftInTheDay,
			event: e,
		});
	};

	const {workTimeToFinishProject, workHoursDone} = values;

	if (workTimeToFinishProject <= workHoursDone) {
		emitEvent(
			`${values.projectName ? values.projectName : 'Project'} done`
		);
		return values;
	}

	const {currentLevelOfExhaustion} = values;

	if (currentLevelOfExhaustion >= 1) {
		emitEvent(
			`Exhaustion (${values.currentLevelOfExhaustion}) >= 1.`
			+ ' Resting for the day'
		);

		return nextDay(1)(values);
	}

	const {workHoursLeftInTheDay} = values;

	if (workHoursLeftInTheDay <= 0) {
		emitEvent(
			`No work hours left. Resting for the day`
		);

		return nextDay(1)(values);
	}

	const {minimumWorksHoursPerDayBeforeExhaustionSaves} = values;
	const {hoursWorkedToday} = values;

	const safeHoursToWork = _.clamp(
		minimumWorksHoursPerDayBeforeExhaustionSaves - hoursWorkedToday,
		0,
		workHoursLeftInTheDay
	);

	if (safeHoursToWork) {
		emitEvent(
			`Working ${safeHoursToWork} hour(s) without a save`
		);

		values = workTime(safeHoursToWork)(values);
		return safeHoursToWork === workHoursLeftInTheDay ?
			values :
			workFullTimeEvented(emitEventOriginal, values)
		;
	}

	const dc = (
		11
		+ values.hoursWorkedToday
		- values.minimumWorksHoursPerDayBeforeExhaustionSaves
	);

	const roll = d(20);

	emitEvent(`unimplemented ${roll} vs DC ${dc}`);

	return values;
}

function workFullTime(emitEvent: EventEmitter): ValuesChanger {
	return values => workFullTimeEvented(emitEvent, values);
}

export default function Controls(props: Props) {
	const {values, ...context} = useFormikContext<FormValues>();

	if (
		!context.isValid
		|| values.workTimeToFinishProject as FormNumber === ''
	)
		return null;

	function commit(f: ValuesChanger, ...fs: ValuesChanger[]) {
		const func = pipe(f, ...fs);
		return () => context.setValues(func);
	}

	const projectDone = values.workHoursDone >= values.workTimeToFinishProject;

	return (<>
		<Category name='Pog Controls'>
			<ControlButton onClick={commit(workFullTime(
				(...args) => console.log(...args)
			))}>
				Work Until 1 Exhaustion
			</ControlButton>
		</Category>

		<Category name='Manual Controls'>
			<ControlButton onClick={commit(reset)}>
				Reset All
			</ControlButton>

			<ControlButton onClick={commit(resetTimeAndProjects)}>
				{'Reset Project & Time'}
			</ControlButton>

			<ControlButton onClick={commit(resetTime)}>
				Reset Time
			</ControlButton>

			<ControlButton onClick={commit(resetDay)}>
				Reset Day
			</ControlButton>

			<ControlButton onClick={commit(nextDay())}>
				Next Day
			</ControlButton>

			<ControlButton
				onClick={commit(workTime(8))}
				disabled={projectDone}
			>
				Work 1 Work Day
			</ControlButton>

			<ControlButton
				onClick={commit(workTime(1))}
				disabled={projectDone}
			>
				Work 1 Hour
			</ControlButton>
		</Category>
	</>);
}