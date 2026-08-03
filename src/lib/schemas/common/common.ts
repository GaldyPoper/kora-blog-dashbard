import { z } from 'zod';

/**
 * Reusable field schemas.
 */

export const localeShema = z.enum(['en', 'de']);

export const hexColorSchema = z
	.string()
	.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Must be a hex color like #a855f7');

export const isoDateTimeSchema = z.iso.datetime();

export const isoDateSchema = z.iso.date();

export const usdAmountSchema = z.number().nonnegative();

export const emailSchema = z.email();

export type Locale = z.infer<typeof localeShema>;
