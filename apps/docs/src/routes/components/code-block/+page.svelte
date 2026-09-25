<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const listen = `import '@ambre-ds/ui';

const checkbox = document.querySelector('amb-checkbox');
checkbox.addEventListener('change', (event) => {
  console.log(event.detail.checked);
});`;

	let copied = $state('Nothing copied yet.');
</script>

<ComponentPage
	id="code-block"
	heroAlign="stretch"
	heroCode={`<amb-code-block language="js">
  import '@ambre-ds/ui';

  const checkbox = document.querySelector('amb-checkbox');
  checkbox.addEventListener('change', (event) => {
    console.log(event.detail.checked);
  });
</amb-code-block>`}
	usage={{
		do: [
			'Put the code as text in the element. It may be indented with the markup: the shared indent and the blank lines around it are removed.',
			'Set <code>language</code>, so the bar and the screen reader name say what the code is.',
			'Stream into it. It reads its text again as tokens arrive.',
			'Listen to <code>copied</code> to count copies, or to show a hint about what to do next.'
		],
		dont: [
			'Don’t put HTML inside and expect it rendered. The code is shown as text, so a model cannot inject markup.',
			'Don’t use <code>wrap</code> for code where line breaks matter, such as Python or YAML.',
			'Don’t use a code block for a single command inside a sentence. Use <code>&lt;code&gt;</code>.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-code-block language="js">{listen}</amb-code-block>
		</div>
	{/snippet}

	<h2 id="copy">Copy</h2>
	<p>
		The button writes the code to the clipboard, reads Copied for two seconds, and fires <code>copied</code> with the text.
	</p>
	<Stage
		align="stretch"
		code={`<amb-code-block language="bash">npm install @ambre-ds/ai</amb-code-block>`}
	>
		<div class="narrow">
			<amb-code-block language="bash" oncopied={() => (copied = 'Copied the install command.')}>
				npm install @ambre-ds/tokens @ambre-ds/ui @ambre-ds/ai
			</amb-code-block>
			<p class="status" aria-live="polite">{copied}</p>
		</div>
	</Stage>

	<h2 id="in-a-message">In an answer</h2>
	<Stage
		align="stretch"
		code={`<amb-message>
  <span slot="author">Assistant</span>
  <p>Install the packages:</p>
  <amb-code-block language="bash">npm install @ambre-ds/ui</amb-code-block>
</amb-message>`}
	>
		<div class="narrow">
			<amb-message>
				<span slot="avatar">A</span>
				<span slot="author">Assistant</span>
				<p>Install the packages, then load the tokens before the library:</p>
				<amb-code-block language="bash">npm install @ambre-ds/tokens @ambre-ds/ui</amb-code-block>
			</amb-message>
		</div>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		display: grid;
		gap: var(--amb-space-300);
		width: min(100%, 40rem);
		margin-inline: auto;
	}

	.status {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}
</style>
