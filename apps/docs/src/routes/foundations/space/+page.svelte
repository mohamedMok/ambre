<script lang="ts">
	import { byPrefix, tokens } from '$lib/tokens';

	const space = byPrefix(tokens.system, 'space.');
	const radius = byPrefix(tokens.system, 'radius.');
	const control = byPrefix(tokens.system, 'size.control');
</script>

<svelte:head>
	<title>Space — Ambre</title>
	<meta name="description" content="Ambre space scale, radii, and control heights." />
</svelte:head>

<p class="eyebrow">Foundations</p>
<h1>Space</h1>
<div class="stack-list">
	{#each space as token}
		<div class="token-row">
			<span>{token.path}</span>
			<span class="meter" style:width="var({token.css})"></span>
			<small>{token.css}</small>
		</div>
	{/each}
</div>
<p class="lede">Use the space scale. Leave the raw dimension reference in the token files.</p>

<h2>Radius</h2>
<div class="radius-row">
	{#each radius as token}
		<div class="radius-tile">
			<span style:border-radius="var({token.css})"></span>
			{token.path}
			<small>{token.css}</small>
		</div>
	{/each}
</div>

<h2>Control heights</h2>
<div class="control-row">
	{#each control as token}
		<div class="control">
			<span class="shaft" style:height="var({token.css})" aria-hidden="true"></span>
			<span>{token.path}</span>
			<small>{token.css}</small>
		</div>
	{/each}
</div>
