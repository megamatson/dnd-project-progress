/** Improves IntelliSense */
type Expand<T> = T extends T ? {[K in keyof T]: T[K]} : never;

export default Expand;