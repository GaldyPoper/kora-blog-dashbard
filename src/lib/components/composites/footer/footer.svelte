<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type FooterProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: FooterProps = $props();

	const { t } = $derived(createTranslator(page.data.locale));
</script>

<footer class={twMerge('kora-grid-container bg-bg-soft py-4', className)} {...props}>
	<section class="kora-container-inner flex justify-center">
		<p>{t('footer.copy')}</p>
	</section>
</footer>
