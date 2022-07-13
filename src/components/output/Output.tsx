import { useFormikContext } from "formik";
import _ from "lodash";
import FormValues from "../../FormValues";
import { setStoredFormValues } from "../../functions/localStorage";
import { estimateTimeToComplete } from "../../functions/worktTime";
import percentFormat from "../../functions/percentFormat";
import TimeLeft from "./TimeLeft";

export interface Props {
	showValues?: boolean
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