import { FieldHookConfig, useField, useFormikContext } from "formik";
import _ from "lodash";
import { useEffect } from "react";
import { FormNumber } from "../../types/FormNumber";
import ErrorText from "../output/ErrorText";

export interface Props {
	name: string
	label: string
}

const workHoursInADay = 8;
const workDaysInAWeek = 5;
const workHoursInAWeek = workDaysInAWeek * workHoursInADay;

function fieldPropsFor(name: string): FieldHookConfig<FormNumber> {
	return {
		name,
		type: 'number',
		min: 1,
	};
}

function ensureValued(v: any) {
	return _.isNumber(v) ? v : '';
}

export default function WorkHoursDaysOrWeeksInput(props: Props) {
	const {setFieldValue} = useFormikContext();

	const hoursName = props.name;
	const [{value: hours, ...hoursField}, hoursMeta] = useField<FormNumber>(
		fieldPropsFor(hoursName)
	);

	const daysName = props.name + 'Days';
	const [{value: days, ...daysField}, daysMeta] = useField<FormNumber>(
		fieldPropsFor(daysName)
	);

	const weeksName = props.name + 'Weeks';
	const [{value: weeks, ...weeksField}, weeksMeta] = useField<FormNumber>(
		fieldPropsFor(weeksName)
	);

	useEffect(
		() => {
			if (_.isNumber(hours)) {
				setFieldValue(daysName, hours / workHoursInADay);
				setFieldValue(weeksName, hours / workHoursInAWeek);
			}
		},
		[hours, daysName, weeksName, setFieldValue]
	);

	useEffect(
		() => {
			if (_.isNumber(days)) {
				setFieldValue(hoursName, days * workHoursInADay);
				setFieldValue(weeksName, days / workDaysInAWeek);
			}
		},
		[days, daysName, hoursName, weeksName, setFieldValue]
	);

	useEffect(
		() => {
			if (_.isNumber(weeks)) {
				setFieldValue(hoursName, weeks * workHoursInAWeek);
				setFieldValue(daysName, weeks * workDaysInAWeek);
			}
		},
		[weeks, weeksName, hoursName, daysName, setFieldValue]
	);

	useEffect(
		() => {
			if (_.isNumber(hours) && !_.isNumber(days) && !_.isNumber(weeks)) {
				setFieldValue(daysName, hours / workHoursInADay);
				setFieldValue(weeksName, hours / workHoursInAWeek);
			}
		},
		[hours, days, weeks, daysName, weeksName, setFieldValue]
	);

	const sharedProps = {
		min: 0,
	} as const;

	return (<label>
		{props.label}
		<div>
			<label title='1 Work Hour = 1 Hour of work 4Head.'>
				<input
					{...hoursField}
					type='number'
					value={ensureValued(hours)}
					{...sharedProps}
				/> Work Hours
			</label>
			<br/>

			<label title={`1 Work Day = ${workHoursInADay} Work Hours.`}>
				<input
					{...daysField}
					type='number'
					value={ensureValued(days)}
					{...sharedProps}
				/> Work Days
			</label>
			<br/>

			<label title={
				'1 Work Week = '
				+ `${workHoursInAWeek} Work Hours = `
				+ `${workHoursInAWeek / workHoursInADay} Work Days.`
			}>
				<input
					{...weeksField}
					type='number'
					value={ensureValued(weeks)}
					{...sharedProps}
				/> Work Weeks
			</label>

			<ErrorText {...hoursMeta}/>
			<ErrorText {...daysMeta}/>
			<ErrorText {...weeksMeta}/>
		</div>
	</label>);
}