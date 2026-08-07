import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { defaultLocale, stripLocale } from '$lib/i18n';
import { localeShema } from '$lib/schemas';
import { SESSION_COOKIE, verifySessionToken, getUserById, toPublicUser } from '$lib/server/auth';

// Turn the session cookie into `event.locals.user` (or null) for every request,
// so loads, actions and endpoints can read the current user without re-parsing.
const authHandle: Handle = async ({ event, resolve }) => {
	const userId = verifySessionToken(event.cookies.get(SESSION_COOKIE));
	const user = userId ? getUserById(userId) : null;
	event.locals.user = user ? toPublicUser(user) : null;
	return resolve(event);
};

// Server-side guard for the authenticated area. Because it runs in the hook, it
// fires on every request — including the initial HTML of client-rendered routes
// (`ssr = false`) — so anonymous users are redirected before any shell is served,
// not after the client boots.
const guardHandle: Handle = async ({ event, resolve }) => {
	const path = stripLocale(event.url.pathname);
	const isProtected = path === '/dashboard' || path.startsWith('/dashboard/');
	if (isProtected && !event.locals.user) {
		const [, first] = event.url.pathname.match(/^\/([^/]+)/) ?? [];
		const lang = localeShema.safeParse(first).success ? first : defaultLocale;
		const target = encodeURIComponent(event.url.pathname + event.url.search);
		redirect(303, `/${lang}/login?redirectTo=${target}`);
	}
	return resolve(event);
};

const localeHandle: Handle = async ({ event, resolve }) => {
	const [, first] = event.url.pathname.match(/^\/([^/]+)/) ?? [];
	const lang = localeShema.safeParse(first).success ? first : defaultLocale;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};

export const handle = sequence(authHandle, guardHandle, localeHandle);
