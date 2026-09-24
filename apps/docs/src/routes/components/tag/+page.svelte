<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="tag"
	heroCode={`<amb-tag variant="accent">Featured</amb-tag>
<amb-tag>Accessibility</amb-tag>
<amb-tag>Design tokens</amb-tag>
<amb-tag>Svelte</amb-tag>`}
	usage={{
		do: [
			'Use tags to label what an object is about: a topic, a material, a team. Someone should recognize the object faster because of them.',
			'Keep the label to one to three words, in sentence case, such as <strong>Design tokens</strong>.',
			'Use <code>accent</code> for one tag per object at most, such as <strong>Featured</strong>.'
		],
		dont: [
			'Don’t use a tag as a filter or a toggle. Use a checkbox, or a button with <code>aria-pressed</code>.',
			'Don’t wrap a tag in a link. Put the destination on the object title.',
			'Don’t use a tag for a status that changes, such as <strong>Paid</strong>. Use a badge.'
		]
	}}
>
	{#snippet hero()}
		<amb-tag variant="accent">Featured</amb-tag>
		<amb-tag>Accessibility</amb-tag>
		<amb-tag>Design tokens</amb-tag>
		<amb-tag>Svelte</amb-tag>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		<strong>Neutral</strong> is the default for every label. <strong>Accent</strong> marks the one label that
		should stand out, and it should stay rare.
	</p>
	<Stage
		code={`<amb-tag>Linen</amb-tag>
<amb-tag variant="accent">New season</amb-tag>`}
	>
		<amb-tag>Linen</amb-tag>
		<amb-tag variant="accent">New season</amb-tag>
	</Stage>

	<h2 id="on-a-card">On a card</h2>
	<p>
		Tags sit under the title and summary, in a list. The title is the link. The tags only describe the article,
		so they stay out of the tab order.
	</p>
	<Stage
		code={`<article class="post">
  <h3><a href="/foundations/color">Choosing semantic color tokens</a></h3>
  <p>Why the button asks for accent.bg and never for amber.600.</p>
  <ul class="post-tags" aria-label="Topics">
    <li><amb-tag variant="accent">Featured</amb-tag></li>
    <li><amb-tag>Color</amb-tag></li>
    <li><amb-tag>Design tokens</amb-tag></li>
  </ul>
</article>`}
	>
		<article class="post">
			<p class="post-kicker">Guide · 6 min read</p>
			<h3 class="post-title"><a href="/foundations/color">Choosing semantic color tokens</a></h3>
			<p class="post-summary">Why the button asks for accent.bg and never for amber.600.</p>
			<ul class="post-tags" aria-label="Topics">
				<li><amb-tag variant="accent">Featured</amb-tag></li>
				<li><amb-tag>Color</amb-tag></li>
				<li><amb-tag>Design tokens</amb-tag></li>
			</ul>
		</article>
	</Stage>

	<h2 id="product-details">In product details</h2>
	<p>
		In a shop, tags name the attributes a buyer scans for. A price or a stock level is data, so it stays in text.
	</p>
	<Stage
		code={`<div class="product">
  <h3>Stonewashed linen duvet cover</h3>
  <p>€148 · In stock</p>
  <ul class="product-tags" aria-label="Attributes">
    <li><amb-tag>100% linen</amb-tag></li>
    <li><amb-tag>Machine washable</amb-tag></li>
    <li><amb-tag>Made in Portugal</amb-tag></li>
  </ul>
</div>`}
	>
		<div class="product">
			<div class="product-image" aria-hidden="true"></div>
			<div class="product-body">
				<h3 class="post-title">Stonewashed linen duvet cover</h3>
				<p class="post-summary">€148 · In stock</p>
				<ul class="post-tags" aria-label="Attributes">
					<li><amb-tag>100% linen</amb-tag></li>
					<li><amb-tag>Machine washable</amb-tag></li>
					<li><amb-tag>Made in Portugal</amb-tag></li>
				</ul>
			</div>
		</div>
	</Stage>
</ComponentPage>

<style>
	.post {
		width: min(100%, 26rem);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.post-kicker {
		margin: 0 0 var(--amb-space-200);
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-100);
		font-weight: var(--amb-font-weight-semibold);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.post-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.post-title a {
		color: inherit;
	}

	.post-summary {
		margin: var(--amb-space-200) 0 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-300);
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-200);
		margin: var(--amb-space-400) 0 0;
		padding: 0;
		list-style: none;
	}

	.post-tags li {
		margin: 0;
	}

	.product {
		display: grid;
		grid-template-columns: 7rem minmax(0, 1fr);
		gap: var(--amb-space-500);
		align-items: center;
		width: min(100%, 32rem);
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.product-image {
		aspect-ratio: 1;
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-muted);
	}

	@media (max-width: 480px) {
		.product {
			grid-template-columns: 1fr;
		}
	}
</style>
