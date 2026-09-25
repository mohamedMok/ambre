<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';
</script>

<ComponentPage
	id="message"
	heroAlign="stretch"
	heroCode={`<div role="log" aria-label="Conversation">
  <amb-message from="user">Which invoices are overdue?</amb-message>
  <amb-message>
    <span slot="avatar">A</span>
    <span slot="author">Assistant</span>
    <p>Three, for 4,210 euros in total:</p>
    <ul>…</ul>
    <amb-button slot="actions" size="sm" variant="ghost">Copy</amb-button>
  </amb-message>
</div>`}
	usage={{
		do: [
			'Put the turns in a container with <code>role="log"</code> and a label, so a screen reader announces each new turn once.',
			'Set <code>status="streaming"</code> while the words arrive, then <code>complete</code>. The turn is busy until then.',
			'Name the assistant in the <code>author</code> slot, so each turn has a name in the reading order.',
			'Keep actions under the turn quiet: ghost buttons, such as Copy, Retry, and a rating.'
		],
		dont: [
			'Don’t announce every streamed word with a live region. The log and aria-busy already handle it.',
			'Don’t render the assistant’s text as HTML you have not sanitised.',
			'Don’t hide an error. Set <code>status="error"</code> and say what to do in the <code>error</code> slot.'
		]
	}}
>
	{#snippet hero()}
		<div class="log" role="log" aria-label="Example conversation">
			<amb-message from="user">Which invoices are overdue?</amb-message>
			<amb-message>
				<span slot="avatar">A</span>
				<span slot="author">Assistant</span>
				<p>Three, for 4,210 euros in total:</p>
				<ul>
					<li>2026-098, Lumen, 1,900 euros</li>
					<li>2026-104, Orbit, 1,450 euros</li>
					<li>2026-107, Kiln, 860 euros</li>
				</ul>
				<amb-button slot="actions" size="sm" variant="ghost">Copy</amb-button>
				<amb-button slot="actions" size="sm" variant="ghost">Draft reminders</amb-button>
			</amb-message>
		</div>
	{/snippet}

	<h2 id="status">Streaming and errors</h2>
	<p>
		While streaming, a caret blinks at the end of the text and the turn has <code>aria-busy</code>. When the answer
		fails, the error line appears under what arrived, and the actions can offer a retry.
	</p>
	<Stage
		align="stretch"
		code={`<amb-message status="streaming">…</amb-message>
<amb-message status="error">
  …
  <span slot="error">The connection dropped. Try again.</span>
  <amb-button slot="actions" size="sm" variant="secondary">Retry</amb-button>
</amb-message>`}
	>
		<div class="log">
			<amb-message status="streaming">
				<span slot="avatar">A</span>
				<span slot="author">Assistant</span>
				Here is a reminder for Lumen: a short greeting, the invoice number, and the amount
			</amb-message>
			<amb-message status="error">
				<span slot="avatar">A</span>
				<span slot="author">Assistant</span>
				September revenue is 48,210 euros, which is
				<span slot="error">The connection dropped. Try again.</span>
				<amb-button slot="actions" size="sm" variant="secondary">Retry</amb-button>
			</amb-message>
		</div>
	</Stage>
</ComponentPage>

<style>
	.log {
		display: grid;
		gap: var(--amb-space-500);
		width: min(100%, 44rem);
		margin-inline: auto;
	}
</style>
