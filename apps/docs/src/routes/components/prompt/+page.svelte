<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	type Turn = { from: 'user' | 'assistant'; text: string; status: 'complete' | 'streaming' };

	// A canned assistant, so the demo shows the whole loop without a model.
	const answers = [
		'Three invoices are overdue, for 4,210 euros in total. The oldest is 2026-098, sent to Lumen on 12 August.',
		'Here is a reminder for Lumen: a short greeting, the invoice number, the amount, the due date, and a link to pay.',
		'September revenue is 48,210 euros, 12% more than August. Refunds rose by 4%.'
	];

	let turns = $state<Turn[]>([]);
	let busy = $state(false);
	let thinking = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;

	function reply(question: string) {
		turns.push({ from: 'user', text: question, status: 'complete' });
		busy = true;
		thinking = true;
		const answer = answers[Math.floor(turns.length / 2) % answers.length];
		timer = setTimeout(() => {
			thinking = false;
			turns.push({ from: 'assistant', text: '', status: 'streaming' });
			const words = answer.split(' ');
			let index = 0;
			const step = () => {
				const turn = turns[turns.length - 1];
				if (!busy || index >= words.length) {
					turn.status = 'complete';
					busy = false;
					return;
				}
				turn.text = words.slice(0, (index += 1)).join(' ');
				timer = setTimeout(step, 45);
			};
			step();
		}, 900);
	}

	function onSend(event: Event) {
		const text = (event as CustomEvent<{ value: string }>).detail.value;
		reply(text);
	}

	function onStop() {
		clearTimeout(timer);
		thinking = false;
		busy = false;
		const last = turns[turns.length - 1];
		if (last?.status === 'streaming') last.status = 'complete';
	}

	function suggest(text: string) {
		if (!busy) reply(text);
	}
</script>

<ComponentPage
	id="prompt"
	heroAlign="stretch"
	heroMinHeight={420}
	heroCode={`<div role="log" aria-label="Conversation">…amb-message…</div>
<amb-prompt placeholder="Ask about your invoices">Message</amb-prompt>

<script>
  const prompt = document.querySelector('amb-prompt');
  prompt.addEventListener('send', async (event) => {
    prompt.busy = true;
    await answer(event.detail.value);
    prompt.busy = false;
  });
  prompt.addEventListener('stop', () => abortTheAnswer());
</script>`}
	usage={{
		do: [
			'Listen to <code>send</code> and read <code>event.detail.value</code>. The field empties itself, unless you cancel the event.',
			'Set <code>busy</code> while the answer streams. Sending waits, and the stop button lets people interrupt.',
			'Give the prompt a label in the default slot, such as Message. It is visually hidden and read by screen readers.',
			'Offer <a href="/components/suggestion">suggestions</a> above an empty conversation, so people know what to ask.'
		],
		dont: [
			'Don’t use the placeholder to explain the rules. Say what the assistant can do above the conversation.',
			'Don’t send on every Enter in a language that composes text, such as Japanese. The prompt already waits for the composition to end.',
			'Don’t disable the prompt while streaming. Use <code>busy</code>, so people can keep typing the next question.'
		]
	}}
>
	{#snippet hero()}
		<div class="chat">
			<div class="log" role="log" aria-label="Conversation">
				{#if turns.length === 0}
					<div class="empty">
						<p class="hello">Ask about your invoices.</p>
						<ul class="suggestions" aria-label="Try asking">
							{#each ['Which invoices are overdue?', 'Draft a reminder to Lumen', 'How did September go?'] as text}
								<li>
									<!-- amb-suggestion renders a native button: Enter and Space fire the click. -->
									<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
									<amb-suggestion onclick={() => suggest(text)}>{text}</amb-suggestion>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#each turns as turn}
					{#if turn.from === 'user'}
						<amb-message from="user">{turn.text}</amb-message>
					{:else}
						<amb-message status={turn.status}>
							<span slot="avatar">A</span>
							<span slot="author">Assistant</span>
							{turn.text}
						</amb-message>
					{/if}
				{/each}
				{#if thinking}
					<amb-thinking label="Reading the invoices"></amb-thinking>
				{/if}
			</div>
			<!-- `|| undefined` drops the attribute: an empty boolean attribute would read as true. -->
			<amb-prompt placeholder="Ask about your invoices" busy={busy || undefined} onsend={onSend} onstop={onStop}>
				Message
			</amb-prompt>
		</div>
	{/snippet}

	<h2 id="states">States</h2>
	<p>
		Send is disabled while the field is empty. While <code>busy</code>, it becomes a stop button and Enter waits. Put
		secondary actions, such as attaching a file, in the <code>actions</code> slot.
	</p>
	<Stage
		align="stretch"
		code={`<amb-prompt placeholder="Ask anything">
  Message
  <amb-button slot="actions" size="sm" variant="ghost">Attach</amb-button>
</amb-prompt>
<amb-prompt busy>Message</amb-prompt>
<amb-prompt disabled placeholder="Sign in to ask">Message</amb-prompt>`}
	>
		<div class="stack">
			<amb-prompt placeholder="Ask anything">
				Message
				<amb-button slot="actions" size="sm" variant="ghost">Attach</amb-button>
			</amb-prompt>
			<amb-prompt busy placeholder="Ask a follow-up">Message</amb-prompt>
			<amb-prompt disabled placeholder="Sign in to ask">Message</amb-prompt>
		</div>
	</Stage>
</ComponentPage>

<style>
	.chat {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: var(--amb-space-400);
		width: min(100%, 44rem);
		min-height: 360px;
		margin-inline: auto;
	}

	.log {
		display: grid;
		align-content: end;
		gap: var(--amb-space-500);
	}

	.empty {
		display: grid;
		justify-items: center;
		gap: var(--amb-space-300);
		text-align: center;
	}

	.hello {
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-500);
		font-weight: var(--amb-font-weight-semibold);
	}

	.suggestions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: var(--amb-space-200);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.stack {
		display: grid;
		gap: var(--amb-space-400);
		width: min(100%, 40rem);
		margin-inline: auto;
	}
</style>
