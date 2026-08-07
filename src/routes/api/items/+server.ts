import { json, error } from '@sveltejs/kit';
import { getItems } from '$lib/server/data';
import { parseItemsQuery, queryItems } from '$lib/dashboard/items';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, locals, setHeaders }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const query = parseItemsQuery(url.searchParams);
	const items = getItems();
	const { rows, total, facets } = queryItems(items, query);

	// Per-user, per-request data — never cache at the CDN.
	setHeaders({ 'cache-control': 'private, no-store' });

	return json({ rows, total, grandTotal: items.length, facets });
};
