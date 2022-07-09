import _ from 'lodash';
import * as Yup from 'yup';

const requiredNumber = Yup
	.number()
	.required()
;

const requiredInteger = requiredNumber.integer();
const workHours = requiredNumber;

const advantage = Yup
	.string()
	.nullable()
	.oneOf(['advantage', 'disadvantage', 'normal'])
;

export const validationSchema = Yup.object({
	projectName: Yup
		.string()
		.label('Project Name')
		.default('')
	,
	workableHoursInADay: requiredNumber
		.positive()
		.label('Workable Hours in a Day')
		.default(16)
	,
	minimumWorksHoursPerDayBeforeExhaustionSaves: requiredNumber
		.min(0)
		.label('Minimum Hours Before Exhaustion Checks')
		.default(8)
		.when('workableHoursInADay', (value, schema) =>
			schema.max(
				value,
				(v: any) =>
					`${v.label} can't be more than Workable Hours in a Day `
					+ `(${value})`
			)
		)
	,
	conSTMod: requiredInteger
		.label('Constitution Saving Throw Mod')
		.default(0)
	,
	allowCriticalSavingThrows: Yup
		.bool()
		.default(true)
		.label('Allow Critical Saving Throws')
	,
	workTimeToFinishProject: workHours
		.positive()
		.default(10)
		.label('Work to Finish Project')
	,
	workHoursDone: workHours
		.min(0)
		.default(0)
		.label('Work Hours Done')
		.when('workTimeToFinishProject', (value, schema) =>
			schema.max(
				value,
				(v: any) =>
					`${v.label} can't be more than Work Hours to Finish Project `
					+ `(${value})`
			)
		)
	,
	currentLevelOfExhaustion: requiredInteger
		.min(0)
		.max(6)
		.default(0)
		.label('Current Level of Exhaustion')
	,
	dailyExhaustionCures: requiredInteger
		.min(0)
		.default(0)
		.label('Daily Exhaustion Cures')
	,
	daysWorked: requiredInteger
		.min(0)
		.default(0)
		.label('Days Worked')
	,
	workHoursLeftInTheDay: requiredNumber
		.min(0)
		.default(0)
		.label('Work Hours Left in the Day')
		.when('workableHoursInADay', (value, schema) =>
			schema.max(
				value,
				(v: any) =>
					`${v.label} can't be more than Workable Hours in a Day `
					+ `(${value})`
			)
		)
	,
	hoursWorkedToday: requiredNumber
		.min(0)
		.default(0)
		.label('Hours Worked Today')
		.when('workableHoursInADay', (value, schema) =>
			schema.max(
				value,
				(v: any) =>
					`${v.label} can't be more than Workable Hours in a Day `
					+ `(${value})`
			)
		)
	,
	conSTadvantage: advantage
		.default('normal')
		.label('Constitution Saving Throw Advantage')
	,
}).required();

type FormValues = Yup.InferType<typeof validationSchema>;

export default FormValues;

function getLabels() {
	return _.mapValues(validationSchema.fields, v => v.spec.label);
}

export const labels = getLabels();