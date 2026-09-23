<script lang="ts">
	import { byPrefix, tokens } from '$lib/tokens';

	const durations = byPrefix(tokens.system, 'duration.');
	const easings = byPrefix(tokens.system, 'easing.');
	let played = $state(true);

	function replay() {
		played = false;
		requestAnimationFrame(() => {
			played = true;
		});
	}
</script>

<svelte:head>
	<title>Motion — Ambre</title>
	<meta name="description" content="Ambre durations and easing. A preset replaces the timing." />
</svelte:head>

<p class="eyebrow">Foundations</p>
<h1>Motion</h1>
<p class="lede">
	Arrival decelerates. Exit accelerates. A spinner uses a longer cycle. A preset replaces the
	numbers. Reduced motion removes the animation and leaves the content in place.
</p>

<div class="row">
	<button class="action" type="button" onclick={replay}>Replay</button>
	<amb-spinner label="Loading the library"></amb-spinner>
</div>

<h2>Duration</h2>
<ul class="motion-list">
	{#each durations as token}
		<li>
			<span>{token.path}</span>
			<i class:played style:transition-duration="var({token.css})"></i>
		</li>
	{/each}
</ul>

<h2>Easing</h2>
<ul class="motion-list">
	{#each easings as token}
		<li>
			<span>{token.path}</span>
			<b class:played style:transition-timing-function="var({token.css})"></b>
		</li>
	{/each}
</ul>

<style>
	.motion-list {
		display: grid;
		gap: var(--amb-space-400);
		margin: var(--amb-space-500) 0 0;
		padding: 0;
		list-style: none;
	}

	.motion-list li {
		display: grid;
		grid-template-columns: 12rem 1fr;
		gap: var(--amb-space-400);
		align-items: center;
	}

	.motion-list span {
		font-family: var(--amb-font-family-mono);
		font-size: var(--amb-font-size-200);
	}

	.motion-list i,
	.motion-list b {
		display: block;
		height: var(--amb-size-icon-sm);
		width: var(--amb-size-icon-lg);
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-accent-bg);
		transition-duration: var(--amb-duration-moderate);
		transition-timing-function: var(--amb-easing-enter);
	}

	.motion-list i {
		transition-property: width;
	}

	.motion-list i.played {
		width: 100%;
	}

	.motion-list b {
		transition-property: translate;
	}

	.motion-list b.played {
		translate: var(--amb-space-900) 0;
	}

	@media (max-width: 40rem) {
		.motion-list li {
			grid-template-columns: 1fr;
		}
	}
</style>
