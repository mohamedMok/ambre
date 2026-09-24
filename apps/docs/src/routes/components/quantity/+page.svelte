<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	type Line = { name: string; title: string; detail: string; price: number; qty: number; max: number };

	let lines = $state<Line[]>([
		{ name: 'duvet-cover', title: 'Stonewashed linen duvet cover', detail: 'Oat · 220 × 240 cm', price: 148, qty: 1, max: 4 },
		{ name: 'pillowcase', title: 'Linen pillowcase, pair', detail: 'Oat · 50 × 75 cm', price: 42, qty: 2, max: 8 }
	]);
	const subtotal = $derived(lines.reduce((sum, line) => sum + line.price * line.qty, 0));

	let heroQty = $state(1);
	const heroTotal = $derived(148 * heroQty);

	const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

	function valueOf(event: Event) {
		if (!(event instanceof CustomEvent)) return undefined;
		const value = Number((event.detail as { value?: number } | null)?.value);
		return Number.isFinite(value) ? value : undefined;
	}

	function onHeroChange(event: Event) {
		const value = valueOf(event);
		if (value !== undefined) heroQty = value;
	}

	function onCartChange(event: Event) {
		const value = valueOf(event);
		const target = event.target;
		if (value === undefined || !(target instanceof HTMLElement)) return;
		const line = lines.find((item) => item.name === target.getAttribute('name'));
		if (line) line.qty = value;
	}
</script>

<ComponentPage
	id="quantity"
	heroCode={`<div class="cart-line">
  <img src="duvet-cover.jpg" alt="" />
  <div>
    <amb-quantity name="duvet-cover" value="1" min="1" max="4">
      Stonewashed linen duvet cover
    </amb-quantity>
    <p>Oat · 220 × 240 cm · €148.00 each</p>
  </div>
  <p class="line-total">€148.00</p>
</div>`}
	usage={{
		do: [
			'Put the product name in the slot. It labels the number, so each line in a cart reads as <strong>Stonewashed linen duvet cover, 1</strong>.',
			'Set <code>min</code> and <code>max</code> to what the shop accepts, such as the stock on hand. The buttons stop at the bounds.',
			'Show the line total in text next to the control, and update it on <code>change</code>.'
		],
		dont: [
			'Don’t use the control to remove a line. Keep <code>min="1"</code> and add a separate <strong>Remove</strong> button.',
			'Don’t use it for a number that is not a count of items, such as a price or a weight. Use a text field.',
			'Don’t build the cart or the checkout into it. Those stay in the product, outside <code>@ambre/commerce</code>.'
		]
	}}
