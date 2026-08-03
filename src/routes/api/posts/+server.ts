import { json } from '@sveltejs/kit';
import { getPosts } from '$lib/server/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => json(getPosts());
