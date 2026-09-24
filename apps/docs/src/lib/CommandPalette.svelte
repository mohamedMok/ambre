<script lang="ts">
	import { goto } from '$app/navigation';
	import Glyph from './Glyph.svelte';
	import { searchable } from './sections';

	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let active = $state(0);

	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return searchable;
		return searchable
			.map((item) => {
				const label = item.label.toLowerCase();
				const score = label.startsWith(q)
					? 0
					: label.includes(q)
						? 1
						: `${item.summary} ${item.group}`.toLowerCase().includes(q)
							? 2
							: -1;
				return { item, score };
			})
			.filter((entry) => entry.score >= 0)
			.sort((a, b) => a.score - b.score)
			.map((entry) => entry.item);
	});

	$effect(() => {
		query;
		active = 0;
	});

	export function open() {
		query = '';
		dialog?.showModal();
		queueMicrotask(() => input?.focus());
	}

	function choose(href: string) {
		dialog?.close();
		goto(href);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			active = Math.min(active + 1, results.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (event.key === 'Enter' && results[active]) {
			event.preventDefault();
			choose(results[active].href);
		}
		queueMicrotask(() =>
			dialog?.querySelector(`#palette-option-${active}`)?.scrollIntoView({ block: 'nearest' })
		);
	}

	function onBackdrop(event: MouseEvent) {
		if (event.target === dialog) dialog?.close();
	}
</script>

<svelte:window
	onkeydown={(event) => {
		const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]');
		if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
			event.preventDefault();
			open();
		}
	}}
/>

<dialog class="palette" bind:this={dialog} aria-label="Search the documentation" onclick={onBackdrop}>
	<div class="palette-field">
		<Glyph name="search" size={20} />
		<input
			bind:this={input}
			bind:value={query}
			type="search"
			placeholder="Search components, foundations, and guides"
			role="combobox"
			aria-expanded="true"
			aria-controls="palette-list"
			aria-activedescendant={results.length ? `palette-option-${active}` : undefined}
			aria-autocomplete="list"
			onkeydown={onKeydown}
		/>
		<kbd>Esc</kbd>
	</div>
	{#if results.length}
		<ul id="palette-list" class="palette-list" role="listbox" aria-label="Results">
			{#each results as item, index (item.href + item.group)}
				<li
					id={`palette-option-${index}`}
					role="option"
					aria-selected={index === active}
					onpointermove={() => (active = index)}
					onclick={() => choose(item.href)}
					onkeydown={() => {}}
				>
					<span class="palette-label">{item.label}</span>
					<span class="palette-summary">{item.summary}</span>
					<span class="palette-group">{item.group}</span>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="palette-empty">Nothing matches “{query}”.</p>
	{/if}
</dialog>