>
	{#snippet hero()}
		<div class="cart-line hero-line" onchange={onHeroChange}>
			<div class="thumb" aria-hidden="true"></div>
			<div class="line-body">
				<amb-quantity name="duvet-cover" value={1} min={1} max={4}>Stonewashed linen duvet cover</amb-quantity>
				<p class="line-detail">Oat · 220 × 240 cm · {euro.format(148)} each</p>
			</div>
			<p class="line-total">{euro.format(heroTotal)}</p>
		</div>
	{/snippet}

	<h2 id="in-a-cart">In a cart</h2>
	<p>
		Each line holds one control. The <code>name</code> identifies the line, and <code>change</code> carries the
		new count in <code>detail.value</code>, so the product can update the totals. The control joins a form like a
		native input.
	</p>
	<Stage
		align="stretch"
		code={`<form class="cart">
  <h3>Your cart</h3>
  <ul>
    <li class="cart-line">
      <amb-quantity name="duvet-cover" value="1" min="1" max="4">
        Stonewashed linen duvet cover
      </amb-quantity>
      <p>Oat · 220 × 240 cm</p>
      <p class="line-total">€148.00</p>
    </li>
    <li class="cart-line">
      <amb-quantity name="pillowcase" value="2" min="1" max="8">
        Linen pillowcase, pair
      </amb-quantity>
      <p>Oat · 50 × 75 cm</p>
      <p class="line-total">€84.00</p>
    </li>
  </ul>
  <p>Subtotal <strong>€232.00</strong></p>
  <amb-button type="submit">Check out</amb-button>
</form>`}
	>
		<form class="cart" onsubmit={(event) => event.preventDefault()} onchange={onCartChange} aria-labelledby="cart-title">
			<h3 class="cart-title" id="cart-title">Your cart</h3>
			<ul class="cart-lines">
				{#each lines as line (line.name)}
					<li class="cart-line">
						<div class="thumb" aria-hidden="true"></div>
						<div class="line-body">
							<amb-quantity name={line.name} value={line.qty} min={1} max={line.max}>{line.title}</amb-quantity>
							<p class="line-detail">{line.detail} · {euro.format(line.price)} each</p>
						</div>
						<p class="line-total">{euro.format(line.price * line.qty)}</p>
					</li>
				{/each}
			</ul>
			<div class="cart-foot">
				<p class="subtotal" aria-live="polite">Subtotal <strong>{euro.format(subtotal)}</strong></p>
				<amb-button type="submit">Check out</amb-button>
			</div>
		</form>
	</Stage>

	<h2 id="bounds-and-steps">Bounds and steps</h2>
	<p>
		Decrease is disabled at <code>min</code> and Increase at <code>max</code>. Typed numbers snap to the nearest
		<code>step</code> inside the bounds. Use a step for products sold in fixed packs.
	</p>
	<Stage
		code={`<amb-quantity name="last-one" value="1" min="1" max="1">Oak serving board, last one</amb-quantity>
<amb-quantity name="napkins" value="6" min="6" max="48" step="6">Linen napkins, packs of 6</amb-quantity>
<amb-quantity name="wool-throw" value="1" disabled>Wool throw, out of stock</amb-quantity>`}
	>
		<div class="bounds">
			<amb-quantity name="last-one" value={1} min={1} max={1}>Oak serving board, last one</amb-quantity>
			<amb-quantity name="napkins" value={6} min={6} max={48} step={6}>Linen napkins, packs of 6</amb-quantity>
			<amb-quantity name="wool-throw" value={1} disabled>Wool throw, out of stock</amb-quantity>
		</div>
	</Stage>
</ComponentPage>

<style>
	.cart-line {
		display: grid;
		grid-template-columns: 4.5rem minmax(0, 1fr) auto;
		align-items: center;
		gap: var(--amb-space-400);
		margin: 0;
	}

	.hero-line {
		width: min(100%, 34rem);
		padding: var(--amb-space-400);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.thumb {
		aspect-ratio: 1;
		border-radius: var(--amb-radius-md);
		background: var(--amb-color-bg-muted);
	}

	.line-body {
		display: grid;
		gap: var(--amb-space-200);
		min-width: 0;
	}

	.line-detail {
		margin: 0;
		color: var(--amb-color-fg-subtle);
		font-size: var(--amb-font-size-200);
	}

	.line-total {
		margin: 0;
		align-self: start;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
		font-variant-numeric: tabular-nums;
	}

	.cart {
		display: grid;
		gap: var(--amb-space-400);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.cart-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.cart-lines {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cart-lines .cart-line {
		padding: var(--amb-space-400) 0;
	}

	.cart-lines .cart-line + .cart-line {
		border-top: var(--amb-border-width-default) solid var(--amb-color-bg-muted);
	}

	.cart-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--amb-space-300);
		padding-top: var(--amb-space-400);
		border-top: var(--amb-border-width-default) solid var(--amb-color-border-default);
	}

	.subtotal {
		margin: 0;
		color: var(--amb-color-fg-muted);
	}

	.subtotal strong {
		margin-left: var(--amb-space-200);
		color: var(--amb-color-fg-default);
		font-variant-numeric: tabular-nums;
	}

	.bounds {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-600);
	}

	@media (max-width: 520px) {
		.cart-line {
			grid-template-columns: 3.5rem minmax(0, 1fr);
		}

		.line-total {
			grid-column: 2;
		}
	}
</style>
