<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let loaded = $state(false);
	let toggleButton = $state<HTMLElement>();

	$effect(() => {
		const el = toggleButton;
		if (!el) return;
		const toggle = () => (loaded = !loaded);
		el.addEventListener('click', toggle);
		return () => el.removeEventListener('click', toggle);
	});
</script>

<ComponentPage
	id="skeleton"
	heroCode={`<div class="card" role="group" aria-busy="true" aria-label="Loading product">
  <amb-skeleton><div style="height: 10rem"></div></amb-skeleton>
  <amb-skeleton></amb-skeleton>
  <amb-skeleton style="width: 60%"></amb-skeleton>
</div>`}
	usage={{
		do: [
			'Match the shape of the content that is coming: an image block, a title bar, then shorter lines of text.',
			'Mark the container <code>aria-busy="true"</code> and give it a name, such as <strong>Loading product</strong>. The skeleton itself is hidden from assistive technology.',
			'Swap the skeleton for the real content in the same place, at the same size, so nothing shifts.'
		],
		dont: [
			'Don’t put real text inside a skeleton. It is hidden and will never be read.',
			'Don’t use a skeleton for a wait with a known length, such as an upload. Use progress.',
			'Don’t keep a skeleton on screen when the load fails. Replace it with a message and a way to retry.'
		]
	}}
>
	{#snippet hero()}
		<div class="card" aria-busy="true" aria-label="Loading product" role="group">
			<amb-skeleton><div class="shape-image"></div></amb-skeleton>
			<div class="lines">
				<amb-skeleton></amb-skeleton>
				<div class="w-60"><amb-skeleton></amb-skeleton></div>
			</div>
		</div>
	{/snippet}

	<h2 id="in-place-of-a-card">In place of a card</h2>
	<p>
		The skeleton holds the exact footprint of the card while its data loads. When the data arrives, the card
		replaces it and the container is no longer busy. Switch between the two states below.
	</p>
	<Stage
		code={`<!-- While loading -->
<article class="card" aria-busy="true" aria-label="Loading product">
  <amb-skeleton><div style="height: 10rem"></div></amb-skeleton>
  <amb-skeleton></amb-skeleton>
  <amb-skeleton style="width: 60%"></amb-skeleton>
</article>

<!-- Loaded -->
<article class="card">
  <img src="duvet.jpg" alt="" />
  <h3>Stonewashed linen duvet cover</h3>
  <p>€148 · In stock</p>
</article>`}
	>
		<div class="demo">
			{#if loaded}
				<article class="card">
					<div class="image" aria-hidden="true"></div>
					<div class="lines">
						<h3 class="card-title">Stonewashed linen duvet cover</h3>
						<p class="card-meta">€148 · In stock</p>
					</div>
				</article>
			{:else}
				<article class="card" aria-busy="true" aria-label="Loading product">
					<amb-skeleton><div class="shape-image"></div></amb-skeleton>
					<div class="lines">
						<amb-skeleton></amb-skeleton>
						<div class="w-60"><amb-skeleton></amb-skeleton></div>
					</div>
				</article>
			{/if}
			<amb-button variant="secondary" size="sm" bind:this={toggleButton}>
				{loaded ? 'Show loading state' : 'Show loaded card'}
			</amb-button>
		</div>
	</Stage>

	<h2 id="shapes">Shapes</h2>
	<p>
		Empty, the skeleton is one bar at the compact control height. Slot an empty element with a height to make a
		block. Set the width on the element, and round it with <code>::part(block)</code> for an avatar.
	</p>
	<Stage
		code={`<amb-skeleton></amb-skeleton>
<amb-skeleton><div style="height: 6rem"></div></amb-skeleton>
<amb-skeleton class="avatar"></amb-skeleton>

<style>
  .avatar { width: 3rem; }
  .avatar::part(block) { height: 3rem; border-radius: var(--amb-radius-full); }
</style>`}
	>
		<div class="shapes">
			<figure class="shape">
				<div class="shape-slot"><amb-skeleton></amb-skeleton></div>
				<figcaption>Bar</figcaption>
			</figure>
			<figure class="shape">
				<div class="shape-slot"><amb-skeleton><div class="shape-block"></div></amb-skeleton></div>
				<figcaption>Block</figcaption>
			</figure>
			<figure class="shape">
				<div class="shape-slot avatar"><amb-skeleton></amb-skeleton></div>
				<figcaption>Avatar</figcaption>
			</figure>
		</div>
	</Stage>

	<h2 id="list-rows">List rows</h2>
	<p>
		For a list, repeat one row shape for the number of items you expect, up to a screenful. Three to five rows
		is usually enough.
	</p>
	<Stage
		align="stretch"
		code={`<ul aria-busy="true" aria-label="Loading messages">
  <li>
    <amb-skeleton class="avatar"></amb-skeleton>
    <amb-skeleton style="width: 40%"></amb-skeleton>
    <amb-skeleton></amb-skeleton>
  </li>
  <!-- repeat for each expected row -->
</ul>`}
	>
		<ul class="rows" aria-busy="true" aria-label="Loading messages">
			{#each [0, 1, 2] as row (row)}
				<li class="row">
					<div class="avatar"><amb-skeleton></amb-skeleton></div>
					<div class="lines">
						<div class="w-40"><amb-skeleton></amb-skeleton></div>
						<amb-skeleton></amb-skeleton>
					</div>
				</li>
			{/each}
		</ul>
	</Stage>
</ComponentPage>

<style>
	.demo {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-400);
		width: 100%;
	}

	.card {
		display: grid;
		gap: var(--amb-space-400);
		width: min(100%, 18rem);
		margin: 0;
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.shape-image,
	.image {
		height: 10rem;
	}

	.image {
		border-radius: var(--amb-radius-sm);
		background: var(--amb-color-bg-muted);
	}

	.lines {
		display: grid;
		gap: var(--amb-space-200);
		min-width: 0;
	}

	.w-60 {
		width: 60%;
	}

	.w-40 {
		width: 40%;
	}

	.card-title {
		display: flex;
		align-items: center;
		min-height: var(--amb-size-control-sm);
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-400);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.card-meta {
		display: flex;
		align-items: center;
		min-height: var(--amb-size-control-sm);
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.shapes {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: center;
		gap: var(--amb-space-600);
	}

	.shape {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-200);
		margin: 0;
	}

	.shape figcaption {
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.shape-slot {
		width: 10rem;
	}

	.shape-block {
		height: 6rem;
	}

	.avatar {
		flex: none;
		width: 3rem;
	}

	.avatar amb-skeleton::part(block) {
		height: 3rem;
		border-radius: var(--amb-radius-full);
	}

	.rows {
		display: grid;
		gap: var(--amb-space-400);
		margin: 0;
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		list-style: none;
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--amb-space-400);
		margin: 0;
	}

	.row .lines {
		flex: 1;
	}
</style>
