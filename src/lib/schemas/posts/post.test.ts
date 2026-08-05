import { postSchema, postAuthorSchema, postTranslationSchema } from './post';

const hexColorSchemaSpy = vi.fn(),
	isoDateTimeSchemaSpy = vi.fn(),
	localeSchemaSpy = vi.fn();

vi.mock('../common/common', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../common/common')>();
	return {
		hexColorSchema: actual.hexColorSchema.refine((value) => {
			hexColorSchemaSpy(value);
			return true;
		}),
		isoDateTimeSchema: actual.isoDateTimeSchema.refine((value) => {
			isoDateTimeSchemaSpy(value);
			return true;
		}),
		localeShema: actual.localeShema.refine((value) => {
			localeSchemaSpy(value);
			return true;
		}),
		paginatedSchema: actual.paginatedSchema
	};
});

const mockPost = {
	id: 'post_000',
	slug: 'sub-second-lcp-on-a-content-site',
	translations: {
		en: {
			title: 'Sub-second LCP on a content site',
			excerpt:
				"We've been quietly rebuilding the way our content is delivered, and the change has been more interesting than we expected. The numbers are nice — TTFB is down, LCP is well under ta…",
			body: "We've been quietly rebuilding the way our content is delivered, and the change has been more interesting than we expected. The numbers are nice — TTFB is down, LCP is well under target, hydration is barely a blip — but the more useful story is what we had to give up to get there.\n\nThe first lesson was that almost everything we used to ship to the client was, in retrospect, decoration. Real interactivity lives in a handful of components. Everything else can be HTML and CSS, served at the edge, and forgotten about.\n\nWe started keeping a short list of choices that surprised us. Streaming the heavy data instead of blocking on it. Reaching for a CSS variable before a prop. Letting the URL hold filter state instead of a store. None of these are clever. All of them paid off.\n\nIf you're considering a similar move, the advice we'd give is the same advice we wish someone had pushed harder on us: measure first, set a budget, and put the budget in CI. A goal that isn't enforced is a suggestion.\n\nWe'll go deeper on the migration mechanics in a follow-up. For now, the headline is that the boring choices were the right ones, and we should have made them sooner."
		},
		de: {
			title: 'LCP unter einer Sekunde auf einer Content-Seite',
			excerpt:
				'Wir haben been quietly rebuilding the way our content is delivered, and the change has been more interesting than we expected. The numbers are nice — TTFB is down, LCP is well unde…',
			body: "Wir haben been quietly rebuilding the way our content is delivered, and the change has been more interesting than we expected. The numbers are nice — TTFB is down, LCP is well under target, hydration is barely a blip — but the more useful story is what we had to give up to get there.\n\nDie erste Lektion was that almost everything we used to ship to the client was, in retrospect, decoration. Real interactivity lives in a handful of components. Everything else can be HTML and CSS, served at the edge, and forgotten about.\n\nWir begannen keeping a short list of choices that surprised us. Streaming the heavy data instead of blocking on it. Reaching for a CSS variable before a prop. Letting the URL hold filter state instead of a store. None of these are clever. All of them paid off.\n\nWenn du considering a similar move, the advice we'd give is the same advice we wish someone had pushed harder on us: measure first, set a budget, and put the budget in CI. A goal that isn't enforced is a suggestion.\n\nWir gehen tiefer on the migration mechanics in a follow-up. For now, the headline is that the boring choices were the right ones, and we should have made them sooner."
		}
	},
	tags: ['performance', 'engineering'],
	author: {
		id: 'u_omar',
		name: 'Omar Haddad',
		avatarColor: '#a855f7'
	},
	publishedAt: '2026-05-31T00:00:00Z',
	readingTimeMinutes: 3,
	coverColor: '#1e293b'
};

describe('postSchema unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('postTranslationSchema', () => {
		it('correctly parse valid json', () => {
			expect(postTranslationSchema.safeParse(mockPost.translations.en).success).toBe(true);
		});
		it('rejects an object missing required fields', () => {
			expect(postTranslationSchema.safeParse({ title: 'post_title' }).success).toBe(false);
		});
	});

	describe('postAuthorSchema', () => {
		it('correctly parse valid json', () => {
			const result = postAuthorSchema.safeParse(mockPost.author);
			expect(result.success).toBe(true);
			expect(hexColorSchemaSpy).toHaveBeenCalledTimes(1);
		});
		it('rejects an object missing required fields', () => {
			expect(postSchema.safeParse({ id: 'post_000' }).success).toBe(false);
		});
	});

	describe('postSchema', () => {
		it('correctly parse valid json', () => {
			const result = postSchema.safeParse(mockPost);
			expect(result.success).toBe(true);
			expect(hexColorSchemaSpy).toHaveBeenCalledTimes(2);
			expect(isoDateTimeSchemaSpy).toHaveBeenCalledTimes(1);
			expect(localeSchemaSpy).toHaveBeenCalledTimes(2);
		});

		it('rejects an object missing required fields', () => {
			expect(postSchema.safeParse({ id: 'post_000' }).success).toBe(false);
		});
	});
});
