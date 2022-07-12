import _ from "lodash";
import FormValues, {validationSchema} from "../FormValues";

function get<T extends {}>(
	key: string,
	validationSchema: {
		validateSync(t: any): T,
		getDefault(): T,
	}
): T {
	const stringState = localStorage.getItem(key);

	if (!_.isNull(stringState))
		try {
			return validationSchema.validateSync(JSON.parse(stringState)) as T;
		} catch (e) {
			console.error(e);
			localStorage.removeItem(key);
		}

	return validationSchema.getDefault() as T;
}

function set<T>(key: string, value: T) {
	localStorage.setItem(key, JSON.stringify(value, null, 0));
}

const formValuesKey = 'formValues';
export function getStoredFormValues(): FormValues {
	return get<FormValues>(
		formValuesKey,
		validationSchema
	);
}

export function setStoredFormValues(v: FormValues) {
	set(formValuesKey, v);
}
