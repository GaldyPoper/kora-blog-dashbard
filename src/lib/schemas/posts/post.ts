import { z } from 'zod';
import { hexColorSchema, isoDateTimeSchema, localeShema, paginatedSchema } from '../common/common';

export const postTranslationSchema = z.object({
	title: z.string(),
	excerpt: z.string(),
	body: z.string()
});

export const postAuthorSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatarColor: hexColorSchema
});

export const postSchema = z.object({
	id: z.string(),
	slug: z.string(),
	translations: z.record(localeShema, postTranslationSchema),
	tags: z.array(z.string()),
	author: postAuthorSchema,
	publishedAt: isoDateTimeSchema,
	readingTimeMinutes: z.number().int().nonnegative(),
	coverColor: hexColorSchema
});

export const paginatedPostsSchema = paginatedSchema(postSchema);

export type PostTranslation = z.infer<typeof postTranslationSchema>;
export type PostAuthor = z.infer<typeof postAuthorSchema>;
export type Post = z.infer<typeof postSchema>;
export type PaginatedPosts = z.infer<typeof paginatedPostsSchema>;
