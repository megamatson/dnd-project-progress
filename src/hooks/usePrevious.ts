import { useEffect, useRef, useState } from "react";
import InitialValue from "../types/InitialValue";

export default function usePrevious<T = any>(value: T) {
	const previousRef = useRef<T>();
	useEffect(() => {
		previousRef.current = value;
	});

	return previousRef.current;
}

export function usePreviousState<T = any>(
	initialValue?: InitialValue<T>,
	initialPrevious?: InitialValue<T>
) {
	const [prev, setPrevious] = useState(initialPrevious);
	const [value, setValue] = useState(initialValue);

	return [prev, value, (v: T) => {
		setPrevious(value);
		setValue(v);
	}] as const;
}