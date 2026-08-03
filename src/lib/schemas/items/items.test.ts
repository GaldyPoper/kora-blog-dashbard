import { itemSchema, itemOwnerSchema, itemStatusSchema, itemChannelSchema } from './items';

const usdAmountSchemaSpy = vi.fn(),
	isoDateTimeSchemaSpy = vi.fn(),
	isoDateSchemaSpy = vi.fn();

vi.mock('../common/common', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../common/common')>();
	return {
		usdAmountSchema: actual.usdAmountSchema.refine((value) => {
			usdAmountSchemaSpy(value);
			return true;
		}),
		isoDateTimeSchema: actual.isoDateTimeSchema.refine((value) => {
			isoDateTimeSchemaSpy(value);
			return true;
		}),
		isoDateSchema: actual.isoDateSchema.refine((value) => {
			isoDateSchemaSpy(value);
			return true;
		})
	};
});

const mockItem = {
	id: 'cmp_0001',
	name: 'Upgrade — GA release #001',
	status: 'completed',
	channel: 'social',
	owner: {
		id: 'u_priya',
		name: 'Priya Iyer'
	},
	budget: 2500,
	spent: 2332.02,
	impressions: 325282,
	clicks: 17467,
	ctr: 0.0537,
	startDate: '2026-04-03',
	endDate: '2026-05-16',
	updatedAt: '2026-04-09T22:00:00Z',
	tags: []
};

describe('itemSchema unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('itemOwnerSchema', () => {
		it('correctly parse valid json', () => {
			expect(itemOwnerSchema.safeParse(mockItem.owner).success).toBe(true);
		});
		it('rejects an object missing required fields', () => {
			expect(itemOwnerSchema.safeParse({ id: 'u_priya' }).success).toBe(false);
		});
	});

	describe('itemStatusSchema', () => {
		const tests: [string, boolean][] = [
			['draft', true],
			['scheduled', true],
			['active', true],
			['paused', true],
			['completed', true],
			['archived', true],
			['non-existing', false],
			['', false]
		];
		it.each(tests)('correctly parse $0 as $1', (input, result) => {
			expect(itemStatusSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('itemChannelSchema', () => {
		const tests: [string, boolean][] = [
			['email', true],
			['sms', true],
			['web', true],
			['social', true],
			['push', true],
			['non-existing', false],
			['', false]
		];
		it.each(tests)('correctly parse $0 as $1', (input, result) => {
			expect(itemChannelSchema.safeParse(input).success).toBe(result);
		});
	});

	describe('itemSchema', () => {
		it('correctly parse valid json', () => {
			const result = itemSchema.safeParse(mockItem);
			expect(result.success).toBe(true);
			expect(usdAmountSchemaSpy).toHaveBeenCalledTimes(2);
			expect(isoDateSchemaSpy).toHaveBeenCalledTimes(2);
			expect(isoDateTimeSchemaSpy).toHaveBeenCalledTimes(1);
		});

		it('rejects an object missing required fields', () => {
			expect(itemSchema.safeParse({ id: 'cmp_0001' }).success).toBe(false);
		});

		it('rejects a ctr outside the 0-1 range', () => {
			const bad = { ...mockItem, ctr: 1.5 };
			expect(itemSchema.safeParse(bad).success).toBe(false);
		});

		it('rejects a non-integer impressions count', () => {
			const bad = { ...mockItem, impressions: 12.5 };
			expect(itemSchema.safeParse(bad).success).toBe(false);
		});
	});
});
