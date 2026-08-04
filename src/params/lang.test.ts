import { match } from './lang';

describe('lang route param matcher', () => {
	const tests: [string, boolean][] = [
		['en', true],
		['de', true],
		['', false],
		['lv', false],
		['EN', false],
		['en-US', false]
	];

	it.each(tests)('should match "%s" as %s', (input, result) => {
		expect(match(input)).toBe(result);
	});
});
