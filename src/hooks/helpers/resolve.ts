import _ from "lodash";
import InitialValue from "../../types/InitialValue";

export default function resolve<T>(initialValue: InitialValue<T>): T {
	return _.isFunction(initialValue) ? initialValue() : initialValue;
}