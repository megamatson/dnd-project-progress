import _ from "lodash";
import React, { useState } from "react";
import InitialValue from "../types/InitialValue";

type LocalStorageStateReturn<T, OrType = T> = {
	value: T | OrType,
	set: React.Dispatch<React.SetStateAction<T>>,
	delete: () => void
};

export default function useLocalStorage<T = any>(
	key: string
): LocalStorageStateReturn<T, undefined>;

export default function useLocalStorage<T = any>(
	key: string,
	initialState: InitialValue<T>
): LocalStorageStateReturn<T>;

export default function useLocalStorage<T = any>(
	key: string,
	initialState?: InitialValue<T>
): LocalStorageStateReturn<T, undefined> {
	const [storedValue, setStoredValue] = useState<T>(
		getInitialValue<T>(key, initialState)!
	);

	const setValue = (value: T | ((val: T) => T)) => {
		try {
			const valueToStore = _.isFunction(value) ? value(storedValue) : value;
			setStoredValue(valueToStore);
			localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
			return initialState;
		}
	};

	const deleteValue = () => {
		localStorage.removeItem(key);
	};

	return {
		value: storedValue,
		set: setValue,
		delete: deleteValue
	};
}

function resolve<T>(initialValue: InitialValue<T>): T {
	return _.isFunction(initialValue) ? initialValue() : initialValue;
}

function getInitialValue<T>(
	key: string,
	initialState: InitialValue<T> | undefined
): T | undefined;

function getInitialValue<T>(
	key: string,
	initialState: InitialValue<T>
): T;

function getInitialValue<T>(
	key: string,
	initialState: InitialValue<T>
): T|undefined {
	try {
		const item = localStorage.getItem(key);

		if (item)
			return JSON.parse(item);
	} catch (error) {
		console.error(error);
	}
	return resolve(initialState);
}