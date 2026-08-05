<script lang="ts">
	import { Button } from '$lib/components/primitives';
	import { createTranslator } from '$lib/i18n';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { form }: PageProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));

	type InputProps = {
		id: string;
		type: string;
		label: string;
	};
</script>

{#snippet input({ id, type, label }: InputProps)}
	<div class="flex w-full flex-col gap-2">
		<label for={id}>{label}</label>
		<input
			{type}
			{id}
			name={id}
			required
			class="w-full rounded-sm border px-4 py-2"
			placeholder={label}
		/>
	</div>
{/snippet}

<div class="flex items-center justify-center py-10">
	<section
		class="flex h-[80vh] w-full max-w-150 flex-col items-center justify-center rounded-md bg-bg-soft p-10"
	>
		<h1 class="heading-2">{t('login.title')}</h1>
		<form use:enhance class="mt-20 flex size-full flex-col gap-4" method="POST">
			<input
				type="hidden"
				name="redirectTo"
				value={page.url.searchParams.get('redirectTo') ?? ''}
			/>
			{@render input({
				id: 'email',
				type: 'email',
				label: t('login.email')
			})}
			{@render input({
				id: 'password',
				type: 'password',
				label: t('login.password')
			})}
			{#if form?.error}
				<p class="text-error">{t('login.error')}</p>
			{/if}
			<div class="mt-6 flex items-center gap-4 self-center">
				<Button type="submit">{t('login.submit')}</Button>
				<Button asChild variant="outline">
					{#snippet child({ props })}
						<a href={resolve(`/${locale}/forgot-password`)} {...props}>
							{t('login.forgot.password')}
						</a>
					{/snippet}
				</Button>
			</div>
		</form>
	</section>
</div>
