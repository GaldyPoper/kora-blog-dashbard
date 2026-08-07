import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Server-side auth guard for client-side navigations. A server load runs on the
// server for *every* navigation (including SPA nav), and before the page
// renders — so it redirects anonymous users before the dashboard shell or any
// data is shown. The hook guard (hooks.server.ts) covers the other case: the
// initial HTML request for this ssr=false route, where a server load doesn't run.
export const load: PageServerLoad = ({ locals, params, url }) => {
	if (!locals.user) {
		const redirectTo = encodeURIComponent(`/${params.lang}/dashboard${url.search}`);
		redirect(303, `/${params.lang}/login?redirectTo=${redirectTo}`);
	}
};
