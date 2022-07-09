import Expand from "./Expand";
import UnionKeys from "./UnionKeys";

/**
 * Enforces that a type matches only one of the types in T
 */
type OneOf<T extends {}[]> = {
	[K in keyof T]: Expand<
		T[K] & Partial<Record<Exclude<UnionKeys<T[number]>, keyof T[K]>, never>>
	>;
}[number];

export default OneOf;