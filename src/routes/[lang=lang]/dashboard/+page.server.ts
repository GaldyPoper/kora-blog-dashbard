import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load: PageServerLoad = ({ locals, params }) => {
	if (!locals.user) {
		const redirectTo = encodeURIComponent(`/${params.lang}/dashboard`);
		redirect(303, `/${params.lang}/login?redirectTo=${redirectTo}`);
	}

	return { user: locals.user };
};
