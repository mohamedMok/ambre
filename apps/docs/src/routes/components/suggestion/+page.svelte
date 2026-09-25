<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let picked = $state('Nothing sent yet.');
</script>

<ComponentPage
	id="suggestion"
	heroCode={`<section aria-labelledby="try">
  <h2 id="try">Try asking</h2>
  <ul>
    <li><amb-suggestion>Which invoices are overdue?</amb-suggestion></li>
    <li><amb-suggestion>Draft a payment reminder</amb-suggestion></li>
    <li><amb-suggestion>Compare September with August</amb-suggestion></li>
  </ul>
</section>`}
	usage={{
		do: [
			'Write each suggestion as people would type it, as a question or a request.',
			'Offer three or four, above an empty conversation or after an answer as next steps.',
			'On click, send the text, or put it in the prompt when people may want to edit it first.',
			'Group them in a list with a heading, such as Try asking.'
		],
		dont: [
			'Don’t use a suggestion for a command that is not a prompt, such as Settings. Use <code>&lt;amb-button&gt;</code>.',
			'Don’t write more than one line. The label is cut with an ellipsis when it runs out of room.',
			'Don’t keep suggestions active while an answer streams. Set <code>disabled</code>.'
		]
	}}
>
	{#snippet hero()}
		<section class="try" aria-labelledby="try-asking">
			<p id="try-asking" class="heading">Try asking</p>
			<ul class="list">
				{#each ['Which invoices are overdue?', 'Draft a payment reminder', 'Compare September with August'] as text}
					<li>
						<!-- amb-suggestion renders a native button: Enter and Space fire the click. -->
						<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
						<amb-suggestion onclick={() => (picked = `Sent: ${text}`)}>{text}</amb-suggestion>
					</li>
				{/each}
			</ul>
			<p class="status" aria-live="polite">{picked}</p>
		</section>
	{/snippet}

	<h2 id="icons">Icons and states</h2>
	<p>The default mark is a small spark. Slot an <code>amb-icon</code> to say what kind of task it is.</p>
	<Stage
		code={`<amb-suggestion>
  <amb-icon slot="icon" name="mail" size="sm"></amb-icon>
  Draft an email
</amb-suggestion>
<amb-suggestion disabled>Summarise this week</amb-suggestion>`}
	>
		<ul class="list">
			<li>
				<amb-suggestion><amb-icon slot="icon" name="mail" size="sm"></amb-icon>Draft an email</amb-suggestion>
			</li>
			<li>
				<amb-suggestion><amb-icon slot="icon" name="table_chart" size="sm"></amb-icon>Build a table</amb-suggestion>
			</li>
			<li><amb-suggestion disabled>Summarise this week</amb-suggestion></li>
		</ul>
	</Stage>
</ComponentPage>

<style>
	.try {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-300);
	}

	.heading {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		font-weight: var(--amb-font-weight-semibold);
	}

	.list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-200);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
