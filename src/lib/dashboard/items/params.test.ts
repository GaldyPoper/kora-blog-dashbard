import {
	parseItemsQuery,
	buildItemsQueryString,
	DEFAULT_SORT,
	DEFAULT_DIR,
	ITEMS_PER_PAGE,
	type ItemsQuery
} from './params';

const parse = (search: string) => parseItemsQuery(new URLSearchParams(search));

const defaults: ItemsQuery = {
	q: '',
	status: [],
	channel: [],
	sort: DEFAULT_SORT,
	dir: DEFAULT_DIR,
	page: 1,
	perPage: ITEMS_PER_PAGE
};

describe('parseItemsQuery', () => {
	it('returns defaults for an empty query string', () => {
		expect(parse('')).toEqual(defaults);
	});

	it('reads and trims the text query', () => {
		expect(parse('q=%20autumn%20').q).toBe('autumn');
	});

	it('collects multiple valid facet values and drops invalid/duplicate ones', () => {
		expect(parse('status=active&status=draft&status=bogus&status=active').status).toEqual([
			'draft',
			'active'
		]);
		expect(parse('channel=push&channel=email').channel).toEqual(['email', 'push']);
	});

	it('normalizes facet order to the enum order regardless of input order', () => {
		// Input order paused,draft -> canonical order draft,paused.
		expect(parse('status=paused&status=draft').status).toEqual(['draft', 'paused']);
	});

	it('accepts known sort keys and directions, falling back on unknown ones', () => {
		expect(parse('sort=budget&dir=asc')).toMatchObject({ sort: 'budget', dir: 'asc' });
		expect(parse('sort=bogus').sort).toBe(DEFAULT_SORT);
		expect(parse('dir=sideways').dir).toBe(DEFAULT_DIR);
	});

	it('coerces invalid page / perPage values to their defaults', () => {
		expect(parse('page=3&perPage=25')).toMatchObject({ page: 3, perPage: 25 });
		expect(parse('page=0').page).toBe(1);
		expect(parse('page=-2&perPage=abc')).toMatchObject({ page: 1, perPage: ITEMS_PER_PAGE });
	});
});

describe('buildItemsQueryString', () => {
	it('omits every default so clean state produces an empty string', () => {
		expect(buildItemsQueryString(defaults)).toBe('');
	});

	it('serializes only non-default fields', () => {
		expect(buildItemsQueryString({ ...defaults, q: 'push', page: 2 })).toBe('q=push&page=2');
	});

	it('emits facets in canonical order and skips invalid values', () => {
		const qs = buildItemsQueryString({
			...defaults,
			status: ['paused', 'draft', 'nope' as never]
		});
		expect(qs).toBe('status=draft&status=paused');
	});

	it('round-trips: parse(build(x)) equals the normalized state', () => {
		const state: ItemsQuery = {
			q: 'beta',
			status: ['draft', 'active'],
			channel: ['sms'],
			sort: 'budget',
			dir: 'asc',
			page: 4,
			perPage: 25
		};
		expect(parseItemsQuery(new URLSearchParams(buildItemsQueryString(state)))).toEqual(state);
	});
});
