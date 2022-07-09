import React, { useId } from "react";
import InitialValue from "../types/InitialValue";
import useLocalStorage from "./useLocalStorage";

interface ReturnType<T, U = T> {
	value: T | U,
	id: string,
	set: React.Dispatch<React.SetStateAction<T>>,
	delete(): void
}

export default function useIdedLocalStorage<T>(
	key: string
): ReturnType<T, undefined>;

export default function useIdedLocalStorage<T>(
	key: string,
	initialState: InitialValue<T>
): ReturnType<T>;

export default function useIdedLocalStorage<T>(
	key: string,
	initialState?: InitialValue<T>
) {
	return {
		id: useId(),
		...useLocalStorage(key, initialState)
	};
}