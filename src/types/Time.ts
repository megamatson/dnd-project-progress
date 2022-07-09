type Time = {
	hours?: number,
	days?: number,
} | {
	hours: number,
	unroundedHours?: number,
	days?: number
}

export default Time;