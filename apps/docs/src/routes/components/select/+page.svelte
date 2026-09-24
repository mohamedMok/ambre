<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let validationStatus = $state('Submit without a choice to see the message.');
	let addressStatus = $state('The form has not been submitted.');

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

	function onAddressSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) addressStatus = summarize(event.currentTarget);
	}
</script>

<ComponentPage
	id="select"
	heroAlign="stretch"
	heroCode={`<amb-select name="country">
  Country
  <option value="">Choose a country</option>
  <option value="fr">France</option>
  <option value="de">Germany</option>
  <option value="jp">Japan</option>
  <option value="gb">United Kingdom</option>
</amb-select>`}
	usage={{
		do: [
			'Write the label as text in the element, and put each choice in its own <code>&lt;option&gt;</code>.',
			'Use a select for one choice from a long or familiar list, such as a country or a month.',
			'Start a required select with an empty option, such as <strong>Choose a country</strong>, so the form can fail until someone picks.',
			'Sort options in an order people expect: alphabetical for names, chronological for dates, by size for sizes.'
		],
		dont: [
			'Don’t use a select for two to six choices that people should compare. Use <code>&lt;amb-radio&gt;</code>.',
			'Don’t drop the label because the empty option explains the field. The option text is not the name.',
			'Don’t use a select to navigate or to run an action when the value changes.',
			'Don’t hide a choice people often need behind a long list. Preselect it, or list it first.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-select name="country">
				Country
				<option value="">Choose a country</option>
				<option value="fr">France</option>
				<option value="de">Germany</option>
				<option value="jp">Japan</option>
				<option value="gb">United Kingdom</option>
			</amb-select>
		</div>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		An empty first option prompts a choice. Mark an option <code>selected</code> to preset the value. A disabled
		select leaves the tab order and the form data, and still shows its current value.
	</p>
	<Stage
		align="stretch"
		code={`<amb-select name="month">
  Month
  <option value="">Choose a month</option>
  <option value="01">January</option>
  <option value="02">February</option>
  <option value="03">March</option>
</amb-select>
<amb-select name="currency">
  Currency
  <option value="eur" selected>Euro</option>
  <option value="gbp">Pound sterling</option>
  <option value="jpy">Yen</option>
</amb-select>
<amb-select name="language" disabled>
  Language
  <option value="en" selected>English</option>
  <option value="fr">French</option>
</amb-select>`}
	>
		<div class="grid">
			<amb-select name="month">
				Month
				<option value="">Choose a month</option>
				<option value="01">January</option>
				<option value="02">February</option>
				<option value="03">March</option>
			</amb-select>
			<amb-select name="currency">
				Currency
				<option value="eur" selected>Euro</option>
				<option value="gbp">Pound sterling</option>
				<option value="jpy">Yen</option>
			</amb-select>
			<amb-select name="language" disabled>
				Language
				<option value="en" selected>English</option>
				<option value="fr">French</option>
			</amb-select>
		</div>
	</Stage>

	<h2 id="grouped-options">Grouped options</h2>
	<p>
		Wrap options in <code>&lt;optgroup&gt;</code> when the list has natural sections. The group label is read with
		the option, and it cannot be selected.
	</p>
	<Stage
		align="stretch"
		code={`<amb-select name="store">
  Pickup store
  <option value="">Choose a store</option>
  <optgroup label="Paris">
    <option value="par-marais">Le Marais</option>
    <option value="par-opera">Opéra</option>
  </optgroup>
  <optgroup label="Lyon">
    <option value="lyo-bellecour">Bellecour</option>
    <option value="lyo-part-dieu">Part-Dieu</option>
  </optgroup>
</amb-select>`}
	>
		<div class="narrow">
			<amb-select name="store">
				Pickup store
				<option value="">Choose a store</option>
				<optgroup label="Paris">
					<option value="par-marais">Le Marais</option>
					<option value="par-opera">Opéra</option>
				</optgroup>
				<optgroup label="Lyon">
					<option value="lyo-bellecour">Bellecour</option>
					<option value="lyo-part-dieu">Part-Dieu</option>
				</optgroup>
			</amb-select>
		</div>
	</Stage>

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> blocks the submit until an option with a value is selected. The empty first option is
		what makes the check work. The message appears under the field after a failed submit.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <amb-select name="size" required>
    Size
    <option value="">Choose a size</option>
    <option value="s">Small</option>
    <option value="m">Medium</option>
    <option value="l">Large</option>
  </amb-select>
  <amb-button type="submit">Add to bag</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onValidationSubmit}>
			<amb-select name="size" required>
				Size
				<option value="">Choose a size</option>
				<option value="s">Small</option>
				<option value="m">Medium</option>
				<option value="l">Large</option>
			</amb-select>
			<div class="actions">
				<amb-button type="submit">Add to bag</amb-button>
			</div>
			<p class="status" aria-live="polite">{validationStatus}</p>
		</form>
	</Stage>

	<h2 id="address-form">Shipping address</h2>
	<p>
		A select sits in a form with text fields. Each control keeps its own visible label and autofill token, so the
		browser can fill the whole address at once.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Shipping address</h3>
  <amb-text-field name="name" autocomplete="shipping name" required>Full name</amb-text-field>
  <amb-text-field name="street" autocomplete="shipping street-address" required>Street address</amb-text-field>
  <div>
    <amb-text-field name="city" autocomplete="shipping address-level2" required>City</amb-text-field>
    <amb-text-field name="postcode" autocomplete="shipping postal-code" required>Postcode</amb-text-field>
  </div>
  <amb-select name="country" required>
    Country
    <option value="">Choose a country</option>
    <option value="fr">France</option>
    <option value="de">Germany</option>
    <option value="jp">Japan</option>
    <option value="gb">United Kingdom</option>
  </amb-select>
  <amb-button type="submit">Save address</amb-button>
</form>`}
	>
		<form class="panel form" onsubmit={onAddressSubmit}>
			<h3 class="panel-title">Shipping address</h3>
			<amb-text-field name="name" autocomplete="shipping name" required>Full name</amb-text-field>
			<amb-text-field name="street" autocomplete="shipping street-address" required>Street address</amb-text-field>
			<div class="pair">
				<amb-text-field name="city" autocomplete="shipping address-level2" required>City</amb-text-field>
				<amb-text-field name="postcode" autocomplete="shipping postal-code" required>Postcode</amb-text-field>
			</div>
			<amb-select name="country" required>
				Country
				<option value="">Choose a country</option>
				<option value="fr">France</option>
				<option value="de">Germany</option>
				<option value="jp">Japan</option>
				<option value="gb">United Kingdom</option>
			</amb-select>
			<div class="actions">
				<amb-button type="submit">Save address</amb-button>
			</div>
			<p class="status" aria-live="polite">{addressStatus}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		width: min(100%, 24rem);
		margin-inline: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: var(--amb-space-400);
	}

	.form {
		display: grid;
		gap: var(--amb-space-400);
	}

	.pair {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		gap: var(--amb-space-400);
	}

	.panel {
		width: min(100%, 30rem);
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
