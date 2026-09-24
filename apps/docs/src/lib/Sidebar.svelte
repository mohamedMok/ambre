<script lang="ts">
	import { page } from '$app/stores';
	import { sidebar } from './sections';

	let { onnavigate = () => {} }: { onnavigate?: () => void } = $props();
</script>

<nav class="sidebar" aria-label="Documentation">
	{#each sidebar as section}
		<div class="sidebar-group">
			<p class="sidebar-title">{section.title}</p>
			<ul>
				{#each section.items as item}
					<li>
						<a
							href={item.href}
							aria-current={$page.url.pathname === item.href ? 'page' : undefined}
							onclick={onnavigate}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
