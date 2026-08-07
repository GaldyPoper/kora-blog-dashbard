<script lang="ts">
	import { tick } from 'svelte';
	import { useId } from '$lib/utils/use-id';
	import { Listbox } from '$lib/state/listbox.svelte';

	export type MultiSelectOption = { value: string; label: string };

	type Props = {
		options: MultiSelectOption[];
		selected: string[];
		onChange: (values: string[]) => void;
		label: string;
		placeholder: string;
		id?: string;
		class?: string;
	};

	let {
		options,
		selected,
		onChange,
		label,
		placeholder,
		id,
		class: className = ''
	}: Props = $props();

	const fallbackId = useId('multiselect');
	const listboxId = $derived(`${id ?? fallbackId}-listbox`);

	// Reusable runes-based interaction state (open flag + active option).
	const listbox = new Listbox();

	let root = $state<HTMLDivElement>();
	let triggerEl = $state<HTMLButtonElement>();
	let listEl = $state<HTMLUListElement>();

	const selectedSet = $derived(new Set(selected));
	const summary = $derived(
		selected.length === 0
			? placeholder
			: options
					.filter((o) => selectedSet.has(o.value))
					.map((o) => o.label)
					.join(', ')
	);

	function focusOption(index: number) {
		listEl?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus();
	}

	async function openList(index = firstRelevantIndex()) {
		listbox.openAt(index);
		await tick();
		focusOption(listbox.activeIndex);
	}
	function closeList(returnFocus = true) {
		listbox.close();
		if (returnFocus) triggerEl?.focus();
	}
	function firstRelevantIndex() {
		const i = options.findIndex((o) => selectedSet.has(o.value));
		return i >= 0 ? i : 0;
	}

	function toggleValue(value: string) {
		const nextValues = selected.includes(value)
			? selected.filter((v) => v !== value)
			: [...selected, value];
		onChange(options.filter((o) => nextValues.includes(o.value)).map((o) => o.value));
	}

	async function moveActive(index: number) {
		listbox.setActive(index, options.length);
		await tick();
		focusOption(listbox.activeIndex);
	}

	let typeahead = '';
	let typeaheadTimer: ReturnType<typeof setTimeout>;
	function onType(char: string) {
		clearTimeout(typeaheadTimer);
		typeahead += char.toLowerCase();
		typeaheadTimer = setTimeout(() => (typeahead = ''), 500);
		const match = options.findIndex((o) => o.label.toLowerCase().startsWith(typeahead));
		if (match >= 0) moveActive(match);
	}

	function onTriggerKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openList();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			openList(options.length - 1);
		}
	}

	function onOptionKeydown(e: KeyboardEvent, index: number) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				moveActive(index + 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				moveActive(index - 1);
				break;
			case 'Home':
				e.preventDefault();
				moveActive(0);
				break;
			case 'End':
				e.preventDefault();
				moveActive(options.length - 1);
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				toggleValue(options[index].value);
				break;
			case 'Escape':
				e.preventDefault();
				closeList();
				break;
			case 'Tab':
				closeList(false);
				break;
			default:
				if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
					e.preventDefault();
					onType(e.key);
				}
		}
	}

	$effect(() => {
		if (!listbox.open) return;
		const onPointerDown = (e: PointerEvent) => {
			if (root && !root.contains(e.target as Node)) closeList(false);
		};
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => window.removeEventListener('pointerdown', onPointerDown, true);
	});
</script>

<div class={`relative ${className}`} bind:this={root}>
	<button
		type="button"
		bind:this={triggerEl}
		aria-haspopup="listbox"
		aria-expanded={listbox.open}
		aria-controls={listbox.open ? listboxId : undefined}
		onclick={() => (listbox.open ? closeList(false) : openList())}
		onkeydown={onTriggerKeydown}
		class="inline-flex min-w-40 items-center justify-between gap-2 rounded-lg border border-border bg-bg-soft px-3 py-2 text-fg focus-visible:outline-2 focus-visible:outline-accent"
	>
		<span class="sr-only">{label}: </span>
		<span class="max-w-44 truncate">{summary}</span>
		<span aria-hidden="true" class="text-muted">▾</span>
	</button>

	{#if listbox.open}
		<ul
			bind:this={listEl}
			id={listboxId}
			role="listbox"
			aria-multiselectable="true"
			aria-label={label}
			class="absolute top-full left-0 z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-lg border border-border bg-bg-elev py-1 shadow-lg"
		>
			{#each options as option, i (option.value)}
				<li
					role="option"
					aria-selected={selectedSet.has(option.value)}
					tabindex={i === listbox.activeIndex ? 0 : -1}
					onclick={() => toggleValue(option.value)}
					onkeydown={(e) => onOptionKeydown(e, i)}
					class="flex cursor-pointer items-center gap-2 px-3 py-2 text-fg outline-none hover:bg-bg-soft focus:bg-bg-soft aria-selected:text-accent-ink"
				>
					<span aria-hidden="true" class="w-4 text-accent-ink">
						{selectedSet.has(option.value) ? '✓' : ''}
					</span>
					{option.label}
				</li>
			{/each}
		</ul>
	{/if}
</div>
