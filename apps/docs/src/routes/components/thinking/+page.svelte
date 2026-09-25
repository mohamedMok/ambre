<script lang="ts">
	import { onMount } from 'svelte';
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const steps = ['Reading 3 invoices', 'Checking the due dates', 'Writing the summary'];
	let step = $state(0);

	onMount(() => {
		const timer = setInterval(() => (step = (step + 1) % steps.length), 2200);
		return () => clearInterval(timer);
	});
</script>

<ComponentPage
	id="thinking"
	heroCode={`<amb-thinking label="Reading 3 invoices"></amb-thinking>`}
	usage={{
		do: [
			'Show it between the question and the first streamed word. Remove it when the answer starts.',
			'Name the step in the label, such as Reading 3 invoices. Change the label as the work moves on.',
			'Place it where the answer will appear, at the end of the conversation.'
		],
		dont: [
			'Don’t keep it next to a streaming message. The caret already says the answer is arriving.',
			'Don’t use it for a wait unrelated to the assistant. Use <code>&lt;amb-spinner&gt;</code>.',
			'Don’t fake steps. The label should say what is really happening.'
		]
	}}
>
	{#snippet hero()}
		<amb-thinking label={steps[step]}></amb-thinking>
	{/snippet}

	<h2 id="motion">Motion</h2>
	<p>
		Three dots rise in turn, and a light sweeps across the label, on the loop duration. Under reduced motion both hold
		still and the label alone says the assistant is working. The status role announces a new label without moving
		focus.
	</p>
	<Stage code={`<amb-thinking></amb-thinking>`}>
		<amb-thinking></amb-thinking>
	</Stage>
</ComponentPage>
