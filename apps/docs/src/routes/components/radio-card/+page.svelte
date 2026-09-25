<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let status = $state('Submit without a choice to see the message.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!(event.currentTarget instanceof HTMLFormElement)) return;
		status = `Submitted delivery=${new FormData(event.currentTarget).get('delivery')}.`;
	}
</script>

<ComponentPage
	id="radio-card"
	heroAlign="stretch"
	heroCode={`<fieldset>
  <legend>Plan</legend>
  <amb-radio-card name="plan" value="starter">
    Starter
    <span slot="description">Up to 3 people. Free.</span>
  </amb-radio-card>
  <amb-radio-card name="plan" value="team" checked>
    Team
    <span slot="description">Up to 50 people. 8 euros a person a month.</span>
  </amb-radio-card>
  <amb-radio-card name="plan" value="business">
    Business
    <span slot="description">Single sign-on and an audit log.</span>
  </amb-radio-card>
</fieldset>`}
	usage={{
		do: [
			'Use radio cards for a short list of choices that people compare, such as plans or delivery options.',
			'Put the facts people compare in the <code>description</code> slot: the price, the delay, the limit.',
			'Check the option most people pick, when there is one. Leave the group empty when the choice needs thought.',
			'Set <code>required</code> on every card of a required group.'
		],
		dont: [
			'Don’t use more than about four cards. Use <code>&lt;amb-radio&gt;</code> or <code>&lt;amb-select&gt;</code>.',
			'Don’t put links or buttons inside a card. The whole card selects the choice.',
			'Don’t make one card look different to push it. Say why it is recommended in its description.'
		]
	}}
>
	{#snippet hero()}
		<fieldset class="grid">
			<legend>Plan</legend>
			<amb-radio-card name="plan" value="starter">
				Starter
				<span slot="description">Up to 3 people. Free.</span>
			</amb-radio-card>
			<amb-radio-card name="plan" value="team" checked>
				Team
				<span slot="description">Up to 50 people. 8 euros a person a month.</span>
			</amb-radio-card>
			<amb-radio-card name="plan" value="business">
				Business
				<span slot="description">Single sign-on and an audit log.</span>
			</amb-radio-card>
		</fieldset>
	{/snippet}

	<h2 id="validation">With icons and validation</h2>
	<p>
		The group is one tab stop, and the arrow keys move the selection. With <code>required</code> on every card, the
		form cannot submit until one is checked, and the message appears under the first card.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <fieldset>
    <legend>Delivery</legend>
    <amb-radio-card name="delivery" value="standard" required>
      <amb-icon slot="icon" name="local_shipping"></amb-icon>
      Standard
      <span slot="description">3 to 5 days, free.</span>
    </amb-radio-card>
    …
  </fieldset>
  <amb-button type="submit">Continue</amb-button>
</form>`}
	>
		<form class="form" onsubmit={onSubmit}>
			<fieldset class="grid">
				<legend>Delivery</legend>
				<amb-radio-card name="delivery" value="standard" required>
					<amb-icon slot="icon" name="local_shipping"></amb-icon>
					Standard
					<span slot="description">3 to 5 days, free.</span>
				</amb-radio-card>
				<amb-radio-card name="delivery" value="express" required>
					<amb-icon slot="icon" name="bolt"></amb-icon>
					Express
					<span slot="description">Next day, 9 euros.</span>
				</amb-radio-card>
				<amb-radio-card name="delivery" value="pickup" required>
					<amb-icon slot="icon" name="storefront"></amb-icon>
					Pick up in store
					<span slot="description">Today, free.</span>
				</amb-radio-card>
			</fieldset>
			<div><amb-button type="submit">Continue</amb-button></div>
			<p class="status" aria-live="polite">{status}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		align-content: start;
		gap: var(--amb-space-300);
		min-width: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.grid legend {
		margin-bottom: var(--amb-space-300);
		padding: 0;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.form {
		display: grid;
		gap: var(--amb-space-400);
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
