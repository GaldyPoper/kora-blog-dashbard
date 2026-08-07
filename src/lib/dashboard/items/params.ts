import { z } from 'zod';
import {
	itemStatusSchema,
	itemChannelSchema,
	type ItemStatus,
	type ItemChannel
} from '$lib/schemas';

export const itemSortKeySchema = z.enum([
	'name',
	'status',
	'channel',
	'owner',
	'budget',
	'spent',
	'ctr',
	'updatedAt'
]);
export type ItemSortKey = z.infer<typeof itemSortKeySchema>;

export const sortDirSchema = z.enum(['asc', 'desc']);
export type SortDir = z.infer<typeof sortDirSchema>;

export const DEFAULT_SORT: ItemSortKey = 'updatedAt';
export const DEFAULT_DIR: SortDir = 'desc';
export const ITEMS_PER_PAGE = 10;

export type ItemsQuery = {
	q: string;
	status: ItemStatus[];
	channel: ItemChannel[];
	sort: ItemSortKey;
	dir: SortDir;
	page: number;
	perPage: number;
};

/** Parse a positive-integer param, falling back when missing/invalid. */
function positiveInt(value: string | null, fallback: number): number {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : fallback;
}

function normalizeFacet<T extends string>(
	values: string[],
	schema: z.ZodType<T>,
	canonical: readonly T[]
): T[] {
	const valid = new Set<T>();
	for (const value of values) {
		const parsed = schema.safeParse(value);
		if (parsed.success) valid.add(parsed.data);
	}
	return canonical.filter((option) => valid.has(option));
}

/** Reads and normalizes the table's view state from a URL's query parameters. */
export function parseItemsQuery(searchParams: URLSearchParams): ItemsQuery {
	return {
		q: (searchParams.get('q') ?? '').trim(),
		status: normalizeFacet(
			searchParams.getAll('status'),
			itemStatusSchema,
			itemStatusSchema.options
		),
		channel: normalizeFacet(
			searchParams.getAll('channel'),
			itemChannelSchema,
			itemChannelSchema.options
		),
		sort: itemSortKeySchema.catch(DEFAULT_SORT).parse(searchParams.get('sort')),
		dir: sortDirSchema.catch(DEFAULT_DIR).parse(searchParams.get('dir')),
		page: positiveInt(searchParams.get('page'), 1),
		perPage: positiveInt(searchParams.get('perPage'), ITEMS_PER_PAGE)
	};
}

/**
 * Serializes table state into a canonical query string, omitting anything at
 * its default so shared URLs stay clean (`?status=active&sort=budget` rather
 * than a string with every default spelled out).
 */
export function buildItemsQueryString(query: Partial<ItemsQuery>): string {
	const params = new URLSearchParams();

	const q = query.q?.trim();
	if (q) params.set('q', q);

	for (const status of normalizeFacet(
		query.status ?? [],
		itemStatusSchema,
		itemStatusSchema.options
	)) {
		params.append('status', status);
	}
	for (const channel of normalizeFacet(
		query.channel ?? [],
		itemChannelSchema,
		itemChannelSchema.options
	)) {
		params.append('channel', channel);
	}

	if (query.sort && query.sort !== DEFAULT_SORT) params.set('sort', query.sort);
	if (query.dir && query.dir !== DEFAULT_DIR) params.set('dir', query.dir);
	if (query.page && query.page > 1) params.set('page', String(query.page));
	if (query.perPage && query.perPage !== ITEMS_PER_PAGE) {
		params.set('perPage', String(query.perPage));
	}

	return params.toString();
}
