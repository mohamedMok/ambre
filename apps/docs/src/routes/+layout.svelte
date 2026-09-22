<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import '@ambre/tokens/css';
	import '@fontsource/source-sans-3/400.css';
	import '@fontsource/source-sans-3/600.css';
	import '@fontsource/source-code-pro/400.css';
	import '../app.css';

	let { children } = $props();
	let theme = $state('light');

	const links = [
		{ href: '/foundations/color', label: 'Color' },
		{ href: '/foundations/typography', label: 'Typography' },
		{ href: '/foundations/space', label: 'Space' },
		{ href: '/components/button', label: 'Button' },
	];

	onMount(async () => {
		theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
		await import('@ambre/ui');
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('amb-theme', theme);
	}
</script>

<a class="skip" href="#content">Skip to content</a>
<header class="site-header">
	<div class="shell">
		<a class="wordmark" href="/">Ambre</a>
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
		<button class="theme-toggle" type="button" onclick={toggleTheme}>
			{theme === 'dark' ? 'Light theme' : 'Dark theme'}
		</button>
	</div>
</header>
<main id="content" class="shell">
	{@render children()}
</main>
<footer class="site-footer">
	<div class="shell">Ambre is open source under the MIT license.</div>
</footer>
