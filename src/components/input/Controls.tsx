import { Field, useFormikContext } from 'formik';
import '../../css/Button.css';
import '../../css/Controls.css';
import {
	FormValuesChanger as ValuesChanger,
	nextDay,
	reset,
	resetDay,
	resetTime,
	resetTimeAndProjects,
	workFullTime,
	workTime,
	workUntilDone,
} from '../../functions/FormValuesChangers';
import FormValues from '../../types/FormValues';
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

			<label>
				<Field
					type='checkbox'
					name='autoRest'
				/>
				{' Rest when you have exhaustion'}
			</label>
			<br/>

			<ControlButton onClick={commit(workUntilDone(
				(...args) => console.log(...args)
			))}>
				Work Full-time Until Done
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