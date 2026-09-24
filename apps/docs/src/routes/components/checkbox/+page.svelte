<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let groupStatus = $state('The form has not been submitted.');
	let validationStatus = $state('Submit without checking the box to see the message.');
	let checkoutStatus = $state('The order has not been placed.');

	function summarize(form: HTMLFormElement) {
		const entries = [...new FormData(form).entries()].map(
			([key, value]) => `${key}=${typeof value === 'string' ? value : value.name}`
		);
		return entries.length ? `Submitted ${entries.join(', ')}.` : 'Submitted with no values. Unchecked boxes stay out of the form data.';
	}

	function onGroupSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) groupStatus = summarize(event.currentTarget);
	}

	function onValidationSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) validationStatus = summarize(event.currentTarget);
	}

	function onCheckoutSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) checkoutStatus = summarize(event.currentTarget);
	}
</script>

<ComponentPage
	id="checkbox"
	heroCode={`<amb-checkbox name="updates" checked>Send product updates</amb-checkbox>
<amb-checkbox name="digest">Send a weekly digest</amb-checkbox>`}
	usage={{
		do: [
			'Use a checkbox for a choice that stands alone, or for a list where any number of choices can be selected.',
			'Write the choice as the label, such as <strong>Send product updates</strong>. The label is part of the target.',
			'Group related boxes in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code> that names the question.',
			'Give boxes in one group the same <code>name</code> and a distinct <code>value</code>, so the form submits each selected value.'
		],
		dont: [
			'Don’t use checkboxes for choices that exclude each other. Use <code>&lt;amb-radio&gt;</code>.',
			'Don’t use a checkbox for a setting that applies at once. Use <code>&lt;amb-toggle&gt;</code>.',
			'Don’t write the label as a negative, such as <strong>Don’t send emails</strong>. Checked should mean yes.',
			'Don’t expect an unchecked box to submit a value. It stays out of the form data.'
		]
	}}
>
	{#snippet hero()}
		<div class="stack">
			<amb-checkbox name="updates" checked>Send product updates</amb-checkbox>
			<amb-checkbox name="digest">Send a weekly digest</amb-checkbox>
		</div>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		A checkbox is unchecked or checked. Disabled leaves the tab order and the form data, in either state. Use a
		disabled checked box only to show a choice that the person cannot change, and say why nearby.
	</p>
	<Stage
		code={`<amb-checkbox name="a">Unchecked</amb-checkbox>
<amb-checkbox name="b" checked>Checked</amb-checkbox>
<amb-checkbox name="c" disabled>Disabled</amb-checkbox>
<amb-checkbox name="d" checked disabled>Disabled and checked</amb-checkbox>`}
	>
		<div class="stack">
			<amb-checkbox name="a">Unchecked</amb-checkbox>
			<amb-checkbox name="b" checked>Checked</amb-checkbox>
			<amb-checkbox name="c" disabled>Disabled</amb-checkbox>
			<amb-checkbox name="d" checked disabled>Disabled and checked</amb-checkbox>
		</div>
	</Stage>

	<h2 id="group">Group</h2>
	<p>
		When several boxes answer one question, put them in a fieldset. The legend names the question for screen
		readers. Each checked box submits its own <code>value</code> under the shared <code>name</code>.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <fieldset>
    <legend>Email me about</legend>
    <amb-checkbox name="topics" value="orders" checked>Order and delivery updates</amb-checkbox>
    <amb-checkbox name="topics" value="offers">Offers and sales</amb-checkbox>
    <amb-checkbox name="topics" value="products">New products</amb-checkbox>
  </fieldset>
  <amb-button type="submit">Save preferences</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onGroupSubmit}>
			<fieldset class="group">
				<legend>Email me about</legend>
				<amb-checkbox name="topics" value="orders" checked>Order and delivery updates</amb-checkbox>
				<amb-checkbox name="topics" value="offers">Offers and sales</amb-checkbox>
				<amb-checkbox name="topics" value="products">New products</amb-checkbox>
			</fieldset>
			<div class="actions">
				<amb-button type="submit">Save preferences</amb-button>
			</div>
			<p class="status" aria-live="polite">{groupStatus}</p>
		</form>
	</Stage>

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> blocks the submit while the box is unchecked. Reserve it for agreements the form cannot go
		without. The message appears under the box after a failed submit.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <amb-checkbox name="terms" value="accepted" required>
    I accept the terms of sale
  </amb-checkbox>
  <amb-button type="submit">Place order</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onValidationSubmit}>
			<amb-checkbox name="terms" value="accepted" required>I accept the terms of sale</amb-checkbox>
			<div class="actions">
				<amb-button type="submit">Place order</amb-button>
			</div>
			<p class="status" aria-live="polite">{validationStatus}</p>
		</form>
	</Stage>

	<h2 id="checkout">In a checkout</h2>
	<p>
		At the end of a checkout, checkboxes collect independent choices: an option that changes the order, an opt-in,
		and the one agreement the order needs. Only the agreement is required.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Review and pay</h3>
  <amb-checkbox name="billing" value="same" checked>
    Billing address is the same as shipping
  </amb-checkbox>
  <amb-checkbox name="gift" value="yes">This order is a gift</amb-checkbox>
  <amb-checkbox name="news" value="yes">Email me about new products</amb-checkbox>
  <amb-checkbox name="terms" value="accepted" required>I accept the terms of sale</amb-checkbox>
  <amb-button type="submit">Pay 84.00 euros</amb-button>
</form>`}
	>
		<form class="panel form" onsubmit={onCheckoutSubmit}>
			<h3 class="panel-title">Review and pay</h3>
			<amb-checkbox name="billing" value="same" checked>Billing address is the same as shipping</amb-checkbox>
			<amb-checkbox name="gift" value="yes">This order is a gift</amb-checkbox>
			<amb-checkbox name="news" value="yes">Email me about new products</amb-checkbox>
			<amb-checkbox name="terms" value="accepted" required>I accept the terms of sale</amb-checkbox>
			<div class="actions">
				<amb-button type="submit">Pay 84.00 euros</amb-button>
			</div>
			<p class="status" aria-live="polite">{checkoutStatus}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.stack {
		display: grid;
		gap: var(--amb-space-200);
	}

	.narrow {
		width: min(100%, 26rem);
		margin-inline: auto;
	}

	.form {
		display: grid;
		gap: var(--amb-space-400);
	}

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
