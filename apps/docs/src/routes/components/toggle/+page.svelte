<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let settingsStatus = $state('Changes save as soon as a switch moves.');
	let apiStatus = $state('Submit with the switch off to see the message.');

	function onSettingsInput(event: Event) {
		const control = event.composedPath()[0];
		if (!(control instanceof HTMLInputElement)) return;
		const host = event.target;
		const label = host instanceof HTMLElement ? (host.textContent ?? '').trim() : '';
		if (label) settingsStatus = `Saved. ${label} is ${control.checked ? 'on' : 'off'}.`;
	}

	function onApiSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;
		const entries = [...new FormData(form).entries()].map(
			([key, value]) => `${key}=${typeof value === 'string' ? value : value.name}`
		);
		apiStatus = `Submitted ${entries.join(', ')}.`;
	}
</script>

<ComponentPage
	id="toggle"
	heroCode={`<amb-toggle name="alerts" checked>Email alerts</amb-toggle>`}
	usage={{
		do: [
			'Use a toggle for a setting that takes effect as soon as it moves, such as <strong>Email alerts</strong>.',
			'Name the thing that turns on in the slot. The switch state already says on or off.',
			'Save the change right away and confirm it in text, or put the toggle in a form with a submit button.',
			'List related toggles in a settings panel, one setting per row, with the label first.'
		],
		dont: [
			'Don’t write <strong>On</strong>, <strong>Off</strong>, or a question as the label.',
			'Don’t use a toggle for consent or for a choice that only applies after a submit. Use <code>&lt;amb-checkbox&gt;</code>.',
			'Don’t use a toggle to choose between two named options, such as list and grid. Use <code>&lt;amb-radio&gt;</code>.',
			'Don’t rely on color to show the state. The thumb position and the switch role carry it.'
		]
	}}
>
	{#snippet hero()}
		<amb-toggle name="alerts" checked>Email alerts</amb-toggle>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		<code>checked</code> is the on state. The thumb moves to the end and the track fills, so the state does not rely
		on color. A disabled toggle leaves the tab order and the form data.
	</p>
	<Stage
		code={`<amb-toggle name="wifi" checked>Wi-Fi</amb-toggle>
<amb-toggle name="bluetooth">Bluetooth</amb-toggle>
<amb-toggle name="roaming" checked disabled>Data roaming</amb-toggle>
<amb-toggle name="hotspot" disabled>Personal hotspot</amb-toggle>`}
	>
		<div class="stack">
			<amb-toggle name="wifi" checked>Wi-Fi</amb-toggle>
			<amb-toggle name="bluetooth">Bluetooth</amb-toggle>
			<amb-toggle name="roaming" checked disabled>Data roaming</amb-toggle>
			<amb-toggle name="hotspot" disabled>Personal hotspot</amb-toggle>
		</div>
	</Stage>

	<h2 id="settings-panel">Settings panel</h2>
	<p>
		A toggle fits a settings page where each change applies at once. The status line confirms every change in
		text, and a live region reads it to screen reader users.
	</p>
	<Stage
		align="stretch"
		code={`<section>
  <h3>Notifications</h3>
  <amb-toggle name="orders" checked>Order updates</amb-toggle>
  <amb-toggle name="messages" checked>Messages from sellers</amb-toggle>
  <amb-toggle name="offers">Offers and sales</amb-toggle>
  <amb-toggle name="digest">Weekly digest</amb-toggle>
  <p aria-live="polite">Changes save as soon as a switch moves.</p>
</section>`}
	>
		<section class="panel">
			<h3 class="panel-title">Notifications</h3>
			<div class="rows" oninput={onSettingsInput}>
				<amb-toggle name="orders" checked>Order updates</amb-toggle>
				<amb-toggle name="messages" checked>Messages from sellers</amb-toggle>
				<amb-toggle name="offers">Offers and sales</amb-toggle>
				<amb-toggle name="digest">Weekly digest</amb-toggle>
			</div>
			<p class="status" aria-live="polite">{settingsStatus}</p>
		</section>
	</Stage>

	<h2 id="in-a-form">In a form</h2>
	<p>
		Inside a form, a toggle submits its <code>value</code> under its <code>name</code> while it is on.
		<code>required</code> blocks the submit until the switch is on. Use it when a feature has to be on before the
		rest of the form makes sense, as with API access below.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Create an API key</h3>
  <amb-toggle name="api" value="enabled" required>API access</amb-toggle>
  <amb-text-field name="key-name" required>Key name</amb-text-field>
  <amb-button type="submit">Create key</amb-button>
</form>`}
	>
		<form class="panel" onsubmit={onApiSubmit}>
			<h3 class="panel-title">Create an API key</h3>
			<amb-toggle name="api" value="enabled" required>API access</amb-toggle>
			<amb-text-field name="key-name" required>Key name</amb-text-field>
			<div class="actions">
				<amb-button type="submit">Create key</amb-button>
			</div>
			<p class="status" aria-live="polite">{apiStatus}</p>
		</form>
	</Stage>

	<h2 id="toggle-or-checkbox">Toggle or checkbox</h2>
	<p>Both hold a yes or no. Pick by when the choice takes effect.</p>
	<div class="table-wrap">
		<table class="api">
			<thead>
				<tr><th scope="col">The choice</th><th scope="col">Use</th></tr>
			</thead>
			<tbody>
				<tr><td>Applies at once, like a light switch</td><td><code>&lt;amb-toggle&gt;</code></td></tr>
				<tr><td>Applies when the form is submitted</td><td><code>&lt;amb-checkbox&gt;</code></td></tr>
				<tr><td>Is an agreement or consent</td><td><code>&lt;amb-checkbox&gt;</code></td></tr>
				<tr><td>Is one of several items in a list</td><td><code>&lt;amb-checkbox&gt;</code></td></tr>
			</tbody>
		</table>
	</div>
</ComponentPage>

<style>
	.stack {
		display: grid;
		gap: var(--amb-space-300);
	}

	.panel {
		display: grid;
		gap: var(--amb-space-400);
		width: min(100%, 26rem);
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

	.rows {
		display: grid;
		gap: var(--amb-space-300);
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
