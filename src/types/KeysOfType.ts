type KeysOfType<O extends {}, T> = {
	[K in keyof O]: O[K] extends T ? K : never
}[keyof O]

export default KeysOfType;