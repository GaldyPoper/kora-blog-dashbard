// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { PublicUser } from '$lib/schemas';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: PublicUser | null;
		}
		interface PageData {
			user?: PublicUser | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
