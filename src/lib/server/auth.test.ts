import {
	SESSION_COOKIE,
	createSessionToken,
	verifySessionToken,
	authenticate,
	getUserById,
	toPublicUser
} from './auth';
import { getUsers } from './data';

const seedUser = getUsers()[0];

describe('auth unit tests', () => {
	describe('SESSION_COOKIE', () => {
		it('is the expected cookie name', () => {
			expect(SESSION_COOKIE).toBe('kora_session');
		});
	});

	describe('createSessionToken', () => {
		it('produces a `<userId>.<signature>` shape with a base64url signature', () => {
			const token = createSessionToken('demo_admin');
			const [userId, signature, ...rest] = token.split('.');
			expect(userId).toBe('demo_admin');
			expect(rest).toHaveLength(0);
			expect(signature).toMatch(/^[A-Za-z0-9_-]+$/); // base64url, no +/= padding
		});

		it('is deterministic for the same user id', () => {
			expect(createSessionToken('demo_admin')).toBe(createSessionToken('demo_admin'));
		});

		it('produces different signatures for different user ids', () => {
			expect(createSessionToken('demo_admin')).not.toBe(createSessionToken('demo_editor'));
		});
	});

	describe('verifySessionToken', () => {
		it('round-trips a token back to its user id', () => {
			expect(verifySessionToken(createSessionToken('demo_admin'))).toBe('demo_admin');
		});

		it('round-trips a user id that itself contains dots', () => {
			// Guards the lastIndexOf-based split: only the final dot is the separator.
			const token = createSessionToken('a.b.c');
			expect(token.startsWith('a.b.c.')).toBe(true);
			expect(verifySessionToken(token)).toBe('a.b.c');
		});

		it('returns null when the token is missing', () => {
			expect(verifySessionToken(undefined)).toBeNull();
			expect(verifySessionToken('')).toBeNull();
		});

		it('returns null for a malformed token with no separator', () => {
			expect(verifySessionToken('no-dot-here')).toBeNull();
		});

		it('returns null when there is no user id before the separator', () => {
			expect(verifySessionToken('.somesignature')).toBeNull();
		});

		it('returns null when the signature is empty', () => {
			expect(verifySessionToken('demo_admin.')).toBeNull();
		});

		it('returns null when the signature is tampered with', () => {
			const token = createSessionToken('demo_admin');
			const tampered = `${token.slice(0, -1)}${token.at(-1) === 'A' ? 'B' : 'A'}`;
			expect(tampered).not.toBe(token);
			expect(verifySessionToken(tampered)).toBeNull();
		});

		it('rejects a valid signature paired with a different user id (forgery)', () => {
			const token = createSessionToken('demo_admin');
			const signature = token.slice(token.lastIndexOf('.') + 1);
			expect(verifySessionToken(`demo_editor.${signature}`)).toBeNull();
		});
	});

	describe('authenticate', () => {
		it('returns the user for valid credentials', () => {
			const user = authenticate(seedUser.email, seedUser.password);
			expect(user).not.toBeNull();
			expect(user?.id).toBe(seedUser.id);
		});

		it('returns null for a wrong password', () => {
			expect(authenticate(seedUser.email, `${seedUser.password}-wrong`)).toBeNull();
		});

		it('returns null for an unknown email', () => {
			expect(authenticate('nobody@demo.test', seedUser.password)).toBeNull();
		});
	});

	describe('getUserById', () => {
		it('returns the user for a known id', () => {
			expect(getUserById(seedUser.id)?.email).toBe(seedUser.email);
		});

		it('returns null for an unknown id', () => {
			expect(getUserById('does-not-exist')).toBeNull();
		});
	});

	describe('toPublicUser', () => {
		it('strips the password but keeps the public fields', () => {
			const publicUser = toPublicUser(seedUser);

			expect(publicUser).not.toHaveProperty('password');
			expect(publicUser).toEqual({
				id: seedUser.id,
				email: seedUser.email,
				name: seedUser.name,
				role: seedUser.role
			});
		});

		it('does not mutate the original user', () => {
			const original = { ...seedUser };
			toPublicUser(seedUser);
			expect(seedUser).toEqual(original);
		});
	});
});
