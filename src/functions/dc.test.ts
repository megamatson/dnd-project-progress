import { numberOfSuccessfulOutcomes, Params } from "./dc";

test('without criticals and modifiers', () => {
	function params(dc: number): Params {
		return {
			dc,
			advantage: 'normal',
			criticals: false,
			savingThrowMod: 0
		};
	}

	expect(numberOfSuccessfulOutcomes(params(10))).toBe(11);
	expect(numberOfSuccessfulOutcomes(params(11))).toBe(10);
	expect(numberOfSuccessfulOutcomes(params(1))).toBe(20);
	expect(numberOfSuccessfulOutcomes(params(20))).toBe(1);
	expect(numberOfSuccessfulOutcomes(params(21))).toBe(0);
	expect(numberOfSuccessfulOutcomes(params(0))).toBe(20);
	expect(numberOfSuccessfulOutcomes(params(-5))).toBe(20);
});

test('with criticals, but without modifiers', () => {
	function params(dc: number): Params {
		return {
			dc,
			advantage: 'normal',
			criticals: true,
			savingThrowMod: 0
		};
	}

	expect(numberOfSuccessfulOutcomes(params(10))).toBe(11);
	expect(numberOfSuccessfulOutcomes(params(11))).toBe(10);
	expect(numberOfSuccessfulOutcomes(params(1))).toBe(19);
	expect(numberOfSuccessfulOutcomes(params(20))).toBe(1);
	expect(numberOfSuccessfulOutcomes(params(21))).toBe(1);
	expect(numberOfSuccessfulOutcomes(params(0))).toBe(19);
});

test('without criticals, but with modifiers', () => {
	function params(dc: number, mod: number): Params {
		return {
			dc,
			savingThrowMod: mod,
			advantage: 'normal',
			criticals: false,
		};
	}

	expect(numberOfSuccessfulOutcomes(params(10, 1))).toBe(12);
	expect(numberOfSuccessfulOutcomes(params(10, 10))).toBe(20);
	expect(numberOfSuccessfulOutcomes(params(1, -5))).toBe(15);
	expect(numberOfSuccessfulOutcomes(params(19, 1))).toBe(3);
	expect(numberOfSuccessfulOutcomes(params(22, 5))).toBe(4);
});

test('with criticals and modifiers', () => {
	function params(dc: number, mod: number): Params {
		return {
			dc,
			savingThrowMod: mod,
			advantage: 'normal',
			criticals: true,
		};
	}

	expect(numberOfSuccessfulOutcomes(params(10, 1))).toBe(12);
	expect(numberOfSuccessfulOutcomes(params(10, 10))).toBe(19);
	expect(numberOfSuccessfulOutcomes(params(1, -5))).toBe(15);
	expect(numberOfSuccessfulOutcomes(params(19, 1))).toBe(3);
	expect(numberOfSuccessfulOutcomes(params(19, -5))).toBe(1);
});

test('with advantage, no crits', () => {
	function params(dc: number, mod: number): Params {
		return {
			dc,
			savingThrowMod: mod,
			advantage: 'advantage',
			criticals: false
		};
	}

	expect(numberOfSuccessfulOutcomes(params(1, 0))).toBe(400);
	expect(numberOfSuccessfulOutcomes(params(2, 0))).toBe(399);
	expect(numberOfSuccessfulOutcomes(params(20, 0))).toBe(39);
	expect(numberOfSuccessfulOutcomes(params(25, 0))).toBe(0);
});

test('with advantage & crits', () => {
	function params(dc: number, mod: number): Params {
		return {
			dc,
			savingThrowMod: mod,
			advantage: 'advantage',
			criticals: true,
		};
	}

	expect(numberOfSuccessfulOutcomes(params(1, 0))).toBe(399);
	expect(numberOfSuccessfulOutcomes(params(2, 0))).toBe(399);
	expect(numberOfSuccessfulOutcomes(params(20, 0))).toBe(39);
	expect(numberOfSuccessfulOutcomes(params(25, 0))).toBe(39);
});

test('with disadvantage, no crits', () => {
	function params(dc: number, mod: number): Params {
		return {
			dc,
			savingThrowMod: mod,
			advantage: 'disadvantage',
			criticals: false
		};
	}

	expect(numberOfSuccessfulOutcomes(params(1, 0))).toBe(400);
	expect(numberOfSuccessfulOutcomes(params(2, 0))).toBe(361);
	expect(numberOfSuccessfulOutcomes(params(3, 0))).toBe(324);
	expect(numberOfSuccessfulOutcomes(params(4, 0))).toBe(289);
	expect(numberOfSuccessfulOutcomes(params(17, 0))).toBe(16);
	expect(numberOfSuccessfulOutcomes(params(18, 0))).toBe(9);
	expect(numberOfSuccessfulOutcomes(params(19, 0))).toBe(4);
	expect(numberOfSuccessfulOutcomes(params(20, 0))).toBe(1);
	expect(numberOfSuccessfulOutcomes(params(21, 0))).toBe(0);
});