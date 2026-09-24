<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let budget = $state(250);
	let filterStatus = $state('The filters have not been applied.');

	function readValue(event: Event) {
		const control = event.composedPath()[0];
		return control instanceof HTMLInputElement && control.type === 'range' ? control.valueAsNumber : undefined;
	}

	function onBudgetInput(event: Event) {
		const next = readValue(event);
		if (next !== undefined) budget = next;
	}

	function onFilterSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;
		const entries = [...new FormData(form).entries()].map(
			([key, value]) => `${key}=${typeof value === 'string' ? value : value.name}`
		);
		filterStatus = `Applied ${entries.join(', ')}.`;
	}
</script>

<ComponentPage
	id="range"
	heroAlign="stretch"
	heroCode={`<amb-range name="volume" value="40">Volume</amb-range>`}
	usage={{
		do: [
			'Use a range when the number is a position between two ends and an approximate value is fine, such as volume or a price ceiling.',
			'Set <code>min</code>, <code>max</code>, and <code>step</code> to the real bounds. A step of 5 or 10 is easier to hit than 1 on a wide range.',
			'Show the current number in text next to the range when the exact value matters.',
			'Name the quantity and its unit in the label, such as <strong>Maximum price, euros</strong>.'
		],
		dont: [
			'Don’t use a range when people know the exact number they want. Use <code>&lt;amb-text-field&gt;</code> or a quantity input.',
			'Don’t use a range for a short list of named options. Use <code>&lt;amb-radio&gt;</code> or <code>&lt;amb-select&gt;</code>.',
			'Don’t put the changing value in the label slot. The label is the accessible name and must stay fixed.',
			'Don’t make the range the only way to reach a precise value across hundreds of steps.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-range name="volume" value={40}>Volume</amb-range>
		</div>
	{/snippet}

	<h2 id="bounds-and-steps">Bounds and steps</h2>
	<p>
		The defaults are 0 to 100 in steps of 1. Set <code>min</code>, <code>max</code>, and <code>step</code> to match
		the quantity. The arrow keys move one step, and <kbd>Home</kbd> and <kbd>End</kbd> jump to the ends.
	</p>
	<Stage
		align="stretch"
		code={`<amb-range name="radius" value="10" min="0" max="50" step="5">Search radius, km</amb-range>
<amb-range name="rating" value="4" min="1" max="5">Minimum rating</amb-range>`}
	>
		<div class="grid">
			<amb-range name="radius" value={10} min={0} max={50} step={5}>Search radius, km</amb-range>
			<amb-range name="rating" value={4} min={1} max={5}>Minimum rating</amb-range>
		</div>
	</Stage>

	<h2 id="value-readout">Value readout</h2>
	<p>
		The slider announces its own value to assistive technology. Add a text readout next to it when sighted people
		need the exact number. Keep the readout outside the label, so the accessible name stays fixed.
	</p>
	<Stage
		align="stretch"
		code={`<amb-range name="budget" value="250" min="0" max="1000" step="50">Budget, euros</amb-range>
<p>Up to <strong id="budget-value">250</strong> euros</p>`}
	>
		<div class="narrow readout" oninput={onBudgetInput}>
			<amb-range name="budget" value={250} min={0} max={1000} step={50}>Budget, euros</amb-range>
			<p class="value">Up to <strong id="budget-value">{budget}</strong> euros</p>
		</div>
	</Stage>
	<p>The native <code>input</code> event reaches the host while the thumb moves. Update the readout from it:</p>
	<CodeBlock
		lang="js"
		code={`const range = document.querySelector('amb-range[name="budget"]');
range.addEventListener('input', () => {
  document.getElementById('budget-value').textContent = range.value;
});`}
	/>

	<h2 id="disabled">Disabled</h2>
	<p>
		A disabled range leaves the tab order and the form data, and keeps showing its value. Say nearby why it cannot
		change.
	</p>
	<Stage
		align="stretch"
		code={`<amb-range name="speed" value="60" disabled>Playback speed</amb-range>
<p>Speed is fixed while the video is live.</p>`}
	>
		<div class="narrow readout">
			<amb-range name="speed" value={60} disabled>Playback speed</amb-range>
			<p class="value">Speed is fixed while the video is live.</p>
		</div>
	</Stage>

	<h2 id="filters">Search filters</h2>
	<p>
		Ranges suit filters where an approximate ceiling is enough. Each range submits its number under its
		<code>name</code>, next to the other controls in the form.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Filter hotels</h3>
  <amb-range name="price" value="200" min="50" max="500" step="10">Maximum price per night, euros</amb-range>
  <amb-range name="distance" value="5" min="1" max="20">Distance from the center, km</amb-range>
  <amb-checkbox name="breakfast" value="included">Breakfast included</amb-checkbox>
  <amb-button type="submit">Show hotels</amb-button>
</form>`}
	>
		<form class="panel" onsubmit={onFilterSubmit}>
			<h3 class="panel-title">Filter hotels</h3>
			<amb-range name="price" value={200} min={50} max={500} step={10}>Maximum price per night, euros</amb-range>
			<amb-range name="distance" value={5} min={1} max={20}>Distance from the center, km</amb-range>
			<amb-checkbox name="breakfast" value="included">Breakfast included</amb-checkbox>
			<div class="actions">
				<amb-button type="submit">Show hotels</amb-button>
			</div>
			<p class="status" aria-live="polite">{filterStatus}</p>
		</form>
	</Stage>
</ComponentPage>

<style>
	.narrow {
		width: min(100%, 24rem);
		margin-inline: auto;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: var(--amb-space-500);
	}

	.readout {
		display: grid;
		gap: var(--amb-space-200);
	}

	.value {
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
	}

	.value strong {
		color: var(--amb-color-fg-default);
		font-variant-numeric: tabular-nums;
	}

	.panel {
		display: grid;
		gap: var(--amb-space-400);
		width: min(100%, 28rem);
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
