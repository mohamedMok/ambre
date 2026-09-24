<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let validationStatus = $state('Submit the form empty to see the message.');
	let feedbackStatus = $state('The form has not been submitted.');

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

	function onFeedbackSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) feedbackStatus = summarize(event.currentTarget);
	}
</script>

<ComponentPage
	id="text-area"
	heroAlign="stretch"
	heroCode={`<amb-text-area name="note" rows="4" placeholder="Leave it at the front door.">
  Delivery instructions
</amb-text-area>`}
	usage={{
		do: [
			'Use a text area when the answer can run to more than one line, such as a message, a note, or a description.',
			'Set <code>rows</code> to the length you expect. Four rows suit a short note, six to eight suit a message.',
			'Keep the label visible in the slot and say what the text is for, such as <strong>Delivery instructions</strong>.',
			'Write a length limit or format rule in text next to the field, not only in the placeholder.'
		],
		dont: [
			'Don’t use a text area for a single short value such as a name or a code. Use <code>&lt;amb-text-field&gt;</code>.',
			'Don’t use the placeholder as the label, or as the only example of what to write.',
			'Don’t set <code>rows</code> to one or two. A short box suggests a short answer.',
			'Don’t mark a free-text field <code>required</code> unless the form cannot work without it.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-text-area name="note" rows={4} placeholder="Leave it at the front door.">Delivery instructions</amb-text-area>
		</div>
	{/snippet}

	<h2 id="rows">Rows</h2>
	<p>
		<code>rows</code> sets the visible height in lines. The default is four. Match it to the answer you expect, so
		the field signals its length before anyone types.
	</p>
	<Stage
		align="stretch"
		code={`<amb-text-area name="summary" rows="2">Summary</amb-text-area>
<amb-text-area name="message" rows="6">Message</amb-text-area>`}
	>
		<div class="grid">
			<amb-text-area name="summary" rows={2}>Summary</amb-text-area>
			<amb-text-area name="message" rows={6}>Message</amb-text-area>
		</div>
	</Stage>

	<h2 id="states">States</h2>
	<p>
		<strong>Read-only</strong> shows text that can be focused, selected, and submitted, but not edited.
		<strong>Disabled</strong> removes the field from the tab order and from the form data.
	</p>
	<Stage
		align="stretch"
		code={`<amb-text-area name="terms" rows="3" value="Refunds are issued to the original payment method within five business days." readonly>
  Refund terms
</amb-text-area>
<amb-text-area name="reply" rows="3" disabled>Reply</amb-text-area>`}
	>
		<div class="grid">
			<amb-text-area
				name="terms"
				rows={3}
				value="Refunds are issued to the original payment method within five business days."
				readonly
			>
				Refund terms
			</amb-text-area>
			<amb-text-area name="reply" rows={3} disabled>Reply</amb-text-area>
		</div>
	</Stage>

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> blocks the submit while the field is empty. The message appears under the field after a
		failed submit and clears once someone types.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <amb-text-area name="reason" rows="4" required>Reason for the return</amb-text-area>
  <amb-button type="submit">Request return</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onValidationSubmit}>
			<amb-text-area name="reason" rows={4} required>Reason for the return</amb-text-area>
			<div class="actions">
				<amb-button type="submit">Request return</amb-button>
			</div>
			<p class="status" aria-live="polite">{validationStatus}</p>
		</form>
	</Stage>

	<h2 id="feedback-form">Feedback form</h2>
	<p>
		A text area usually sits with other controls. Here a select narrows the topic, the text area holds the message,
		and a checkbox asks for permission to reply.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Send feedback</h3>
  <amb-select name="topic" required>
    Topic
    <option value="">Choose a topic</option>
    <option value="order">An order</option>
    <option value="product">A product</option>
    <option value="site">This website</option>
  </amb-select>
  <amb-text-area name="message" rows="6" required>Message</amb-text-area>
  <amb-checkbox name="contact" value="yes">You can contact me about this feedback</amb-checkbox>
  <amb-button type="submit">Send feedback</amb-button>
</form>`}
	>
		<form class="panel form" onsubmit={onFeedbackSubmit}>
			<h3 class="panel-title">Send feedback</h3>
			<amb-select name="topic" required>
				Topic
				<option value="">Choose a topic</option>
				<option value="order">An order</option>
				<option value="product">A product</option>
				<option value="site">This website</option>
			</amb-select>
			<amb-text-area name="message" rows={6} required>Message</amb-text-area>
			<amb-checkbox name="contact" value="yes">You can contact me about this feedback</amb-checkbox>
			<div class="actions">
				<amb-button type="submit">Send feedback</amb-button>
			</div>
			<p class="status" aria-live="polite">{feedbackStatus}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		width: min(100%, 28rem);
		margin-inline: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		align-items: start;
		gap: var(--amb-space-400);
	}

	.form {
		display: grid;
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
