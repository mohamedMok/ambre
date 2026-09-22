<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { presetList } from '@ambre/tokens';
	import '@ambre/tokens/css';
	import '@ambre/tokens/css/presets';
	import '@fontsource/source-sans-3/400.css';
	import '@fontsource/source-sans-3/500.css';
	import '@fontsource/source-sans-3/600.css';
	import '@fontsource/source-code-pro/400.css';
	import '@fontsource/nunito-sans/400.css';
	import '@fontsource/nunito-sans/500.css';
	import '@fontsource/nunito-sans/600.css';
	import { storybookUrl } from '$lib/site';
	import '../app.css';

	let { children } = $props();
	let theme = $state('light');
	let brand = $state('ambre');

	const links = [
		{ href: '/get-started', label: 'Install' },
		{ href: '/foundations/color', label: 'Color' },
		{ href: '/foundations/typography', label: 'Type' },
		{ href: '/foundations/space', label: 'Space' },
		{ href: '/components/button', label: 'Button' },
		{ href: '/components/link', label: 'Link' },
		{ href: '/components/disclosure', label: 'Disclosure' },
		{ href: '/components/icon', label: 'Icon' },
		{ href: '/components/text-field', label: 'Text field' },
		{ href: '/components/checkbox', label: 'Checkbox' },
		{ href: '/components/radio', label: 'Radio' },
		{ href: '/components/select', label: 'Select' }
	];

	onMount(async () => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		brand = document.documentElement.dataset.brand || 'ambre';
		await import('@ambre/ui');
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('amb-theme', theme);
	}

	function applyBrand(event: Event) {
		const next = (event.currentTarget as HTMLSelectElement).value;
		brand = next;
		if (next === 'ambre') delete document.documentElement.dataset.brand;
		else document.documentElement.dataset.brand = next;
		localStorage.setItem('amb-brand', next);
	}
</script>

<a class="skip" href="#content">Skip to content</a>
<header class="site-header">
	<div class="shell bar">
		<a class="wordmark" href="/">
			<span class="mark" aria-hidden="true"></span>
			Ambre
		</a>
		<nav aria-label="Documentation">
			<ul class="nav-list">
				{#each links as link}
					<li>
						<a href={link.href} aria-current={$page.url.pathname === link.href ? 'page' : undefined}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="header-tools">
			<a class="workshop" href={storybookUrl} target="_blank" rel="noreferrer">Storybook</a>
			<select class="brand-select" aria-label="Brand" value={brand} onchange={applyBrand}>
				<option value="ambre">Ambre</option>
				{#each presetList as preset}
					<option value={preset.id}>{preset.name}</option>
				{/each}
			</select>
			<button class="theme-toggle" type="button" onclick={toggleTheme}>
				{theme === 'dark' ? 'Light theme' : 'Dark theme'}
			</button>
		</div>
	</div>
</header>
<main id="content">
	<div class="shell">
		{@render children()}
	</div>
</main>
<footer class="site-footer">
	<div class="shell footer-row">
		<p>Ambre is open source under the MIT license.</p>
		<a href={storybookUrl} target="_blank" rel="noreferrer">Storybook</a>
	</div>
</footer>
