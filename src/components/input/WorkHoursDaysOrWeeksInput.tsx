import { FieldHookConfig, useField, useFormikContext } from "formik";
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

export default function WorkHoursDaysOrWeeksInput(props: Props) {
	const {setFieldValue} = useFormikContext();

	const hoursName = props.name;
	const [hoursField, hoursMeta] = useField<FormNumber>(
		fieldPropsFor(hoursName)
	);
	const {value: hours} = hoursField;

	const daysName = props.name + 'Days';
	const [daysField, daysMeta] = useField<FormNumber>(
		fieldPropsFor(daysName)
	);
	const {value: days} = daysField;

	const weeksName = props.name + 'Weeks';
	const [weeksField, weeksMeta] = useField<FormNumber>(
		fieldPropsFor(weeksName)
	);
	const {value: weeks} = weeksField;

	useEffect(
		() => {
			if (hours !== '') {
				setFieldValue(daysName, hours / workHoursInADay);
				setFieldValue(weeksName, hours / workHoursInAWeek);
			}
		},
		[hours, daysName, weeksName, setFieldValue]
	);

	useEffect(
		() => {
			if (days !== '') {
				setFieldValue(hoursName, days * workHoursInADay);
				setFieldValue(weeksName, days / workDaysInAWeek);
			}
		},
		[days, hoursName, weeksName, setFieldValue]
	);

	useEffect(
		() => {
			if (weeks !== '') {
				setFieldValue(hoursName, weeks * workHoursInAWeek);
				setFieldValue(daysName, weeks * workDaysInAWeek);
			}
		},
		[weeks, hoursName, daysName, setFieldValue]
	);

	return (<label>
		{props.label}
		<div>
			<label title='1 Work Hour = 1 Hour of work 4Head.'>
				<input
					{...hoursField}
					type='number'
				/> Work Hours
			</label>
			<br/>

			<label title={`1 Work Day = ${workHoursInADay} Work Hours.`}>
				<input
					{...daysField}
					type='number'
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
				/> Work Weeks
			</label>

			<ErrorText {...hoursMeta}/>
			<ErrorText {...daysMeta}/>
			<ErrorText {...weeksMeta}/>
		</div>
	</label>);
}