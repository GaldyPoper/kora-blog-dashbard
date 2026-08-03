import { z } from 'zod';
import { postSchema, itemSchema, userSchema, type Post, type Item, type User } from '$lib/schemas';
import postsJson from '../../../mocks/posts.json';
import itemsJson from '../../../mocks/items.json';
import usersJson from '../../../mocks/users.json';

// The JSON files stand in for a database / upstream service. This is the server
// trust boundary: the raw data is `unknown` until it passes its schema, so the
// API can never serve malformed data.
function parseCollection<T extends z.ZodType>(name: string, schema: T, raw: unknown): z.infer<T>[] {
	const result = z.array(schema).safeParse(raw);
	if (!result.success) {
		throw new Error(`Invalid ${name} data:\n${z.prettifyError(result.error)}`);
	}
	return result.data;
}

export const getPosts = (): Post[] => parseCollection('posts', postSchema, postsJson);
export const getItems = (): Item[] => parseCollection('items', itemSchema, itemsJson);
export const getUsers = (): User[] => parseCollection('users', userSchema, usersJson);
