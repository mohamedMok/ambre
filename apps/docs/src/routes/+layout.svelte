<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '@ambre-ds/tokens/css';
	import '@ambre-ds/tokens/css/presets';
	import '@fontsource/source-sans-3/400.css';
	import '@fontsource/source-sans-3/500.css';
	import '@fontsource/source-sans-3/600.css';
	import '@fontsource/source-sans-3/700.css';
	import '@fontsource/source-code-pro/400.css';
	import '@fontsource/source-code-pro/500.css';
	import '@fontsource/nunito-sans/400.css';
	import '@fontsource/nunito-sans/600.css';
	import '@fontsource/nunito-sans/700.css';
	import '@fontsource/source-serif-4/400.css';
	import '@fontsource/source-serif-4/600.css';
	import '@fontsource/source-serif-4/700.css';
	import '@fontsource/material-symbols-outlined/latin-400.css';
	import CommandPalette from '$lib/CommandPalette.svelte';
	import Glyph from '$lib/Glyph.svelte';
	import OnThisPage from '$lib/OnThisPage.svelte';
	import Sidebar from '$lib/Sidebar.svelte';
	import { hydratePreview } from '$lib/preview.svelte';
	import { header, inSection, searchable } from '$lib/sections';
	import { repoUrl, siteUrl, storybookUrl } from '$lib/site';
	import '../app.css';

	let { children } = $props();
	let theme = $state('light');
	let navOpen = $state(false);
	let palette = $state<CommandPalette>();
	const isHome = $derived($page.url.pathname === '/');
	// Full-width tools: no docs sidebar or outline.
	const isBare = $derived(isHome || $page.url.pathname.startsWith('/builder'));

	// Social cards: the page's own name and summary, and the builder has its own image.
	const entry = $derived(searchable.find((item) => item.href === $page.url.pathname));
	const social = $derived({
		title: isHome || !entry ? 'Ambre — One library. Any brand.' : `${entry.label} — Ambre`,
		description:
			isHome || !entry
				? 'Accessible web components that follow any brand preset, in any framework. Tokens, five brands, a preset builder, and an AI pack.'
				: entry.summary,
		image: `${siteUrl}/social/${$page.url.pathname.startsWith('/builder') ? 'builder' : 'ambre'}.png`,
		alt: $page.url.pathname.startsWith('/builder')
			? 'The Ambre preset builder: token swatches and a live preview in the brand being built.'
			: 'Ambre: the same checkout form in three brand presets, Noir, Atlas, and Ambre.',
		url: `${siteUrl}${$page.url.pathname}`
	});

	onMount(async () => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		hydratePreview();
		await import('@ambre-ds/ui');
		await import('@ambre-ds/commerce');
		await import('@ambre-ds/ai');
	});

	afterNavigate(() => (navOpen = false));

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && navOpen) {
			navOpen = false;
			document.querySelector<HTMLElement>('.nav-toggle')?.focus();
		}
	}

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		const apply = () => {
			document.documentElement.dataset.theme = theme;
		};
		// Cross-fade the whole page where the browser supports view transitions.
		const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
		if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) doc.startViewTransition(apply);
		else apply();
		try {
			localStorage.setItem('amb-theme', theme);
		} catch {
			// Storage can be blocked.
		}
	}
</script>

<svelte:window onkeydown={onKeydown} />

