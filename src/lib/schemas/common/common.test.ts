import {
	emailSchema,
	hexColorSchema,
	isoDateSchema,
	isoDateTimeSchema,
	localeShema,
	usdAmountSchema
} from './common';

describe('Common schema primitives unit tests', () => {
	describe('localeShema', () => {
		const tests: [string, boolean][] = [
			['', false],
			['lv', false],
			['en', true],
			['de', true]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(localeShema.safeParse(input).success).toBe(result);
		});
	});

	describe('hexColorSchema', () => {
		const tests: [string, boolean][] = [
			['', false],
			['#fff', true],
			['#f5f5f5', true],
			['#!00000', false],
			['ffffff', false],
			['string', false]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(hexColorSchema.safeParse(input).success).toBe(result);
		});
	});
	describe('isoDateTimeSchema', () => {
		const tests: [string, boolean][] = [
			['2026-08-03T12:00:00Z', true],
			['2026-08-03T12:00:00', false],
			['2026-08-03T12:00Z', true],
			['2026-08-03T12:00', false],
			['2026-08-03T12Z', false],
			['2026-08-03T12', false],
			['2026-08-03T', false],
			['2026-08-03', false],
			['', false]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(isoDateTimeSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('isoDateSchema', () => {
		const tests: [string, boolean][] = [
			['2026-08-03', true],
			['2026-08-03T12:00:00Z', false],
			['2026-31-03', false],
			['', false]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(isoDateSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('usdAmountSchema', () => {
		const tests: [number, boolean][] = [
			[0, true],
			[2500, true],
			[2500.01, true],
			[-1, false],
			[-0.01, false],
			[NaN, false],
			[Infinity, false]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(usdAmountSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('emailSchema', () => {
		const tests: [string, boolean][] = [
			['admin@demo.test', true],
			['a@b.co', true],
			['notanemail', false],
			['no@domain', false],
			['x@y', false],
			['', false]
		];

		it.each(tests)('should correctly parse $0 as $1', (input, result) => {
			expect(emailSchema.safeParse(input).success).toBe(result);
		});
	});
});
