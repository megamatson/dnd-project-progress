import React from "react";
import removeExtraneousZeros from "../../removeExtraneousZeros";
import Time from "../../types/Time";

export interface Props {
	time?: Time
}

const TimeLeft = React.memo(function TimeLeft({time}: Props) {
	if (!time)
		return null;

	const outputParts: string[] = [];

	if (time.days)
		outputParts.push(
			`${
				removeExtraneousZeros(time.days.toFixed(2))
			} Day${time.days === 1 ? '' : 's'}`
		);

	if (time.hours) {
		let hoursText = removeExtraneousZeros(time.hours.toFixed(2));
		let unrounededHoursText = (
			'unroundedHours' in time && time.unroundedHours ?
				` (${removeExtraneousZeros(time.unroundedHours.toFixed(2))})` :
				''
		);

		unrounededHoursText = '';

		outputParts.push(
			`${hoursText}${unrounededHoursText} Hour${time.hours === 1 ? '' : 's'}`
		);
	}

	const outputText = outputParts.join(', ');

	if (outputText.length === 0)
		return null;

	return (<>
		<p>Estimated time to complete, working overtime:</p>
		<p>{outputText}</p>
	</>);
});

export default TimeLeft;