<script lang="ts">
	import { storybookUrl } from '$lib/site';

	let status = $state('The form has not been submitted.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		status = 'Submitted from amb-button.';
	}

	function onReset() {
		status = 'Reset from amb-button.';
	}
</script>

<svelte:head>
	<title>Button — Ambre</title>
	<meta name="description" content="amb-button starts an action. Use a link for navigation." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Button</h1>
<div class="stage-card">
	<p class="stage-label">amb-button</p>
	<div class="row">
		<amb-button>Save changes</amb-button>
		<amb-button variant="secondary">Cancel</amb-button>
		<amb-button variant="ghost">Learn more</amb-button>
		<amb-button disabled>Unavailable</amb-button>
	</div>
</div>
<p class="lede">Use a button to start an action. Use a link to go somewhere.</p>

<h2>Sizes</h2>
<div class="row">
	<amb-button size="sm">Small</amb-button>
	<amb-button size="md">Medium</amb-button>
	<amb-button size="lg">Large</amb-button>
</div>

<h2>In a form</h2>
<form onsubmit={onSubmit} onreset={onReset}>
	<div class="row">
		<amb-button type="submit">Submit</amb-button>
		<amb-button type="reset" variant="secondary">Reset</amb-button>
	</div>
</form>
<p class="status" aria-live="polite">{status}</p>

<pre><code>&lt;amb-button type="submit"&gt;Save changes&lt;/amb-button&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the action as the label. The slot is the accessible name.</li>
			<li>Keep one primary button in a view.</li>
			<li>Use medium unless the surface is dense or the action is prominent.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use a button for navigation.</li>
			<li>Don't put an icon in the slot without a text label.</li>
			<li>Don't restyle it with a raw hex color. Override <code>--amb-color-accent-bg</code>.</li>
		</ul>
	</section>
</div>
<p class="lede">
	<a href={storybookUrl} target="_blank" rel="noreferrer">Open Storybook</a> to inspect every variant, size, and theme.
</p>
