import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		tailwindcss(),
		// SvelteKit config (adapter, preprocess, …) lives in svelte.config.js.
		sveltekit(),
		// Resolves the browser build of Svelte and auto-cleans the DOM between tests.
		svelteTesting()
	],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
