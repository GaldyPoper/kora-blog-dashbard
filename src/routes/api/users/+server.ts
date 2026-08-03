import { json } from '@sveltejs/kit';
import { getUsers } from '$lib/server/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => json(getUsers());
