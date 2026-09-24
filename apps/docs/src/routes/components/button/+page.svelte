<script lang="ts">
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let status = $state('The form has not been submitted.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		status = 'Submitted from amb-button.';
	}

	function onReset() {
		status = 'Reset from amb-button.';
	}
</script>

<ComponentPage
	id="button"
	heroCode={`<amb-button>Save changes</amb-button>
<amb-button variant="secondary">Cancel</amb-button>
<amb-button variant="ghost">Learn more</amb-button>`}
	usage={{
		do: [
			'Write the action as the label: a verb and an object, such as <strong>Save changes</strong>. The slot is the accessible name.',
			'Keep one primary button per view. Pair it with secondary or ghost buttons.',
			'Use the medium size unless the surface is dense or the action is prominent.'
		],
		dont: [
			'Don’t use a button to go somewhere. Use a link.',
			'Don’t put an icon in the slot without a visible text label.',
			'Don’t restyle it with a raw color. Override <code>--amb-color-accent-bg</code> or pick a brand.'
		]
	}}
>
	{#snippet hero()}
		<amb-button>Save changes</amb-button>
		<amb-button variant="secondary">Cancel</amb-button>
		<amb-button variant="ghost">Learn more</amb-button>
	{/snippet}

	<h2 id="variants">Variants</h2>
	<p>
		<strong>Primary</strong> is the main action of the view. <strong>Secondary</strong> sits beside it.
		<strong>Ghost</strong> is for low-emphasis actions in toolbars and cards. A disabled button leaves the tab
		order.
	</p>
	<Stage
		code={`<amb-button variant="primary">Publish</amb-button>
<amb-button variant="secondary">Preview</amb-button>
<amb-button variant="ghost">Discard</amb-button>
<amb-button disabled>Unavailable</amb-button>`}
	>
		<amb-button variant="primary">Publish</amb-button>
		<amb-button variant="secondary">Preview</amb-button>
		<amb-button variant="ghost">Discard</amb-button>
		<amb-button disabled>Unavailable</amb-button>
	</Stage>

	<h2 id="sizes">Sizes</h2>
	<p>Small is 32px for dense surfaces, medium is 44px, and large is 52px. A brand can change the heights.</p>
	<Stage
		code={`<amb-button size="sm">Small</amb-button>
<amb-button size="md">Medium</amb-button>
<amb-button size="lg">Large</amb-button>`}
	>
		<amb-button size="sm">Small</amb-button>
		<amb-button size="md">Medium</amb-button>
		<amb-button size="lg">Large</amb-button>
	</Stage>

	<h2 id="forms">In a form</h2>
	<p>
		The element is form-associated. <code>type="submit"</code> and <code>type="reset"</code> act on the
		nearest form, just like a native button.
	</p>
	<Stage
		code={`<form>
  <amb-button type="submit">Submit</amb-button>
  <amb-button type="reset" variant="secondary">Reset</amb-button>
</form>`}
	>
		<form onsubmit={onSubmit} onreset={onReset} style="display:flex; gap: var(--amb-space-300); flex-wrap: wrap;">
			<amb-button type="submit">Submit</amb-button>
			<amb-button type="reset" variant="secondary">Reset</amb-button>
		</form>
		<p class="stage-status" aria-live="polite">{status}</p>
	</Stage>
</ComponentPage>

<style>
	.stage-status {
		flex-basis: 100%;
		margin: 0;
		color: var(--amb-color-fg-muted);
		font-size: var(--amb-font-size-200);
		text-align: center;
	}
</style>
