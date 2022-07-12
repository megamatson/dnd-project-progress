import ClosedFunction from "../types/ClosedFunction";

function pipe<I, T, R>(f: (v: I) => T, g: (v: T) => R): (v: I) => R;

function pipe<T>(...fs: ClosedFunction<T>[]): ClosedFunction<T>;

function pipe<T>(...fs: ClosedFunction<T>[]): ClosedFunction<T> {
	if (fs.length === 0)
		return v => v;

	if (fs.length === 1)
		return fs[0];

	return v => {
		for (const f of fs)
			v = f(v);

		return v;
	};
}

export default pipe;