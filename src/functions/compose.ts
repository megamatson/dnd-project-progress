import ClosedFunction from "../types/ClosedFunction";

function compose<I, T, R>(
	f: (v: T) => R,
	g: (v: I) => T
): (v: I) => R;

function compose<T>(
	...fs: ClosedFunction<T>[]
): ClosedFunction<T>;

function compose<T>(
	...fs: ClosedFunction<T>[]
): ClosedFunction<T> {
	if (fs.length === 0)
		return v => v;

	if (fs.length === 1)
		return fs[0];

	return v => {
		for (const f of fs.reverse())
			v = f(v);

		return v;
	};
}

export default compose;