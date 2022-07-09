type Without<T, U> = {
	[K in Exclude<keyof T, keyof U>]?: never
}

export default Without;