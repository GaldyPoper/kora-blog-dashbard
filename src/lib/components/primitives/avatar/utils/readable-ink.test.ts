import { readableInk } from './readable-ink';

describe('readableInk', () => {
	it('returns black on bright backgrounds', () => {
		// The avatar author palette — all bright enough to want black ink.
		for (const color of ['#0ea5e9', '#10b981', '#6366f1', '#a855f7', '#f59e0b']) {
			expect(readableInk(color)).toBe('#000000');
		}
	});

	it('returns white on dark backgrounds', () => {
		expect(readableInk('#000000')).toBe('#ffffff');
		expect(readableInk('#1e1b4b')).toBe('#ffffff');
		expect(readableInk('#6d28d9')).toBe('#ffffff'); // the light-theme accent
	});

	it('supports shorthand 3-digit hex', () => {
		expect(readableInk('#fff')).toBe('#000000');
		expect(readableInk('#000')).toBe('#ffffff');
	});

	it('falls back to white for unparsable input', () => {
		expect(readableInk('not-a-color')).toBe('#ffffff');
	});
});
