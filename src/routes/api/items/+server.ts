import { json } from '@sveltejs/kit';
import { getItems } from '$lib/server/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => json(getItems());
