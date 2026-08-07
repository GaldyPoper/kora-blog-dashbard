import type { Item, ItemStatus, ItemChannel } from '$lib/schemas';
import { itemStatusSchema, itemChannelSchema } from '$lib/schemas';
import type { ItemsQuery, ItemSortKey } from './params';

/**
 * Table operations over the items collection: text search, multi-facet
 * filtering, sorting and pagination — the work a real paginated/filterable API
 * would do. This pure function runs on the server, inside the `/api/items`
 * endpoint; the client-rendered dashboard fetches that endpoint so it only ever
 * pulls one parametrized page over the wire, never the whole dataset.
 */

export type FacetCounts = {
	status: Record<ItemStatus, number>;
	channel: Record<ItemChannel, number>;
};

export type ItemsResult = {
	rows: Item[];
	total: number;
	facets: FacetCounts;
};

const comparators: Record<ItemSortKey, (a: Item, b: Item) => number> = {
	name: (a, b) => a.name.localeCompare(b.name),
	status: (a, b) => a.status.localeCompare(b.status),
	channel: (a, b) => a.channel.localeCompare(b.channel),
	owner: (a, b) => a.owner.name.localeCompare(b.owner.name),
	budget: (a, b) => a.budget - b.budget,
	spent: (a, b) => a.spent - b.spent,
	ctr: (a, b) => a.ctr - b.ctr,
	updatedAt: (a, b) => a.updatedAt.localeCompare(b.updatedAt)
};

function matchesText(item: Item, terms: string[]): boolean {
	if (terms.length === 0) return true;
	const haystack = item.name.toLowerCase();
	return terms.every((term) => haystack.includes(term));
}

function emptyCounts<T extends string>(options: readonly T[]): Record<T, number> {
	return Object.fromEntries(options.map((option) => [option, 0])) as Record<T, number>;
}

function countFacets(items: Item[]): FacetCounts {
	const status = emptyCounts(itemStatusSchema.options);
	const channel = emptyCounts(itemChannelSchema.options);
	for (const item of items) {
		status[item.status] += 1;
		channel[item.channel] += 1;
	}
	return { status, channel };
}

/**
 * Applies the full query to the collection. Returns the current page of rows,
 * the total match count, and per-facet counts for the filter UI.
 */
export function queryItems(items: Item[], query: ItemsQuery): ItemsResult {
	const terms = query.q.trim().toLowerCase().split(/\s+/).filter(Boolean);

	const textMatched = items.filter((item) => matchesText(item, terms));
	const facets = countFacets(textMatched);

	const statusSet = new Set(query.status);
	const channelSet = new Set(query.channel);
	const filtered = textMatched.filter(
		(item) =>
			(statusSet.size === 0 || statusSet.has(item.status)) &&
			(channelSet.size === 0 || channelSet.has(item.channel))
	);

	const direction: number = query.dir === 'asc' ? 1 : -1;
	const compare = comparators[query.sort];
	const sorted = [...filtered].sort((a, b) => compare(a, b) * direction);

	const total = sorted.length;
	const start = (query.page - 1) * query.perPage;
	const rows = sorted.slice(start, start + query.perPage);

	return { rows, total, facets };
}
