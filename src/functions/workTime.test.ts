import { expectedNumberOfWorkHoursPerDay, PerDayProps } from "./worktTime";

test('basic parameters', () => {
	function params(i: number): PerDayProps {
		return {
			allowCriticalSavingThrows: false,
			conSTadvantage: 'normal',
			conSTMod: 0,
			minimumWorksHoursPerDayBeforeExhaustionSaves: 8,
			workableHoursInADay: i,
		};
	}

	expect(expectedNumberOfWorkHoursPerDay(params(0))).toBe(0);
	expect(expectedNumberOfWorkHoursPerDay(params(1))).toBe(1);
	expect(expectedNumberOfWorkHoursPerDay(params(2))).toBe(2);
	expect(expectedNumberOfWorkHoursPerDay(params(3))).toBe(3);
	expect(expectedNumberOfWorkHoursPerDay(params(4))).toBe(4);
	expect(expectedNumberOfWorkHoursPerDay(params(5))).toBe(5);
	expect(expectedNumberOfWorkHoursPerDay(params(6))).toBe(6);
	expect(expectedNumberOfWorkHoursPerDay(params(7))).toBe(7);
	expect(expectedNumberOfWorkHoursPerDay(params(8))).toBe(8);
	expect(expectedNumberOfWorkHoursPerDay(params(9))).toBe(9);
	expect(expectedNumberOfWorkHoursPerDay(params(10))).toBe(9.5);
	expect(expectedNumberOfWorkHoursPerDay(params(11))).toBeCloseTo(9.725);
	expect(expectedNumberOfWorkHoursPerDay(params(12))).toBeCloseTo(9.815);
	expect(expectedNumberOfWorkHoursPerDay(params(13))).toBeCloseTo(9.8465);
	expect(expectedNumberOfWorkHoursPerDay(params(14))).toBeCloseTo(9.85595);
	expect(expectedNumberOfWorkHoursPerDay(params(15))).toBeCloseTo(9.858313);
	expect(expectedNumberOfWorkHoursPerDay(params(16))).toBeCloseTo(9.858785);
});