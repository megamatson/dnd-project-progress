import { useFormikContext } from "formik";
import _ from "lodash";
import { probabilityOfPassingSavingThrow } from "../../functions/dc";
import FormValues from "../../FormValues";
import { setStoredFormValues } from "../../functions/localStorage";
import percentFormat from "../../functions/percentFormat";
import Advantage from "../../types/Advantage";
import Time from "../../types/Time";
import TimeLeft from "./TimeLeft";

export interface Props {
	showValues?: boolean
}

function estimateTimeToComplete(v: FormValues): Time {
	/**
	 * TODO:
	 * exhaustion cures
	 * */
	let hours = v.workTimeToFinishProject - v.workHoursDone;
	const workPerDay = expectedNumberOfWorkHoursPerDay(v);
	const days = Math.floor(hours / workPerDay);
	hours = hours - days * workPerDay;

	return {
		hours: Math.ceil(hours),
		unroundedHours: hours,
		days
	};
}

function expectedOvertime(v: FormValues): number {
	const possibleOvertime = Math.max(
		v.workableHoursInADay - v.minimumWorksHoursPerDayBeforeExhaustionSaves,
		0
	);

	if (possibleOvertime === 0)
		return possibleOvertime;

	let cumulativeOvertime = 0;
	let cumulativeProbability = 1;

	for (
		let overtimeHour = 1;
		overtimeHour < possibleOvertime + 1;
		overtimeHour++
	) {
		const dc = 10 + overtimeHour;
		const probabilityOfPassing = probabilityOfPassingSavingThrow({
			dc,
			savingThrowMod: v.conSTMod,
			criticals: v.allowCriticalSavingThrows,
			advantage: v.conSTadvantage as Advantage,
		});

		if (!probabilityOfPassing)
			break;

		cumulativeProbability = probabilityOfPassing * cumulativeProbability;
		cumulativeOvertime += cumulativeProbability * overtimeHour;
	}

	return cumulativeOvertime;
}

function expectedNumberOfWorkHoursPerDay(v: FormValues): number {
	return v.minimumWorksHoursPerDayBeforeExhaustionSaves + expectedOvertime(v);
}

export default function Output(props: Props) {
	const context = useFormikContext<FormValues>();

	const percentDone = (
		context.values.workHoursDone
		/ context.values.workTimeToFinishProject
	);

	if (!context.isValid || _.isNaN(percentDone) || !_.isFinite(percentDone))
		return null;

	setStoredFormValues(context.values);

	const timeToComplete = estimateTimeToComplete(context.values);

	return (<>
		<label>Progress: <progress
			max={context.values.workTimeToFinishProject}
			value={context.values.workHoursDone}
		/><span> {percentFormat(percentDone)}</span></label>

		<TimeLeft
			time={timeToComplete}
		/>
		<br/>

		{
			props.showValues ?
				<pre>{JSON.stringify(context.values, null, 2)}</pre> :
				null
		}
	</>);
}