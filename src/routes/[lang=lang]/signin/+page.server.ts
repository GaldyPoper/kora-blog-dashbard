import type { Actions } from './$types';
import { getUsers } from '$lib/server/data';
import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { SESSION_COOKIE, createSessionToken } from '$lib/server/auth';

const schema = z.object({
	email: z.email(),
	password: z.string()
});

// Only allow redirects to local paths ("/foo").
function safeRedirect(target: FormDataEntryValue | null): string | null {
	if (typeof target === 'string' && /^\/[^/\\]/.test(target)) return target;
	return null;
}

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		const isValidData = schema.safeParse({ email, password });
		if (isValidData.error) return fail(400, { error: true });

		const user = getUsers().find((user) => user.email === email);
		if (!user) return fail(400, { error: true });

		const passwordMatch = user.password === password;
		if (!passwordMatch) return fail(400, { error: true });

		cookies.set(SESSION_COOKIE, createSessionToken(user.id), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev, // allow the cookie over http://localhost in dev
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		const redirectTarget = safeRedirect(data.get('redirectTo'));
		if (redirectTarget) {
			redirect(303, redirectTarget);
		}
	}
} satisfies Actions;
