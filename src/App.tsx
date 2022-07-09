import './css/App.css';
import { Form, Formik } from 'formik';
import LabeledErroringInput, {
	Props
} from './components/input/LabeledErroringInput';
import Output from './components/output/Output';
import FormValues, {validationSchema, labels} from './FormValues';
import { getStoredFormValues } from './localStorage';
import WorkHoursDaysOrWeeksInput from
	'./components/input/WorkHoursDaysOrWeeksInput';
import ProjectHeader from './components/output/ProjectHeader';
import FlexCategory, {
	Props as FlexProps
} from './components/output/FlexCategory';
import Controls from './components/input/Controls';
import React from 'react';
import isLocalhost from './isLocalhost';

const initialValues: FormValues = getStoredFormValues();

function nameAndPropertyObjectOf(name: keyof FormValues) {
	return {
		label: labels[name] + ': ',
		name
	};
}

function LabeledField(
	{name, ...props}: Omit<Props, 'label'> & {name: keyof FormValues}
) {
	return (<>
		<LabeledErroringInput
			{...props}
			{...nameAndPropertyObjectOf(name)}
		/>
		<br/>
	</>);
}

const horizontalPadding = '1em';
const categoryStyle: React.CSSProperties = {
	border: '1px grey',
	borderStyle: 'solid',
	paddingLeft: horizontalPadding,
	paddingRight: horizontalPadding,
	paddingBottom: '1em',
};

function StyledCategory({children, ...props}: Omit<FlexProps, 'style'>) {
	return (<FlexCategory
		style={categoryStyle}
		{...props}
	>
		{children}
	</FlexCategory>);
}

export default function App() {
	return (<>
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={console.log}
			validateOnMount={true}
		>
			<Form>
				<ProjectHeader/>

				<StyledCategory
					name='Rule Parameters'
				>
					<LabeledField
						type='number'
						name='workableHoursInADay'
						title={
							'The number of hours a character is allowed to work in a day.'
							+ ' This is usually the number of hours in a day minus the'
							+ ' number of hours needed for a long rest.'
						}
						min={1}
					/>

					<LabeledField
						type='number'
						name='minimumWorksHoursPerDayBeforeExhaustionSaves'
						min={0}
						title={
							'The minimum number of hours a character can work'
							+ ' in a day before they must start making'
							+ ' Constituion Saving Throws '
							+ '(DC: 10 + numberOfHoursWorked - this)'
							+ ' to avoid getting exhaustion.'
						}
					/>

					<LabeledField
						name='allowCriticalSavingThrows'
						type='checkbox'
						title={
							'Whether rolling a 20 on a D20 counts as a guaranteed pass,'
							+ ' regardless of modifier.'
							+ ' Likewise, a 1 counts as a guaranteed fail.'
						}
					/>
				</StyledCategory>

				<StyledCategory
					name='Character Parameters'
				>
					<LabeledField
						type='number'
						name='conSTMod'
						title={
							'The Constitution Saving Throw Modifier'
							+ ' for the character that is working.'
							+ ' This is for working more than 8 hours a day.'
						}
					/>

					<LabeledField
						type='dropdown'
						name='conSTadvantage'
						as='select'
					>
						<option>normal</option>
						<option>advantage</option>
						<option>disadvantage</option>
					</LabeledField>

					<LabeledField
						type='number'
						name='currentLevelOfExhaustion'
					/>

					<LabeledField
						type='number'
						name='dailyExhaustionCures'
						title={
							'The number of exhaustion cures '
							+ '(e.g. Greater Restoration) you have available every day.'
						}
					/>
				</StyledCategory>

				<StyledCategory
					name='Project Parameters'
				>
					<LabeledField name='projectName'/>

					<WorkHoursDaysOrWeeksInput
						{...nameAndPropertyObjectOf('workTimeToFinishProject')}
					/>

					<LabeledField
						type='number'
						name='workHoursDone'
						min={0}
						title='The number of work hours already done for this project.'
					/>
				</StyledCategory>

				<StyledCategory
					name='Time Parameters'
				>
					<LabeledField
						name='daysWorked'
						type='number'
						min={0}
						title={
							'The number of days you have been working.'
							+ ' This is mainly for you to know when you are done'
						}
					/>

					<LabeledField
						name='workHoursLeftInTheDay'
						type='number'
						min={0}
						title={
							'The number of hours left in the current day'
						}
					/>

					<LabeledField
						name='hoursWorkedToday'
						type='number'
						min={0}
						title={
							'The number of hours worked today.'
							+ ' This can be in this project, other projects, or adventuring.'
							+ ' This is used to find out when you start making'
							+ ' Constitution Saving Throws to avoid exhaustion,'
							+ ' as well as the DC.'
						}
					/>
				</StyledCategory>

				<br/>

				<Controls/>
				<br/>

				<Output showValues={isLocalhost()}/>
			</Form>
		</Formik>
	</>);
}