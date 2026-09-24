<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	let headings = $state<{ id: string; text: string }[]>([]);
	let current = $state('');
	let observer: IntersectionObserver | undefined;

	function collect() {
		observer?.disconnect();
		const nodes = [...document.querySelectorAll<HTMLHeadingElement>('#content h2[id]')];
		headings = nodes.map((node) => ({ id: node.id, text: node.textContent?.trim() ?? '' }));
		current = headings[0]?.id ?? '';
		observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length) current = visible[0].target.id;
			},
			{ rootMargin: '-80px 0px -70% 0px' }
		);
		nodes.forEach((node) => observer?.observe(node));
	}

	afterNavigate(() => queueMicrotask(collect));
</script>

{#if headings.length > 1}
	<nav class="toc" aria-label="On this page">
		<p class="toc-title">On this page</p>
		<ul>
			{#each headings as heading}
				<li>
					<a href={`#${heading.id}`} aria-current={current === heading.id ? 'location' : undefined}>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
