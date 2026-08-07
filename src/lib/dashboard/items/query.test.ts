import type { Item } from '$lib/schemas';
import { queryItems } from './query';
import { DEFAULT_SORT, DEFAULT_DIR, ITEMS_PER_PAGE, type ItemsQuery } from './params';

let seq = 0;
function item(overrides: Partial<Item> = {}): Item {
	seq += 1;
	return {
		id: `cmp_${seq}`,
		name: `Campaign ${seq}`,
		status: 'active',
		channel: 'email',
		owner: { id: 'u_a', name: 'Anna Becker' },
		budget: 1000,
		spent: 500,
		impressions: 0,
		clicks: 0,
		ctr: 0.01,
		startDate: '2026-01-01',
		endDate: '2026-02-01',
		updatedAt: '2026-01-01T00:00:00Z',
		tags: [],
		...overrides
	};
}

const query = (overrides: Partial<ItemsQuery> = {}): ItemsQuery => ({
	q: '',
	status: [],
	channel: [],
	sort: DEFAULT_SORT,
	dir: DEFAULT_DIR,
	page: 1,
	perPage: ITEMS_PER_PAGE,
	...overrides
});

describe('queryItems', () => {
	it('filters by case-insensitive multi-term name search (AND)', () => {
		const items = [
			item({ name: 'Autumn Beta program' }),
			item({ name: 'Winter Beta program' }),
			item({ name: 'Autumn launch' })
		];
		const { rows, total } = queryItems(items, query({ q: 'autumn beta' }));
		expect(total).toBe(1);
		expect(rows[0].name).toBe('Autumn Beta program');
	});

	it('filters by a multi-value status facet (OR within the facet)', () => {
		const items = [
			item({ status: 'draft' }),
			item({ status: 'active' }),
			item({ status: 'paused' })
		];
		const { rows } = queryItems(items, query({ status: ['draft', 'paused'] }));
		expect(rows.map((r) => r.status).sort()).toEqual(['draft', 'paused']);
	});

	it('combines status and channel facets (AND across facets)', () => {
		const items = [
			item({ status: 'active', channel: 'sms' }),
			item({ status: 'active', channel: 'email' }),
			item({ status: 'draft', channel: 'sms' })
		];
		const { total } = queryItems(items, query({ status: ['active'], channel: ['sms'] }));
		expect(total).toBe(1);
	});

	it('sorts by a numeric column in both directions', () => {
		const items = [item({ budget: 300 }), item({ budget: 100 }), item({ budget: 200 })];
		expect(
			queryItems(items, query({ sort: 'budget', dir: 'asc' })).rows.map((r) => r.budget)
		).toEqual([100, 200, 300]);
		expect(
			queryItems(items, query({ sort: 'budget', dir: 'desc' })).rows.map((r) => r.budget)
		).toEqual([300, 200, 100]);
	});

	it('sorts by owner name via the nested field', () => {
		const items = [
			item({ owner: { id: 'u_o', name: 'Omar' } }),
			item({ owner: { id: 'u_a', name: 'Anna' } })
		];
		expect(
			queryItems(items, query({ sort: 'owner', dir: 'asc' })).rows.map((r) => r.owner.name)
		).toEqual(['Anna', 'Omar']);
	});

	it('paginates: total reflects the full match, rows only the page', () => {
		const items = Array.from({ length: 25 }, () => item());
		const result = queryItems(items, query({ perPage: 10, page: 3 }));
		expect(result.total).toBe(25);
		expect(result.rows).toHaveLength(5);
	});

	it('returns an empty page when the page is past the end', () => {
		const items = Array.from({ length: 5 }, () => item());
		expect(queryItems(items, query({ perPage: 10, page: 2 })).rows).toHaveLength(0);
	});

	it('reports facet counts against the text-filtered set, not the facet selection', () => {
		const items = [
			item({ name: 'Beta one', status: 'draft', channel: 'email' }),
			item({ name: 'Beta two', status: 'active', channel: 'sms' }),
			item({ name: 'Gamma', status: 'draft', channel: 'email' })
		];
		const { facets } = queryItems(items, query({ q: 'beta', status: ['active'] }));
		// Counts cover both "Beta" rows even though the status filter selects one.
		expect(facets.status.draft).toBe(1);
		expect(facets.status.active).toBe(1);
		expect(facets.channel.email).toBe(1);
		expect(facets.channel.sms).toBe(1);
		expect(facets.status.archived).toBe(0);
	});
});
