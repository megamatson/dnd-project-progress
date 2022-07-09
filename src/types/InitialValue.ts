/**
 * An initial value for useState
 */
type InitialValue<T> = T | (() => T);

export default InitialValue;