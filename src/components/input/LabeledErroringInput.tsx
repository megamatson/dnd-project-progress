import { Field, FieldConfig, useField } from "formik";
import _ from "lodash";
import { ReactNode } from "react";
import ReactPropsOf from "../../types/ReactPropsOf";
import ErrorText from "../output/ErrorText";

import '../../css/Error.css';

interface ThisProps {
	label?: string,
	children?: ReactNode | ReactNode[],
}

type PropsOf<SubProps> = (
	ThisProps & Omit<SubProps, keyof ThisProps> & FieldConfig
);

export type Props = PropsOf<ReactPropsOf<HTMLInputElement>>;

export default function LabeledErroringInput({
	title,
	label,
	children,
	...props
}: Props) {
	const [field, meta] = useField({...props});

	const inputField = (<Field
		{...field}
		{...props}
	>
		{children}
	</Field>);

	const errorText = <ErrorText
		{...meta}
	/>;

	return (
		_.isUndefined(label) ?
			(<>{inputField}{errorText}</>) :
			(<><label title={title}>{label}{inputField}</label>{errorText}</>)
	);
}