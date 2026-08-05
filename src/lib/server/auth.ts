import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { getUsers } from '$lib/server/data';
import type { PublicUser, User } from '$lib/schemas';

export const SESSION_COOKIE = 'kora_session';
const secret = env.AUTH_SECRET ?? 'dev-insecure-secret-change-me';

function sign(value: string): string {
	return createHmac('sha256', secret).update(value).digest('base64url');
}

/** Build the cookie value for a logged-in user: `<userId>.<signature>`. */
export function createSessionToken(userId: string): string {
	return `${userId}.${sign(userId)}`;
}

/**
 * Verify a cookie value and return the user id it vouches for, or null if the
 * token is missing, malformed, or the signature doesn't match (tampered).
 */
export function verifySessionToken(token: string | undefined): string | null {
	if (!token) return null;

	// The signature is base64url (no dots), so the last dot is always the separator.
	const separator = token.lastIndexOf('.');
	if (separator <= 0) return null;

	const userId = token.slice(0, separator);
	const signature = token.slice(separator + 1);

	const expected = sign(userId);
	const provided = Buffer.from(signature);
	const wanted = Buffer.from(expected);

	// Constant-time compare; timingSafeEqual requires equal lengths.
	if (provided.length !== wanted.length) return null;
	if (!timingSafeEqual(provided, wanted)) return null;

	return userId;
}

/** Look up a user by email + password against the mock store. */
export function authenticate(email: string, password: string): User | null {
	const user = getUsers().find((u) => u.email === email);
	if (!user || user.password !== password) return null;
	return user;
}

export function getUserById(id: string): User | null {
	return getUsers().find((u) => u.id === id) ?? null;
}

/** Drop the password so a user object is safe to send to the client. */
export function toPublicUser(user: User): PublicUser {
	const { password: _password, ...rest } = user;
	return rest;
}
