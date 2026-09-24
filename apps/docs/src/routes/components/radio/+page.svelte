<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let validationStatus = $state('Submit without a choice to see the message.');
	let shippingStatus = $state('The form has not been submitted.');

	function summarize(form: HTMLFormElement) {
		const entries = [...new FormData(form).entries()].map(
			([key, value]) => `${key}=${typeof value === 'string' ? value : value.name}`
		);
		return entries.length ? `Submitted ${entries.join(', ')}.` : 'Submitted with no values.';
	}

	function onValidationSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) validationStatus = summarize(event.currentTarget);
	}

	function onShippingSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) shippingStatus = summarize(event.currentTarget);
	}
</script>

<ComponentPage
	id="radio"
	heroCode={`<fieldset>
  <legend>Delivery</legend>
  <amb-radio name="delivery" value="standard" checked>Standard</amb-radio>
  <amb-radio name="delivery" value="express">Express</amb-radio>
  <amb-radio name="delivery" value="pickup">Pick up in store</amb-radio>
</fieldset>`}
	usage={{
		do: [
			'Use radios when exactly one choice applies and the list is short, from two to about six options.',
			'Group the radios in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code> that asks the question.',
			'Give every radio in the group the same <code>name</code> and its own <code>value</code>.',
			'Check a sensible default when one exists, such as the free delivery option. Leave the group empty when the choice needs thought.'
		],
		dont: [
			'Don’t use radios when more than one choice can apply. Use <code>&lt;amb-checkbox&gt;</code>.',
			'Don’t use a single radio on its own. It cannot be unchecked. Use a checkbox.',
			'Don’t mark only some radios in a group <code>required</code>. Set it on every radio in the group.',
			'Don’t list more than about six options. Use <code>&lt;amb-select&gt;</code>.'
		]
	}}
>
	{#snippet hero()}
		<fieldset class="group">
			<legend>Delivery</legend>
			<amb-radio name="delivery" value="standard" checked>Standard</amb-radio>
			<amb-radio name="delivery" value="express">Express</amb-radio>
			<amb-radio name="delivery" value="pickup">Pick up in store</amb-radio>
		</fieldset>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		One radio in a group is checked at most. The group is one tab stop, and the arrow keys move the selection. A
		disabled radio leaves the tab order and the arrow keys skip it. Keep a
		disabled option in the list only when people need to know it exists, such as a size that is out of stock.
	</p>
	<Stage
		code={`<fieldset>
  <legend>Size</legend>
  <amb-radio name="size" value="s">Small</amb-radio>
  <amb-radio name="size" value="m" checked>Medium</amb-radio>
  <amb-radio name="size" value="l">Large</amb-radio>
  <amb-radio name="size" value="xl" disabled>Extra large, out of stock</amb-radio>
</fieldset>`}
	>
		<fieldset class="group">
			<legend>Size</legend>
			<amb-radio name="size" value="s">Small</amb-radio>
			<amb-radio name="size" value="m" checked>Medium</amb-radio>
			<amb-radio name="size" value="l">Large</amb-radio>
			<amb-radio name="size" value="xl" disabled>Extra large, out of stock</amb-radio>
		</fieldset>
	</Stage>

	<h2 id="validation">Validation</h2>
	<p>
		Set <code>required</code> on every radio in the group. The form cannot submit until one is checked, and the
		message appears after a failed submit. Leave the group empty here, because the choice needs thought.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <fieldset>
    <legend>Billing cycle</legend>
    <amb-radio name="plan" value="monthly" required>Monthly, 12 euros a month</amb-radio>
    <amb-radio name="plan" value="annual" required>Annual, 120 euros a year</amb-radio>
  </fieldset>
  <amb-button type="submit">Continue</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onValidationSubmit}>
			<fieldset class="group">
				<legend>Billing cycle</legend>
				<amb-radio name="plan" value="monthly" required>Monthly, 12 euros a month</amb-radio>
				<amb-radio name="plan" value="annual" required>Annual, 120 euros a year</amb-radio>
			</fieldset>
			<div class="actions">
				<amb-button type="submit">Continue</amb-button>
			</div>
			<p class="status" aria-live="polite">{validationStatus}</p>
		</form>
	</Stage>

	<h2 id="shipping-form">Shipping step</h2>
	<p>
		In a checkout step, the radio labels carry the facts people compare: speed and price. The free option is checked
		by default, and the address fields sit in the same form.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Shipping</h3>
  <amb-text-field name="address" autocomplete="street-address" required>Street address</amb-text-field>
  <amb-text-field name="postcode" autocomplete="postal-code" required>Postcode</amb-text-field>
  <fieldset>
    <legend>Shipping method</legend>
    <amb-radio name="shipping" value="standard" checked>Standard, 3 to 5 days, free</amb-radio>
    <amb-radio name="shipping" value="express">Express, next day, 9 euros</amb-radio>
    <amb-radio name="shipping" value="pickup">Pick up in store, today, free</amb-radio>
  </fieldset>
  <amb-button type="submit">Continue to payment</amb-button>
</form>`}
	>
		<form class="panel form" onsubmit={onShippingSubmit}>
			<h3 class="panel-title">Shipping</h3>
			<amb-text-field name="address" autocomplete="street-address" required>Street address</amb-text-field>
			<amb-text-field name="postcode" autocomplete="postal-code" required>Postcode</amb-text-field>
			<fieldset class="group">
				<legend>Shipping method</legend>
				<amb-radio name="shipping" value="standard" checked>Standard, 3 to 5 days, free</amb-radio>
				<amb-radio name="shipping" value="express">Express, next day, 9 euros</amb-radio>
				<amb-radio name="shipping" value="pickup">Pick up in store, today, free</amb-radio>
			</fieldset>
			<div class="actions">
				<amb-button type="submit">Continue to payment</amb-button>
			</div>
			<p class="status" aria-live="polite">{shippingStatus}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.group {
		display: grid;
		gap: var(--amb-space-100);
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.group legend {
		margin-bottom: var(--amb-space-200);
		padding: 0;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.narrow {
		width: min(100%, 26rem);
		margin-inline: auto;
	}

	.form {
		display: grid;
		gap: var(--amb-space-400);
	}

	.panel {
		width: min(100%, 28rem);
		margin-inline: auto;
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
		box-shadow: var(--amb-elevation-1);
	}

	.panel-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-300);
		font-weight: var(--amb-font-weight-semibold);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--amb-space-300);
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
