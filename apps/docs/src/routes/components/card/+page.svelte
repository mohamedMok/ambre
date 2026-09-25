<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const products = [
		{ title: 'Washed linen sheet', text: 'Six colors, woven in Portugal.', tone: 70 },
		{ title: 'Stoneware bowls', text: 'A set of four, glazed by hand.', tone: 50 },
		{ title: 'Wool throw', text: 'Warm, light, and made to last.', tone: 30 }
	];
</script>

<ComponentPage
	id="card"
	heroAlign="stretch"
	heroCode={`<ul class="cards">
  <li>
    <amb-card href="/shop/linen">
      <img slot="media" src="linen.jpg" alt="" />
      <h3 slot="heading">Washed linen sheet</h3>
      <p>Six colors, woven in Portugal.</p>
      <amb-badge slot="footer" variant="accent">New</amb-badge>
    </amb-card>
  </li>
</ul>`}
	usage={{
		do: [
			'Use a card to group one subject that people scan among others: a product, a project, an article.',
			'Put a heading in the <code>heading</code> slot. With <code>href</code>, it is the link text, so write it as the destination.',
			'Put several cards in a list, in a grid of equal columns. Each card stretches to its row.',
			'Put actions in the <code>footer</code> slot. They stay clickable on a link card.'
		],
		dont: [
			'Don’t nest cards. Use a divider or a heading inside one card.',
			'Don’t put a link or a button in the body of a link card. Two targets in one place confuse people.',
			'Don’t use a card as a page section. A section is a heading and its content.'
		]
	}}
>
	{#snippet hero()}
		<ul class="cards">
			{#each products as product}
				<li>
					<amb-card href="#variants">
						<div slot="media" class="media" style:--mix={`${product.tone}%`}></div>
						<h3 slot="heading">{product.title}</h3>
						<p>{product.text}</p>
						<amb-badge slot="footer" variant="accent">New</amb-badge>
					</amb-card>
				</li>
			{/each}
		</ul>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		<strong>Raised</strong> is the default, a surface that floats on the canvas. <strong>Outlined</strong> draws a
		boundary without depth, for dense grids. <strong>Filled</strong> sits flat on a tint, for a quiet group inside
		another surface.
	</p>
	<Stage
		align="stretch"
		code={`<amb-card>…</amb-card>
<amb-card variant="outlined">…</amb-card>
<amb-card variant="filled">…</amb-card>`}
	>
		<ul class="cards">
			<li>
				<amb-card>
					<h3 slot="heading">Raised</h3>
					<p>The default surface.</p>
					<amb-button slot="footer" size="sm" variant="secondary">Open</amb-button>
				</amb-card>
			</li>
			<li>
				<amb-card variant="outlined">
					<h3 slot="heading">Outlined</h3>
					<p>A boundary, no depth.</p>
					<amb-button slot="footer" size="sm" variant="secondary">Open</amb-button>
				</amb-card>
			</li>
			<li>
				<amb-card variant="filled">
					<h3 slot="heading">Filled</h3>
					<p>Flat on a tint.</p>
					<amb-button slot="footer" size="sm" variant="secondary">Open</amb-button>
				</amb-card>
			</li>
		</ul>
	</Stage>
</ComponentPage>

<style>
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		align-content: start;
		gap: var(--amb-space-400);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.media {
		aspect-ratio: 16 / 9;
		background: linear-gradient(
			135deg,
			color-mix(in oklab, var(--amb-color-accent-bg) var(--mix), var(--amb-color-bg-surface)),
			var(--amb-color-accent-bg-active)
		);
	}
</style>
