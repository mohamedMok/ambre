<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	const size = 18.4;
	let sent = $state(0);
	let running = $state(false);
	let startButton = $state<HTMLElement>();
	const done = $derived(sent >= size);
	const status = $derived(
		done ? 'Upload complete.' : running ? `${sent.toFixed(1)} of ${size} MB sent` : 'Not started.'
	);

	$effect(() => {
		const el = startButton;
		if (!el) return;
		const start = () => {
			if (running) return;
			sent = 0;
			running = true;
		};
		el.addEventListener('click', start);
		return () => el.removeEventListener('click', start);
	});

	$effect(() => {
		if (!running) return;
		const timer = setInterval(() => {
			sent = Math.min(size, Math.round((sent + 1.3) * 10) / 10);
			if (sent >= size) running = false;
		}, 180);
		return () => clearInterval(timer);
	});
</script>

<ComponentPage
	id="progress"
	heroCode={`<div class="upload">
  <p>contract-2026.pdf <span>64%</span></p>
  <amb-progress value="64" max="100" label="Uploading contract-2026.pdf"></amb-progress>
</div>`}
	usage={{
		do: [
			'Name the task in <code>label</code>, such as <strong>Uploading contract-2026.pdf</strong>. The bar has no visible text of its own.',
			'Show the amount in text as well, such as <strong>64%</strong> or <strong>Step 2 of 5</strong>, next to the bar.',
			'Set <code>max</code> to the real unit of the task, such as bytes, files, or steps, and update <code>value</code> as it moves.'
		],
		dont: [
			'Don’t use progress when you cannot measure the task. Use a spinner.',
			'Don’t move the bar backwards. If a task restarts, say so in text and start a new bar.',
			'Don’t use progress to show a score or a quota. It describes a task that finishes.'
		]
	}}
>
	{#snippet hero()}
		<div class="upload">
			<p class="upload-line"><span class="upload-name">contract-2026.pdf</span> <span class="upload-amount">64%</span></p>
			<amb-progress value={64} max={100} label="Uploading contract-2026.pdf"></amb-progress>
		</div>
	{/snippet}

	<h2 id="values">Values</h2>
	<p>
		The fill is <code>value</code> divided by <code>max</code>. Both are exposed to assistive technology, so the
		amount is announced with the label.
	</p>
	<Stage
		code={`<amb-progress value="0" label="Import not started"></amb-progress>
<amb-progress value="35" label="Importing contacts"></amb-progress>
<amb-progress value="100" label="Import finished"></amb-progress>`}
	>
		<div class="stack">
			<div class="row"><span class="row-label">0%</span><amb-progress value={0} label="Import not started"></amb-progress></div>
			<div class="row"><span class="row-label">35%</span><amb-progress value={35} label="Importing contacts"></amb-progress></div>
			<div class="row"><span class="row-label">100%</span><amb-progress value={100} label="Import finished"></amb-progress></div>
		</div>
	</Stage>

	<h2 id="steps">Steps</h2>
	<p>
		<code>max</code> does not have to be 100. For a flow with five steps, set <code>max="5"</code> and count the
		finished steps.
	</p>
	<Stage
		code={`<p>Step 2 of 5: Shipping address</p>
<amb-progress value="2" max="5" label="Checkout, step 2 of 5"></amb-progress>`}
	>
		<div class="upload">
			<p class="upload-line"><span class="upload-name">Shipping address</span> <span class="upload-amount">Step 2 of 5</span></p>
			<amb-progress value={2} max={5} label="Checkout, step 2 of 5"></amb-progress>
		</div>
	</Stage>

	<h2 id="live">Updating as the task moves</h2>
	<p>
		Set <code>value</code> as the work arrives. The visible text and the bar change together, and the final
		message says the task is done.
	</p>
	<Stage
		code={`<p>quarterly-photos.zip <span>11.7 of 18.4 MB sent</span></p>
<amb-progress value="11.7" max="18.4" label="Uploading quarterly-photos.zip"></amb-progress>
<amb-button>Start upload</amb-button>`}
	>
		<div class="upload">
			<p class="upload-line">
				<span class="upload-name">quarterly-photos.zip</span>
				<span class="upload-amount">{status}</span>
			</p>
			<p class="visually-hidden" aria-live="polite">{done ? 'Upload complete.' : ''}</p>
			<amb-progress value={sent} max={size} label="Uploading quarterly-photos.zip"></amb-progress>
			<div class="upload-actions">
				<amb-button variant="secondary" bind:this={startButton}>{done ? 'Upload again' : 'Start upload'}</amb-button>
			</div>
		</div>
	</Stage>
</ComponentPage>

<style>
	.upload {
		display: grid;
		gap: var(--amb-space-300);
		width: min(100%, 26rem);
	}

	.upload-line {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: var(--amb-space-200);
		margin: 0;
		color: var(--amb-color-fg-default);
		font-size: var(--amb-font-size-200);
	}

	.upload-name {
		font-weight: var(--amb-font-weight-semibold);
	}

	.upload-amount {
		color: var(--amb-color-fg-muted);
		font-variant-numeric: tabular-nums;
	}

	.upload-actions {
		margin-top: var(--amb-space-200);
	}

	.stack {
		display: grid;
		gap: var(--amb-space-400);
		width: min(100%, 26rem);
	}

	.row {
		display: grid;
		grid-template-columns: 3rem minmax(0, 1fr);
		align-items: center;
		gap: var(--amb-space-300);
	}

	.row-label {
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		font-variant-numeric: tabular-nums;
		text-align: end;
	}
</style>
