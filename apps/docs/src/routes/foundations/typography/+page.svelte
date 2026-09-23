<script lang="ts">
	import { byPrefix, tokens } from '$lib/tokens';

	const sizes = byPrefix(tokens.system, 'font.size');
	const families = byPrefix(tokens.system, 'font.family');
</script>

<svelte:head>
	<title>Typography — Ambre</title>
	<meta name="description" content="Ambre type families, sizes, weights, and line heights." />
</svelte:head>

<p class="eyebrow">Foundations</p>
<h1>Type</h1>
<p class="type-poster" style:font-family="var(--amb-font-family-sans)">Warm by default.</p>
<p class="lede">
	The default face is Source Sans 3. A preset replaces the stack, the sizes, and the weights. Load
	the face the preset names. The tokens do not ship the font files.
</p>

<div class="family-grid">
	{#each families as token}
		<article class="family-card">
			<small>{token.path}</small>
			<p style:font-family="var({token.css})">{token.path}</p>
		</article>
	{/each}
</div>

<div class="scale">
	{#each sizes as token}
		<p style:font-size="var({token.css})" style:line-height="var(--amb-font-line-height-tight)" style:margin="0">
			{token.path}
			<small style:display="block" style:color="var(--amb-color-fg-muted)">{token.css}</small>
		</p>
	{/each}
</div>
