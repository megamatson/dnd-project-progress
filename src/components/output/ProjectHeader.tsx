import { useFormikContext } from "formik";
import _ from "lodash";
import FormValues from "../../FormValues";

export interface Props {}

export default function ProjectHeader(props: Props) {
	let {projectName} = useFormikContext<FormValues>().values;
	projectName = _.isUndefined(projectName) ? 'Project' : projectName.trim();

	return (<h1>{
		`D&D ${projectName ? projectName : 'Project'} Progress Tracker`
	}</h1>);
}