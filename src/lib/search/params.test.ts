import { parsePostQuery, buildPostQueryString, DEFAULT_SORT, type PostQuery } from './params';

const parse = (search: string) => parsePostQuery(new URLSearchParams(search));

describe('parsePostQuery', () => {
	it('returns defaults for an empty query string', () => {
		expect(parse('')).toEqual({ q: '', tag: null, sort: DEFAULT_SORT, page: 1 });
	});

	it('reads and trims the text query', () => {
		expect(parse('q=%20perf%20').q).toBe('perf');
	});

	it('treats an empty/whitespace tag as no filter', () => {
		expect(parse('tag=').tag).toBeNull();
		expect(parse('tag=%20%20').tag).toBeNull();
		expect(parse('tag=design').tag).toBe('design');
	});

	it('accepts known sort values and falls back on unknown ones', () => {
		expect(parse('sort=newest').sort).toBe('newest');
		expect(parse('sort=oldest').sort).toBe('oldest');
		expect(parse('sort=bogus').sort).toBe(DEFAULT_SORT);
	});

	it('coerces invalid page values to 1', () => {
		expect(parse('page=3').page).toBe(3);
		expect(parse('page=0').page).toBe(1);
		expect(parse('page=-2').page).toBe(1);
		expect(parse('page=abc').page).toBe(1);
		expect(parse('page=1.5').page).toBe(1);
	});
});

describe('buildPostQueryString', () => {
	it('omits every default so clean state produces an empty string', () => {
		expect(buildPostQueryString({ q: '', tag: null, sort: DEFAULT_SORT, page: 1 })).toBe('');
	});

	it('serializes only non-default fields', () => {
		expect(buildPostQueryString({ q: 'perf', page: 1 })).toBe('q=perf');
		expect(buildPostQueryString({ tag: 'design' })).toBe('tag=design');
		expect(buildPostQueryString({ sort: 'oldest' })).toBe('sort=oldest');
		expect(buildPostQueryString({ page: 2 })).toBe('page=2');
	});

	it('trims the query before serializing', () => {
		expect(buildPostQueryString({ q: '  perf  ' })).toBe('q=perf');
	});

	it('round-trips through parse to the same normalized state', () => {
		const original: PostQuery = { q: 'edge node', tag: 'performance', sort: 'oldest', page: 4 };
		const roundTripped = parsePostQuery(new URLSearchParams(buildPostQueryString(original)));
		expect(roundTripped).toEqual(original);
	});
});
