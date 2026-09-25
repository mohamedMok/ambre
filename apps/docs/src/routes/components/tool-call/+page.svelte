<script lang="ts">
	import { onMount } from 'svelte';
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	// A small replay: the last step runs, then finishes.
	let drafting = $state<'running' | 'complete'>('running');
	onMount(() => {
		const timer = setInterval(() => (drafting = drafting === 'running' ? 'complete' : 'running'), 2600);
		return () => clearInterval(timer);
	});
</script>

<ComponentPage
	id="tool-call"
	heroAlign="stretch"
	heroCode={`<ol class="steps">
  <li><amb-tool-call>Read the billing policy</amb-tool-call></li>
  <li>
    <amb-tool-call>
      Searched 214 invoices
      <span slot="meta">1.2 s</span>
      <pre slot="input">search_invoices({ status: "overdue" })</pre>
      <pre slot="output">3 results: 2026-098, 2026-104, 2026-107</pre>
    </amb-tool-call>
  </li>
  <li><amb-tool-call status="running">Drafting 3 reminders</amb-tool-call></li>
</ol>`}
	usage={{
		do: [
			'Show each step an agent takes, in the order it ran, in the assistant’s turn before the answer.',
			'Write the title as what the step did, with the numbers people care about: Searched 214 invoices.',
			'Put the arguments in <code>input</code> and the result in <code>output</code>, so people can check the work. Keep the details closed by default.',
			'Set <code>status="error"</code> when a step fails, and say why in the output.'
		],
		dont: [
			'Don’t show internal steps people cannot act on, such as retries or token counts.',
			'Don’t put the answer in a tool call. The answer belongs in the message.',
			'Don’t leave a step running after the answer has arrived.'
		]
	}}
>
	{#snippet hero()}
		<ol class="steps">
			<li><amb-tool-call>Read the billing policy</amb-tool-call></li>
			<li>
				<amb-tool-call>
					Searched 214 invoices
					<span slot="meta">1.2 s</span>
					<pre slot="input">search_invoices(&#123; status: "overdue" &#125;)</pre>
					<pre slot="output">3 results: 2026-098, 2026-104, 2026-107</pre>
				</amb-tool-call>
			</li>
			<li><amb-tool-call status={drafting}>Drafting 3 reminders</amb-tool-call></li>
		</ol>
	{/snippet}

	<h2 id="in-a-message">In an answer</h2>
	<p>The steps sit in the assistant’s turn, above the text they led to.</p>
	<Stage
		align="stretch"
		code={`<amb-message>
  <span slot="author">Assistant</span>
  <amb-tool-call>Searched 214 invoices</amb-tool-call>
  <p>Three invoices are overdue, for 4,210 euros in total.</p>
</amb-message>`}
	>
		<div class="narrow">
			<amb-message>
				<span slot="avatar">A</span>
				<span slot="author">Assistant</span>
				<amb-tool-call>Searched 214 invoices <span slot="meta">1.2 s</span></amb-tool-call>
				<p>Three invoices are overdue, for 4,210 euros in total. The oldest is 2026-098, sent to Lumen on 12 August.</p>
			</amb-message>
		</div>
	</Stage>

	<h2 id="failed">A failed step</h2>
	<Stage
		align="stretch"
		code={`<amb-tool-call status="error" open>
  Could not reach the billing API
  <pre slot="input">search_invoices({ status: "overdue" })</pre>
  <pre slot="output">Timeout after 30 s.</pre>
</amb-tool-call>`}
	>
		<div class="narrow">
			<amb-tool-call status="error" open>
				Could not reach the billing API
				<pre slot="input">search_invoices(&#123; status: "overdue" &#125;)</pre>
				<pre slot="output">Timeout after 30 s. The billing API did not answer.</pre>
			</amb-tool-call>
		</div>
	</Stage>
</ComponentPage>

<style>
	.steps {
		display: grid;
		gap: var(--amb-space-200);
		width: min(100%, 36rem);
		margin: 0 auto;
		padding: 0;
		list-style: none;
	}

	.narrow {
		width: min(100%, 40rem);
		margin-inline: auto;
	}

	.narrow p {
		margin: var(--amb-space-300) 0 0;
	}
</style>
