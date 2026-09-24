<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { brands, scope } from './brands';
	import CodeBlock from './CodeBlock.svelte';
	import Glyph from './Glyph.svelte';
	import { preview, setPreviewBrand } from './preview.svelte';

	let {
		children,
		code = '',
		lang = 'html',
		label = 'Example',
		align = 'center',
		padding = 'lg',
		minHeight = 0,
		controls = true
	}: {
		children: Snippet;
		code?: string;
		lang?: string;
		label?: string;
		align?: 'center' | 'start' | 'stretch';
		padding?: 'none' | 'md' | 'lg';
		minHeight?: number;
		controls?: boolean;
	} = $props();

	let siteTheme = $state<string | null>(null);
	let local = $state<'site' | 'light' | 'dark'>('site');
	let showCode = $state(false);
	const theme = $derived(local === 'site' ? siteTheme : local);
	const attrs = $derived(scope(preview.brand, theme));

	onMount(() => {
		const root = document.documentElement;
		const read = () => (siteTheme = root.dataset.theme === 'dark' ? 'dark' : 'light');
		read();
		const observer = new MutationObserver(read);
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
		return () => observer.disconnect();
	});
</script>

<figure class="stage">
	{#if controls}
		<div class="stage-bar">
			<span class="stage-label">{label}</span>
			<div class="stage-tools">
				<label class="stage-select">
					<span class="visually-hidden">Preview brand</span>
					<select value={preview.brand} onchange={(event) => setPreviewBrand(event.currentTarget.value)}>
						{#each brands as brand}
							<option value={brand.id}>{brand.name}</option>
						{/each}
					</select>
				</label>
				<div class="segmented" role="group" aria-label="Example theme">
					<button type="button" aria-pressed={theme === 'light'} onclick={() => (local = 'light')}>
						<Glyph name="sun" size={16} label="Light" />
					</button>
					<button type="button" aria-pressed={theme === 'dark'} onclick={() => (local = 'dark')}>
						<Glyph name="moon" size={16} label="Dark" />
					</button>
				</div>
				{#if code}
					<button
						class="stage-code-toggle"
						type="button"
						aria-expanded={showCode}
						onclick={() => (showCode = !showCode)}
					>
						<Glyph name="code" size={16} />
						<span>Code</span>
					</button>
				{/if}
			</div>
		</div>
	{/if}
	<div
		class="stage-canvas"
		data-align={align}
		data-pad={padding}
		style:min-height={minHeight ? `${minHeight}px` : undefined}
		{...attrs}
	>
		{@render children()}
	</div>
	{#if code && showCode}
		<CodeBlock {code} {lang} />
	{/if}
</figure>
