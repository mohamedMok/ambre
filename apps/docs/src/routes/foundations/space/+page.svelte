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

<h1>Space</h1>
<p class="lede">The space scale aliases the dimension reference. Components use space, not the raw scale.</p>

<div class="stack-list">
	{#each space as token}
		<div class="token-row">
			<span>{token.path}</span>
			<span class="bar" style:width={String(token.value)}></span>
			<small>{token.value}</small>
		</div>
	{/each}
</div>

<h2>Radius</h2>
<div class="row">
	{#each radius as token}
		<div
			style:width="var(--amb-size-control-lg)"
			style:height="var(--amb-size-control-lg)"
			style:background="var(--amb-color-accent-bg)"
			style:border-radius={String(token.value)}
			title="{token.path} {token.value}"
		></div>
	{/each}
</div>

<h2>Control heights</h2>
<ul>
	{#each control as token}
		<li>{token.path}: {token.value}. {token.description}</li>
	{/each}
</ul>
