<script lang="ts">
	import { onMount } from 'svelte';
	import CodeBlock from '$lib/CodeBlock.svelte';
	import Glyph from '$lib/Glyph.svelte';
	import { brands } from '$lib/brands';
	import PreviewComponents from '$lib/builder/PreviewComponents.svelte';
	import PreviewFoundations from '$lib/builder/PreviewFoundations.svelte';
	import TokenField from '$lib/builder/TokenField.svelte';
	import {
		brandId,
		checkPairs,
		decodeShare,
		defs,
		encodeShare,
		fromBrand,
		groups,
		importPreset,
		presetCss,
		presetJson,
		setValue,
		styleFor,
		valueOf,
		type BuilderState,
		type GroupId,
		type Theme,
		type TokenDef
	} from '$lib/builder/model';
	import { randomize, type RandomScope } from '$lib/builder/random';

	const STORAGE = 'amb-builder-v1';

	let state = $state<BuilderState>(fromBrand('ambre'));
	let theme = $state<Theme>('light');
	let view = $state<'both' | 'foundations' | 'components'>('both');
	let query = $state('');
	let past = $state<string[]>([]);
	let future = $state<string[]>([]);
	let lastEdit = { path: '', at: 0 };
	let exportDialog = $state<HTMLDialogElement>();
	let exportTab = $state<'json' | 'css'>('json');
	let contrastOpen = $state(false);
	let notice = $state('');
	let fileInput = $state<HTMLInputElement>();

	const baseline = $derived(fromBrand(state.base));
	const style = $derived(styleFor(state, theme));
	const results = $derived(checkPairs(state));
	const failures = $derived(results.filter((result) => !result.pass));
	const previewValues = $derived({ ...state.shared, ...state[theme] });
	const changedCount = $derived(
		defs.filter((def) =>
			def.themed
				? state.light[def.path] !== baseline.light[def.path] || state.dark[def.path] !== baseline.dark[def.path]
				: state.shared[def.path] !== baseline.shared[def.path]
		).length
	);
	const visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return (group: GroupId) =>
			defs.filter(
				(def) =>
					def.group === group &&
					(!q || def.label.toLowerCase().includes(q) || def.css.includes(q) || def.path.toLowerCase().includes(q))
			);
	});
	const jsonText = $derived(presetJson(state));
	const cssText = $derived(presetCss(state));

	// ---------- History ----------

	const snapshot = () => JSON.stringify($state.snapshot(state));

	function remember(path = '') {
		const now = Date.now();
		// Consecutive edits of one token within a second are one step.
		if (path && path === lastEdit.path && now - lastEdit.at < 1000) {
			lastEdit.at = now;
			return;
		}
		lastEdit = { path, at: now };
		past = [...past.slice(-49), snapshot()];
		future = [];
	}

	function replace(next: BuilderState) {
		state = next;
	}

	function undo() {
		const previous = past.at(-1);
		if (!previous) return;
		future = [snapshot(), ...future];
		past = past.slice(0, -1);
		replace(JSON.parse(previous));
		lastEdit = { path: '', at: 0 };
	}

	function redo() {
		const next = future[0];
		if (!next) return;
		past = [...past, snapshot()];
		future = future.slice(1);
		replace(JSON.parse(next));
	}

	// ---------- Actions ----------

	function edit(def: TokenDef, value: string) {
		remember(`${def.path}:${theme}`);
		setValue(state, def, theme, value);
	}

	function startFrom(id: string) {
		remember();
		const next = fromBrand(id);
		next.name = state.name;
		next.id = state.id;
		next.description = state.description;
		replace(next);
		say(`Started from ${brands.find((b) => b.id === id)?.name ?? id}.`);
	}

	function roll(scope: RandomScope) {
		remember();
		replace(randomize($state.snapshot(state) as BuilderState, scope));
		say(scope === 'all' ? 'New preset rolled. Contrast fixed where needed.' : `New ${scope} values rolled.`);
	}

	function resetGroup(group: GroupId) {
		remember();
		for (const def of defs.filter((d) => d.group === group)) {
			if (def.themed) {
				state.light[def.path] = baseline.light[def.path];
				state.dark[def.path] = baseline.dark[def.path];
			} else {
				state.shared[def.path] = baseline.shared[def.path];
			}
		}
	}

	function say(message: string) {
		notice = message;
		setTimeout(() => {
			if (notice === message) notice = '';
		}, 2400);
	}

	async function copy(text: string, what: string) {
		try {
			await navigator.clipboard.writeText(text);
			say(`${what} copied.`);
		} catch {
			say('Copy failed. Select the text instead.');
		}
	}

	function download() {
		const blob = new Blob([jsonText], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${brandId(state)}.json`;
		a.click();
		URL.revokeObjectURL(url);
		say(`${brandId(state)}.json downloaded.`);
	}

	function shareLink() {
		const url = `${location.origin}/builder#preset=${encodeShare($state.snapshot(state) as BuilderState)}`;
		copy(url, 'Share link');
	}

	async function onImport(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			remember();
			replace(importPreset(await file.text(), $state.snapshot(state) as BuilderState));
			say(`${file.name} imported.`);
		} catch {
			say('That file is not a preset JSON.');
		}
		(event.currentTarget as HTMLInputElement).value = '';
	}

	onMount(() => {
		const hash = new URLSearchParams(location.hash.slice(1)).get('preset');
		const shared = hash ? decodeShare(hash) : null;
		if (shared) {
			replace(shared);
			history.replaceState(null, '', location.pathname);
			say('Preset loaded from the link.');
		} else {
			try {
				const saved = localStorage.getItem(STORAGE);
				if (saved) replace({ ...fromBrand('ambre'), ...JSON.parse(saved) });
			} catch {
				// A broken save starts fresh.
			}
		}
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

		const onKey = (event: KeyboardEvent) => {
			const mod = event.metaKey || event.ctrlKey;
			if (mod && event.key.toLowerCase() === 'z' && !(event.target instanceof HTMLInputElement)) {
				event.preventDefault();
				if (event.shiftKey) redo();
				else undo();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// Save as the user works; the preview stays in this browser.
	$effect(() => {
		const text = JSON.stringify($state.snapshot(state));
		const timer = setTimeout(() => {
			try {
				localStorage.setItem(STORAGE, text);
			} catch {
				// Storage can be blocked.
			}
		}, 300);
		return () => clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>Preset builder — Ambre</title>
	<meta
		name="description"
		content="Build an Ambre brand preset: edit every token or roll one at random, preview the foundations and every component live, check contrast, and export the preset file."
	/>
</svelte:head>

<div class="builder">
	<header class="bh">
		<div class="bh-copy">
			<p class="eyebrow">Brands</p>
			<h1>Preset builder</h1>
			<p class="bh-lede">
				Start from a brand, roll a new one, or edit every token. The preview is the real library. Export the preset
				file and drop it into <code>packages/tokens/src/preset</code>, or copy the CSS.
			</p>
		</div>

		<div class="bh-meta">
			<label class="meta-field">
				<span>Name</span>
				<input class="input" type="text" bind:value={state.name} onfocus={() => remember()} />
			</label>
			<label class="meta-field">
				<span>data-brand</span>
				<input class="input mono" type="text" bind:value={state.id} onfocus={() => remember()} spellcheck="false" />
			</label>
		</div>
	</header>

	<div class="toolbar" role="toolbar" aria-label="Preset actions">
		<label class="tool-select">
			<span>Start from</span>
			<select class="input" value={state.base} onchange={(e) => startFrom(e.currentTarget.value)}>
				{#each brands as brand}
					<option value={brand.id}>{brand.name}</option>
				{/each}
			</select>
		</label>

		<button class="btn btn-primary tool-roll" type="button" onclick={() => roll('all')}>
			<Glyph name="layers" size={18} />
			Surprise me
		</button>

		<div class="tool-group" role="group" aria-label="History">
			<button class="tool-icon" type="button" onclick={undo} disabled={!past.length} title="Undo (⌘Z)">
				<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" /></svg>
				<span class="visually-hidden">Undo</span>
			</button>
			<button class="tool-icon" type="button" onclick={redo} disabled={!future.length} title="Redo (⇧⌘Z)">
				<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m15 14 5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" /></svg>
				<span class="visually-hidden">Redo</span>
			</button>
		</div>

		<span class="tool-status" aria-live="polite">
			{#if notice}{notice}{:else}{changedCount} of {defs.length} tokens changed from {brands.find((b) => b.id === state.base)?.name}{/if}
		</span>

		<div class="tool-end">
			<button class="btn btn-secondary" type="button" onclick={() => fileInput?.click()}>Import</button>
			<input bind:this={fileInput} class="visually-hidden" type="file" accept="application/json,.json" onchange={onImport} tabindex="-1" />
			<button class="btn btn-secondary" type="button" onclick={shareLink}>Copy link</button>
			<button class="btn btn-primary" type="button" onclick={() => exportDialog?.showModal()}>
				<Glyph name="code" size={18} />
				Export
			</button>
		</div>
	</div>

	<div class="workspace">
		<aside class="editor" aria-label="Tokens">
			<div class="editor-top">
				<label class="search">
					<Glyph name="search" size={16} />
					<span class="visually-hidden">Filter tokens</span>
					<input class="search-input" type="search" placeholder="Filter tokens" bind:value={query} />
				</label>
				<div class="segmented theme-switch" role="group" aria-label="Theme you edit and preview">
					<button type="button" aria-pressed={theme === 'light'} onclick={() => (theme = 'light')}>
						<Glyph name="sun" size={16} /> Light
					</button>
					<button type="button" aria-pressed={theme === 'dark'} onclick={() => (theme = 'dark')}>
						<Glyph name="moon" size={16} /> Dark
					</button>
				</div>
			</div>

			{#each groups as group}
				{@const items = visible(group.id)}
				{#if items.length}
					<details class="group" open={group.id === 'color' || !!query}>
						<summary>
							<span class="group-name">{group.label}</span>
							<span class="group-count">{items.length}</span>
						</summary>
						<p class="group-summary">
							{group.summary}
							{#if items.some((d) => d.themed)}<strong>Editing {theme}.</strong>{/if}
						</p>
						<div class="group-actions">
							<button class="chip-button" type="button" onclick={() => roll(group.id)}>Roll {group.label.toLowerCase()}</button>
							<button class="chip-button" type="button" onclick={() => resetGroup(group.id)}>Reset</button>
						</div>
						<div class="group-fields">
							{#each items as def (def.path)}
								<TokenField
									{def}
									value={valueOf(state, def, theme)}
									base={valueOf(baseline, def, theme)}
									onchange={(value) => edit(def, value)}
								/>
							{/each}
						</div>
					</details>
				{/if}
			{/each}
		</aside>

		<section class="preview" id="builder-preview" aria-label="Live preview">
			<div class="preview-bar">
				<div class="segmented" role="group" aria-label="Preview">
					<button type="button" aria-pressed={view === 'both'} onclick={() => (view = 'both')}>All</button>
					<button type="button" aria-pressed={view === 'foundations'} onclick={() => (view = 'foundations')}>Foundations</button>
					<button type="button" aria-pressed={view === 'components'} onclick={() => (view = 'components')}>Components</button>
				</div>
				<button
					class="contrast"
					type="button"
					data-pass={failures.length === 0}
					aria-expanded={contrastOpen}
					onclick={() => (contrastOpen = !contrastOpen)}
				>
					<Glyph name={failures.length ? 'close' : 'check'} size={16} />
					{results.length - failures.length}/{results.length} contrast pairs pass
				</button>
			</div>

			{#if contrastOpen}
				<div class="contrast-panel">
					{#if failures.length}
						<p>These pairs miss WCAG 2.2 AA. Change one side, or roll colour again: rolled palettes always pass.</p>
					{:else}
						<p>Every text pair reaches 4.5:1 and every boundary 3:1, in light and dark.</p>
					{/if}
					<table class="api">
						<thead><tr><th scope="col">Pair</th><th scope="col">Theme</th><th scope="col">Ratio</th></tr></thead>
						<tbody>
							{#each [...failures, ...results.filter((r) => r.pass)] as result}
								<tr data-pass={result.pass}>
									<td><strong>{result.purpose}</strong><br /><code>{result.fg}</code> on <code>{result.bg}</code></td>
									<td>{result.theme}</td>
									<td class="ratio">{result.ratio.toFixed(2)} <span class="muted">/ {result.min}</span></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<div class="scope" data-theme={theme} {style}>
				{#if view !== 'components'}
					<PreviewFoundations values={previewValues} />
				{/if}
				{#if view !== 'foundations'}
					<PreviewComponents />
				{/if}
			</div>
		</section>
	</div>
</div>

<dialog class="export" bind:this={exportDialog} aria-labelledby="export-title">
	<div class="export-head">
		<h2 id="export-title">Export {state.name || 'my brand'}</h2>
		<button class="tool-icon" type="button" onclick={() => exportDialog?.close()}>
			<Glyph name="close" size={18} label="Close" />
		</button>
	</div>
	<div class="segmented export-tabs" role="group" aria-label="Format">
		<button type="button" aria-pressed={exportTab === 'json'} onclick={() => (exportTab = 'json')}>Preset file</button>
		<button type="button" aria-pressed={exportTab === 'css'} onclick={() => (exportTab = 'css')}>CSS</button>
	</div>
	{#if exportTab === 'json'}
		<p class="export-note">
			Save it as <code>packages/tokens/src/preset/{brandId(state)}.json</code> and run <code>pnpm test</code>: the build
			compiles it onto the same variables and checks every contrast pair.
		</p>
		<div class="export-actions">
			<button class="btn btn-primary" type="button" onclick={download}>Download {brandId(state)}.json</button>
			<button class="btn btn-secondary" type="button" onclick={() => copy(jsonText, 'Preset JSON')}>Copy</button>
		</div>
		<div class="export-code"><CodeBlock code={jsonText} lang="js" title="{brandId(state)}.json" /></div>
	{:else}
		<p class="export-note">
			Load it after <code>@ambre-ds/tokens/css</code> and set <code>data-brand="{brandId(state)}"</code> with
			<code>data-theme</code> on an ancestor. No build step.
		</p>
		<div class="export-actions">
			<button class="btn btn-primary" type="button" onclick={() => copy(cssText, 'CSS')}>Copy CSS</button>
		</div>
		<div class="export-code"><CodeBlock code={cssText} lang="css" title="{brandId(state)}.css" /></div>
	{/if}
</dialog>

<style>
	.builder {
		max-width: 1680px;
		margin-inline: auto;
		padding: 32px var(--gutter) 64px;
	}

	.bh {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 20px;
	}

	.bh h1 {
		margin: 0;
		font-size: clamp(32px, 4vw, 44px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.bh-lede {
		max-width: 62ch;
		margin: 12px 0 0;
		color: var(--amb-color-fg-muted);
		font-size: 17px;
	}

	.bh-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.meta-field,
	.tool-select {
		display: grid;
		gap: 4px;
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
		font-weight: 600;
	}

	.input {
		box-sizing: border-box;
		height: 38px;
		min-width: 0;
		padding: 0 12px;
		border: 1px solid var(--rule-strong);
		border-radius: 10px;
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-inset);
		color: var(--amb-color-fg-default);
		font: inherit;
		font-size: 14px;
		font-weight: 500;
	}

	.input.mono {
		font-family: var(--amb-font-family-mono);
		font-size: 13px;
	}

	.toolbar {
		position: sticky;
		top: var(--header-h);
		z-index: 5;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 12px;
		margin-inline: calc(var(--gutter) * -1);
		padding: 12px var(--gutter);
		border-block: 1px solid var(--rule);
		background: color-mix(in oklab, var(--amb-color-bg-canvas) 88%, transparent);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
	}

	.tool-roll {
		height: 38px;
	}

	.toolbar .btn {
		height: 38px;
		padding-inline: 16px;
		font-size: 14px;
	}

	.tool-group {
		display: flex;
		gap: 4px;
	}

	.tool-icon {
		display: inline-grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		background: var(--amb-color-bg-surface);
		color: var(--amb-color-fg-default);
		cursor: pointer;
	}

	.tool-icon svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.75;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.tool-icon:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.tool-status {
		align-self: center;
		color: var(--amb-color-fg-subtle);
		font-size: 13px;
	}

	.tool-end {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-left: auto;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
		gap: 24px;
		margin-top: 20px;
	}

	.editor {
		position: sticky;
		top: calc(var(--header-h) + 76px);
		align-self: start;
		max-height: calc(100dvh - var(--header-h) - 96px);
		overflow-y: auto;
		padding: 4px 4px 24px;
		border: 1px solid var(--rule-strong);
		border-radius: 16px;
		background: var(--amb-color-bg-surface);
		scrollbar-width: thin;
	}

	.editor-top {
		position: sticky;
		top: 0;
		z-index: 1;
		display: grid;
		gap: 8px;
		padding: 10px 8px;
		border-bottom: 1px solid var(--rule);
		background: var(--amb-color-bg-surface);
	}

	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 10px;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		background: var(--amb-color-bg-canvas);
		color: var(--amb-color-fg-subtle);
	}

	.search-input {
		flex: 1;
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--amb-color-fg-default);
		font: inherit;
		font-size: 14px;
		outline: none;
	}

	.theme-switch {
		height: 34px;
	}

	.theme-switch button,
	.preview-bar .segmented button,
	.export-tabs button {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		width: auto;
		padding-inline: 12px;
		font-size: 13px;
		font-weight: 600;
	}

	.theme-switch button {
		flex: 1;
		justify-content: center;
	}

	.group {
		margin: 4px;
		border-radius: 12px;
	}

	.group summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px;
		border-radius: 12px;
		cursor: pointer;
		list-style: none;
	}

	.group summary::-webkit-details-marker {
		display: none;
	}

	.group summary:hover {
		background: var(--amb-color-bg-subtle);
	}

	.group summary::after {
		content: '';
		width: 8px;
		height: 8px;
		margin-left: 8px;
		border-right: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		rotate: 45deg;
		translate: 0 -2px;
		transition: rotate var(--amb-duration-moderate) var(--amb-easing-spring);
	}

	.group[open] summary::after {
		rotate: 225deg;
		translate: 0 2px;
	}

	.group-name {
		flex: 1;
		font-weight: 700;
	}

	.group-count {
		color: var(--amb-color-fg-subtle);
		font-size: 12px;
	}

	.group-summary {
		margin: 0;
		padding: 0 12px 8px;
		color: var(--amb-color-fg-subtle);
		font-size: 13px;
	}

	.group-summary strong {
		color: var(--amb-color-accent-fg);
	}

	.group-actions {
		display: flex;
		gap: 6px;
		padding: 0 12px 8px;
	}

	.chip-button {
		height: 28px;
		padding: 0 12px;
		border: 1px solid var(--rule-strong);
		border-radius: 999px;
		background: var(--amb-color-bg-canvas);
		color: var(--amb-color-fg-default);
		font: inherit;
		font-size: 12px;
		font-weight: 600;
		cursor: pointer;
	}

	.chip-button:hover {
		background: var(--amb-color-bg-subtle);
	}

	.group-fields {
		display: grid;
		gap: 2px;
	}

	.preview {
		min-width: 0;
	}

	.preview-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.preview-bar .segmented {
		height: 36px;
	}

	.contrast {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		padding: 0 14px;
		border: 1px solid color-mix(in oklab, var(--amb-color-status-danger-fg) 45%, transparent);
		border-radius: 999px;
		background: color-mix(in oklab, var(--amb-color-status-danger-fg) 10%, var(--amb-color-bg-surface));
		color: var(--amb-color-status-danger-fg);
		font: inherit;
		font-size: 13px;
		font-weight: 700;
		cursor: pointer;
	}

	.contrast[data-pass='true'] {
		border-color: color-mix(in oklab, var(--amb-color-status-success-fg) 45%, transparent);
		background: color-mix(in oklab, var(--amb-color-status-success-fg) 10%, var(--amb-color-bg-surface));
		color: var(--amb-color-status-success-fg);
	}

	.contrast-panel {
		max-height: 360px;
		overflow: auto;
		margin-bottom: 12px;
		padding: 16px;
		border: 1px solid var(--rule-strong);
		border-radius: 14px;
		background: var(--amb-color-bg-surface);
	}

	.contrast-panel p {
		margin: 0 0 12px;
		color: var(--amb-color-fg-muted);
	}

	.contrast-panel tr[data-pass='false'] .ratio {
		color: var(--amb-color-status-danger-fg);
		font-weight: 700;
	}

	.scope {
		display: grid;
		gap: 24px;
		padding: clamp(16px, 3vw, 32px);
		border: 1px solid var(--rule-strong);
		border-radius: 20px;
		background-color: var(--amb-color-bg-canvas);
		color: var(--amb-color-fg-default);
		font-family: var(--amb-font-family-sans);
		transition: background-color var(--amb-duration-moderate) var(--amb-easing-standard);
	}

	.export {
		width: min(860px, calc(100vw - 32px));
		max-height: calc(100dvh - 64px);
		padding: 24px;
		border: 1px solid var(--rule-strong);
		border-radius: 20px;
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-3);
		color: var(--amb-color-fg-default);
	}

	.export::backdrop {
		background: color-mix(in oklab, var(--amb-color-bg-inverse) 40%, transparent);
		-webkit-backdrop-filter: blur(4px);
		backdrop-filter: blur(4px);
	}

	.export[open] {
		display: grid;
		gap: 14px;
	}

	.export-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.export-head h2 {
		margin: 0;
		font-size: 22px;
	}

	.export-tabs {
		justify-self: start;
		height: 36px;
	}

	.export-note {
		margin: 0;
		color: var(--amb-color-fg-muted);
	}

	.export-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.export-code {
		max-height: 44vh;
		overflow: auto;
	}

	.export-code :global(.code) {
		margin: 0;
	}

	@media (max-width: 1000px) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.editor {
			position: static;
			max-height: none;
		}

		.toolbar {
			position: static;
		}
	}
</style>
