<script lang="ts">
	import { page } from '$app/stores';
	import type { DocLink } from './sections';

	let { label, items }: { label: string; items: DocLink[] } = $props();
</script>

<nav class="section-nav" aria-label={label}>
	<p class="section-label">{label}</p>
	<ul>
		{#each items as item}
			<li>
				<a href={item.href} aria-current={$page.url.pathname === item.href ? 'page' : undefined}>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>
