import type { ParamMatcher } from '@sveltejs/kit';
import { localeShema, type Locale } from '$lib/schemas';

export const match = ((param): param is Locale =>
	localeShema.safeParse(param).success) satisfies ParamMatcher;
