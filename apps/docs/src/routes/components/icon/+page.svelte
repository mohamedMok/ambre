<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="icon"
	heroCode={`<amb-icon name="search" size="lg" label="Search"></amb-icon>
<amb-icon name="favorite" size="lg" label="Favorite"></amb-icon>
<amb-icon name="settings" size="lg" label="Settings"></amb-icon>
<amb-icon name="local_shipping" size="lg" label="Shipping"></amb-icon>
<amb-icon name="lock" size="lg" label="Private"></amb-icon>`}
	usage={{
		do: [
			'Set <code>name</code> to a Material Symbols Outlined ligature, such as <code>favorite</code>. Load the font in the product.',
			'Leave <code>label</code> empty when text next to the icon already says the same thing.',
			'Set <code>label</code> when the icon is the only carrier of meaning, such as a status marker in a table.',
			'Give a slotted SVG <code>aria-hidden="true"</code> and let <code>label</code> name it.'
		],
		dont: [
			'Don’t make an icon a control. Put the action on <code>&lt;amb-button&gt;</code> or <code>&lt;amb-link&gt;</code> with visible text.',
			'Don’t set <code>label</code> to the same words as the text beside it. Screen readers would say it twice.',
			'Don’t add a <code>&lt;title&gt;</code> to a slotted SVG. The <code>label</code> is the only name.',
			'Don’t mix icon families on one surface. Slot an SVG only when the ligature set has no match.'
		]
	}}
>
	{#snippet hero()}
		<div class="hero">
			<amb-icon name="search" size="lg" label="Search"></amb-icon>
			<amb-icon name="favorite" size="lg" label="Favorite"></amb-icon>
			<amb-icon name="settings" size="lg" label="Settings"></amb-icon>
			<amb-icon name="local_shipping" size="lg" label="Shipping"></amb-icon>
			<amb-icon name="lock" size="lg" label="Private"></amb-icon>
		</div>
	{/snippet}

	<h2 id="sizes">Sizes</h2>
	<p>
		Small is 16px, medium is 20px, and large is 24px. Match the icon to the text it sits beside: small with
		supporting text, medium with body text, large on its own. A brand can change the sizes through
		<code>--amb-size-icon-*</code>.
	</p>
	<Stage
		code={`<amb-icon name="favorite" size="sm" label="Favorite"></amb-icon>
<amb-icon name="favorite" size="md" label="Favorite"></amb-icon>
<amb-icon name="favorite" size="lg" label="Favorite"></amb-icon>`}
	>
		<figure class="size">
			<amb-icon name="favorite" size="sm" label="Favorite"></amb-icon>
			<figcaption>Small, 16px</figcaption>
		</figure>
		<figure class="size">
			<amb-icon name="favorite" size="md" label="Favorite"></amb-icon>
			<figcaption>Medium, 20px</figcaption>
		</figure>
		<figure class="size">
			<amb-icon name="favorite" size="lg" label="Favorite"></amb-icon>
			<figcaption>Large, 24px</figcaption>
		</figure>
	</Stage>

	<h2 id="decorative-or-meaningful">Decorative or meaningful</h2>
	<p>
		An icon with an empty <code>label</code> is decorative and hidden from assistive technology. Use that when text
		says the same thing. Set <code>label</code> when the icon stands alone, and the icon becomes an image with that
		name.
	</p>
	<Stage
		align="stretch"
		code={`<!-- Decorative: the text carries the meaning. -->
<p>
  <amb-icon name="local_shipping"></amb-icon>
  Free delivery on orders over 50 euros
</p>

<!-- Meaningful: the icon is the only signal. -->
<p>
  Quarterly report
  <amb-icon name="lock" size="sm" label="Private"></amb-icon>
</p>`}
	>
		<div class="pair">
			<div class="pair-item">
				<p class="pair-kind">Decorative</p>
				<p class="line">
					<amb-icon name="local_shipping"></amb-icon>
					Free delivery on orders over 50 euros
				</p>
			</div>
			<div class="pair-item">
				<p class="pair-kind">Meaningful</p>
				<p class="line">
					Quarterly report
					<amb-icon name="lock" size="sm" label="Private"></amb-icon>
				</p>
			</div>
		</div>
	</Stage>

	<h2 id="custom-svg">Custom SVG</h2>
	<p>
		Leave <code>name</code> empty and slot an SVG when the ligature set has no match. The element sizes the SVG and
		fills it with <code>currentColor</code>. Hide the SVG itself and name the icon with <code>label</code>.
	</p>
	<Stage
		code={`<amb-icon size="lg" label="Add">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"></path>
  </svg>
</amb-icon>`}
	>
		<amb-icon size="lg" label="Add">
			<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"></path></svg>
		</amb-icon>
	</Stage>

	<h2 id="in-a-list">In a list</h2>
	<p>
		Icons help people scan a list when each row starts with the same kind of fact. The text carries the meaning, so
		every icon here is decorative.
	</p>
	<Stage
		align="stretch"
		code={`<ul>
  <li><amb-icon name="local_shipping"></amb-icon> Ships in one business day</li>
  <li><amb-icon name="undo"></amb-icon> Free returns for 30 days</li>
  <li><amb-icon name="verified"></amb-icon> Two-year warranty</li>
  <li><amb-icon name="support_agent"></amb-icon> Support every day from 8:00 to 20:00</li>
</ul>`}
	>
		<ul class="facts">
			<li><amb-icon name="local_shipping"></amb-icon> Ships in one business day</li>
			<li><amb-icon name="undo"></amb-icon> Free returns for 30 days</li>
			<li><amb-icon name="verified"></amb-icon> Two-year warranty</li>
			<li><amb-icon name="support_agent"></amb-icon> Support every day from 8:00 to 20:00</li>
		</ul>
	</Stage>
</ComponentPage>

<style>
	.hero {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-500);
	}

	.size {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-200);
		margin: 0;
		min-width: 7rem;
	}

	.size figcaption {
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--amb-space-400);
	}

	.pair-item {
		display: grid;
		gap: var(--amb-space-200);
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-surface);
	}

	.pair-kind {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-semibold);
	}

	.line {
		display: flex;
		align-items: center;
		gap: var(--amb-space-200);
		margin: 0;
		color: var(--amb-color-fg-default);
	}

	.facts {
		display: grid;
		gap: var(--amb-space-300);
		width: min(100%, 26rem);
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.facts li {
		display: flex;
		align-items: center;
		gap: var(--amb-space-300);
		margin: 0;
		color: var(--amb-color-fg-default);
	}
</style>
