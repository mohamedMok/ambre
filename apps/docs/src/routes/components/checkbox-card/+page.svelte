<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let status = $state('The form has not been submitted.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!(event.currentTarget instanceof HTMLFormElement)) return;
		const picked = new FormData(event.currentTarget).getAll('addons');
		status = picked.length ? `Submitted addons=${picked.join(', ')}.` : 'Submitted with no add-ons.';
	}
</script>

<ComponentPage
	id="checkbox-card"
	heroAlign="stretch"
	heroCode={`<fieldset>
  <legend>Add-ons</legend>
  <amb-checkbox-card name="addons" value="backup" checked>
    <amb-icon slot="icon" name="backup"></amb-icon>
    Daily backups
    <span slot="description">Keep 30 days of snapshots. 4 euros a month.</span>
  </amb-checkbox-card>
  <amb-checkbox-card name="addons" value="support">
    <amb-icon slot="icon" name="support_agent"></amb-icon>
    Priority support
    <span slot="description">An answer within four hours, every day.</span>
  </amb-checkbox-card>
</fieldset>`}
	usage={{
		do: [
			'Use checkbox cards when each choice needs a line of explanation, such as a price or what it includes.',
			'Group the cards in a <code>&lt;fieldset&gt;</code> with a <code>&lt;legend&gt;</code>, and give them one <code>name</code> so the form sends a list.',
			'Keep the label to a few words. Put the details in the <code>description</code> slot, which is read as the description.',
			'Lay the cards out in a grid of equal cards. Each stretches to the height of its row.'
		],
		dont: [
			'Don’t use a checkbox card for a choice that needs no explanation. Use <code>&lt;amb-checkbox&gt;</code>.',
			'Don’t put links or buttons inside the card. The whole card toggles the choice.',
			'Don’t use checkbox cards when only one choice can apply. Use <code>&lt;amb-radio-card&gt;</code>.'
		]
	}}
>
	{#snippet hero()}
		<fieldset class="grid">
			<legend>Add-ons</legend>
			<amb-checkbox-card name="addons" value="backup" checked>
				<amb-icon slot="icon" name="backup"></amb-icon>
				Daily backups
				<span slot="description">Keep 30 days of snapshots. 4 euros a month.</span>
			</amb-checkbox-card>
			<amb-checkbox-card name="addons" value="support">
				<amb-icon slot="icon" name="support_agent"></amb-icon>
				Priority support
				<span slot="description">An answer within four hours, every day.</span>
			</amb-checkbox-card>
			<amb-checkbox-card name="addons" value="sso" disabled>
				<amb-icon slot="icon" name="key"></amb-icon>
				Single sign-on
				<span slot="description">Only on the Business plan.</span>
			</amb-checkbox-card>
		</fieldset>
	{/snippet}

	<h2 id="form">In a form</h2>
	<p>
		Each checked card adds its <code>value</code> under the shared <code>name</code>, like a native checkbox. Space
		toggles the focused card, and the whole card is the pointer target.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <fieldset>
    <legend>What should we send you?</legend>
    <amb-checkbox-card name="topics" value="releases">Releases<span slot="description">Once a month.</span></amb-checkbox-card>
    <amb-checkbox-card name="topics" value="security">Security notices<span slot="description">Only when it matters.</span></amb-checkbox-card>
  </fieldset>
  <amb-button type="submit">Save</amb-button>
</form>`}
	>
		<form class="form" onsubmit={onSubmit}>
			<fieldset class="grid">
				<legend>What should we send you?</legend>
				<amb-checkbox-card name="addons" value="releases">
					Releases
					<span slot="description">What changed, once a month.</span>
				</amb-checkbox-card>
				<amb-checkbox-card name="addons" value="security" checked>
					Security notices
					<span slot="description">Only when something needs action.</span>
				</amb-checkbox-card>
			</fieldset>
			<div><amb-button type="submit">Save</amb-button></div>
			<p class="status" aria-live="polite">{status}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
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
