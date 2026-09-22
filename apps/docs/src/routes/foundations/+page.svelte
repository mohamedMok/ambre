<script lang="ts">
	import { foundations } from '$lib/sections';
</script>

<svelte:head>
	<title>Foundations — Ambre</title>
	<meta name="description" content="Color, type, and space. The decisions a product theme overrides." />
</svelte:head>

<p class="eyebrow">Foundations</p>
<h1>Color, type, and space.</h1>
<p class="lede">Semantic tokens. A product overrides the decision, and the reference palette stays in the token files.</p>

<ul class="paths">
	{#each foundations as item}
		<li class="path">
			<a href={item.href}>
				<strong>{item.label}</strong>
				<small>{item.summary}</small>
			</a>
		</li>
	{/each}
</ul>
