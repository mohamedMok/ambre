<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let saved = $state(false);
	let saveButton = $state<HTMLElement>();
	let resetButton = $state<HTMLElement>();

	$effect(() => {
		const save = saveButton;
		const reset = resetButton;
		if (!save || !reset) return;
		const onSave = () => (saved = true);
		const onReset = () => (saved = false);
		save.addEventListener('click', onSave);
		reset.addEventListener('click', onReset);
		return () => {
			save.removeEventListener('click', onSave);
			reset.removeEventListener('click', onReset);
		};
	});
</script>

<ComponentPage
	id="banner"
	heroAlign="stretch"
	heroCode={`<amb-banner variant="danger">
  The payment did not go through. Check the card details and try again.
</amb-banner>`}
	usage={{
		do: [
			'Say what happened, then what to do next: <strong>The export failed. Try again in a few minutes.</strong>',
			'Place the banner at the top of the region it is about, above the content, and keep one banner per region.',
			'Add the banner to the page when the event happens. Its status role announces it without moving focus.'
		],
		dont: [
			'Don’t use a banner for a field error. Put the message next to the field.',
			'Don’t move focus to the banner. It already announces itself.',
			'Don’t put the whole meaning in the color. The message must say whether it succeeded or failed.'
		]
	}}
>
	{#snippet hero()}
		<amb-banner variant="danger">The payment did not go through. Check the card details and try again.</amb-banner>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		<strong>Neutral</strong> informs. <strong>Success</strong> confirms that a task finished.
		<strong>Danger</strong> reports a failure that someone needs to fix.
	</p>
	<Stage
		align="stretch"
		code={`<amb-banner>Maintenance is planned for Sunday from 02:00 to 03:00 UTC.</amb-banner>
<amb-banner variant="success">Your plan changed to Team. The new price starts on 1 October.</amb-banner>
<amb-banner variant="danger">The export failed. Try again in a few minutes.</amb-banner>`}
	>
		<amb-banner>Maintenance is planned for Sunday from 02:00 to 03:00 UTC.</amb-banner>
		<amb-banner variant="success">Your plan changed to Team. The new price starts on 1 October.</amb-banner>
		<amb-banner variant="danger">The export failed. Try again in a few minutes.</amb-banner>
	</Stage>

	<h2 id="at-the-top">At the top of a page</h2>
	<p>
		A banner is about the page or the section it opens. Put it between the heading and the content, so it is
		the first thing read after the title.
	</p>
	<Stage
		align="stretch"
		code={`<section>
  <h3>Billing</h3>
  <amb-banner variant="success">
    Your plan changed to Team. The new price starts on 1 October.
  </amb-banner>
  <dl>
    <dt>Plan</dt><dd>Team, 12 seats</dd>
    <dt>Next invoice</dt><dd>1 October, €240.00</dd>
  </dl>
</section>`}
	>
		<section class="panel" aria-labelledby="billing-title">
			<h3 class="panel-title" id="billing-title">Billing</h3>
			<amb-banner variant="success">Your plan changed to Team. The new price starts on 1 October.</amb-banner>
			<dl class="facts">
				<div><dt>Plan</dt><dd>Team, 12 seats</dd></div>
				<div><dt>Next invoice</dt><dd>1 October, €240.00</dd></div>
				<div><dt>Payment method</dt><dd>Card ending 4242</dd></div>
			</dl>
		</section>
	</Stage>

	<h2 id="after-an-action">After an action</h2>
	<p>
		Render the banner when the result is known. It announces the message once, and focus stays on the button
		that was pressed.
	</p>
	<Stage
		align="stretch"
		code={`<amb-button>Save settings</amb-button>

<!-- Added to the page after the save finishes -->
<amb-banner variant="success">Settings saved. They apply to new projects.</amb-banner>`}
	>
		<div class="actions">
			<amb-button bind:this={saveButton}>Save settings</amb-button>
			<amb-button variant="ghost" bind:this={resetButton}>Reset example</amb-button>
		</div>
		{#if saved}
			<amb-banner variant="success">Settings saved. They apply to new projects.</amb-banner>
		{/if}
	</Stage>
</ComponentPage>

<style>
	.panel {
		display: grid;
		gap: var(--amb-space-400);
		padding: var(--amb-space-500);
		border: var(--amb-border-width-default) solid var(--amb-color-border-default);
		border-radius: var(--amb-radius-lg);
		background: var(--amb-color-bg-surface);
	}

	.panel-title {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
		line-height: var(--amb-font-line-height-tight);
	}

	.facts {
		display: grid;
		gap: var(--amb-space-300);
		margin: 0;
	}

	.facts div {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--amb-space-200);
		padding-bottom: var(--amb-space-300);
		border-bottom: var(--amb-border-width-default) solid var(--amb-color-bg-muted);
	}

	.facts div:last-child {
		padding-bottom: 0;
		border-bottom: 0;
	}

	.facts dt {
		color: var(--amb-color-fg-muted);
	}

	.facts dd {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-weight: var(--amb-font-weight-semibold);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--amb-space-300);
	}
</style>
