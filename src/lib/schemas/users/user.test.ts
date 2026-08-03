import { userSchema, userRoleSchema } from './user';

const emailSchemaSpy = vi.fn();

vi.mock('../common/common', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../common/common')>();
	return {
		emailSchema: actual.emailSchema.refine((value) => {
			emailSchemaSpy(value);
			return true;
		})
	};
});

const mockUser = {
	id: 'demo_admin',
	email: 'admin@demo.test',
	password: 'demo1234',
	name: 'Demo Admin',
	role: 'admin'
};

describe('userSchema unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('userRoleSchema', () => {
		const tests: [string, boolean][] = [
			['admin', true],
			['editor', true],
			['viewer', true],
			['non-existing', false],
			['', false]
		];
		it.each(tests)('correctly parse $0 as $1', (input, result) => {
			expect(userRoleSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('userSchema', () => {
		it('correctly parse valid json', () => {
			const result = userSchema.safeParse(mockUser);
			expect(result.success).toBe(true);
			expect(emailSchemaSpy).toHaveBeenCalledTimes(1);
		});

		it('rejects an object missing required fields', () => {
			expect(userSchema.safeParse({ id: 'demo_admin' }).success).toBe(false);
		});
	});
});
