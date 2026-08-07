import { parseItemsQuery } from '$lib/dashboard/items';
import type { FacetCounts } from '$lib/dashboard/items';
import type { Item } from '$lib/schemas';
import type { PageLoad } from './$types';

export const ssr = false;

export type ItemsPayload = {
	rows: Item[];
	total: number;
	grandTotal: number;
	facets: FacetCounts;
};

export const load: PageLoad = ({ url, fetch }) => {
	const query = parseItemsQuery(url.searchParams);

	const result = fetch(`/api/items${url.search}`).then(async (res) => {
		if (!res.ok) throw new Error(`Items request failed: ${res.status}`);
		return (await res.json()) as ItemsPayload;
	});

	return { query, result };
};