<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="canonical" href={social.url} />
	<meta property="og:site_name" content="Ambre" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={social.title} />
	<meta property="og:description" content={social.description} />
	<meta property="og:url" content={social.url} />
	<meta property="og:image" content={social.image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={social.alt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={social.title} />
	<meta name="twitter:description" content={social.description} />
	<meta name="twitter:image" content={social.image} />
</svelte:head>

<a class="skip" href="#content">Skip to content</a>

<header class="site-header">
	<div class="header-row">
		<button
			class="icon-button nav-toggle"
			type="button"
			aria-expanded={navOpen}
			aria-controls="site-sidebar"
			onclick={() => (navOpen = !navOpen)}
		>
			<Glyph name={navOpen ? 'close' : 'menu'} label={navOpen ? 'Close menu' : 'Open menu'} />
		</button>
		<a class="wordmark" href="/" aria-label="Ambre home">
			<span class="mark" aria-hidden="true"></span>
			<span>Ambre</span>
		</a>
		<nav class="top-nav" aria-label="Primary">
			<ul>
				{#each header as link}
					<li>
						<a
							href={link.href}
							aria-current={$page.url.pathname === link.href
								? 'page'
								: inSection($page.url.pathname, link.href)
									? 'true'
									: undefined}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="header-tools">
			<button class="search-trigger" type="button" onclick={() => palette?.open()}>
				<Glyph name="search" size={18} />
				<span class="search-text">Search</span>
				<kbd>⌘K</kbd>
			</button>
			<a class="icon-button" href={storybookUrl} target="_blank" rel="external noreferrer" title="Storybook">
				<Glyph name="storybook" label="Storybook" />
			</a>
			<a class="icon-button" href={repoUrl} target="_blank" rel="external noreferrer" title="GitHub">
				<Glyph name="github" label="Source on GitHub" />
			</a>
			<button class="icon-button" type="button" onclick={toggleTheme}>
				<Glyph name={theme === 'dark' ? 'sun' : 'moon'} label={theme === 'dark' ? 'Use light theme' : 'Use dark theme'} />
			</button>
		</div>
	</div>
</header>

{#snippet drawer()}
	<aside id="site-sidebar" class="docs-sidebar">
		<!-- On small screens the header links fold into the drawer. -->
		<nav class="drawer-primary" aria-label="Sections">
			<ul>
				{#each header as link}
					<li>
						<a
							href={link.href}
							aria-current={inSection($page.url.pathname, link.href) ? 'page' : undefined}
							onclick={() => (navOpen = false)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<Sidebar onnavigate={() => (navOpen = false)} />
	</aside>
	{#if navOpen}
		<button class="nav-scrim" type="button" tabindex="-1" aria-hidden="true" onclick={() => (navOpen = false)}></button>
	{/if}
{/snippet}

{#if isBare}
	<!-- Full-width pages keep the drawer for small screens only. -->
	<div class="drawer-only" data-nav-open={navOpen}>
		{@render drawer()}
	</div>
	<main id="content" class="home">
		{@render children()}
	</main>
{:else}
	<div class="docs" data-nav-open={navOpen}>
		{@render drawer()}
		<main id="content" class="docs-main">
			<article class="doc">
				{@render children()}
			</article>
			<footer class="doc-footer">
				<p>Ambre is open source under the MIT license.</p>
				<a href={`${repoUrl}/tree/main/apps/docs/src/routes${$page.url.pathname}`} target="_blank" rel="external noreferrer">
					Edit this page
				</a>
			</footer>
		</main>
		<aside class="docs-toc">
			<OnThisPage />
		</aside>
	</div>
{/if}

{#if isHome}
	<footer class="site-footer">
		<div class="footer-inner">
			<div class="footer-brand">
				<span class="wordmark"><span class="mark" aria-hidden="true"></span><span>Ambre</span></span>
				<p>An open-source design system. MIT license.</p>
			</div>
			<nav aria-label="Footer">
				<ul>
					<li><a href="/get-started">Get started</a></li>
					<li><a href="/foundations">Foundations</a></li>
					<li><a href="/components">Components</a></li>
					<li><a href="/brands">Brands</a></li>
					<li><a href={storybookUrl} target="_blank" rel="external noreferrer">Storybook</a></li>
					<li><a href={repoUrl} target="_blank" rel="external noreferrer">GitHub</a></li>
				</ul>
			</nav>
		</div>
	</footer>
{/if}

<CommandPalette bind:this={palette} />
