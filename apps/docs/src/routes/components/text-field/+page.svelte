<script lang="ts">
	import { storybookUrl } from '$lib/site';

	let status = $state('The form has not been submitted.');

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;
		const entries = [...new FormData(form).entries()].map(([key, value]) => `${key}=${value}`);
		status = entries.join(', ');
	}
</script>

<svelte:head>
	<title>Text field — Ambre</title>
	<meta name="description" content="amb-text-field collects one line. The slotted label is the accessible name." />
</svelte:head>

<p class="eyebrow">Components</p>
<h1>Text field</h1>
<div class="stage-card">
	<p class="stage-label">amb-text-field</p>
	<form class="form-stack" onsubmit={onSubmit}>
		<amb-text-field name="email" type="email" autocomplete="email" placeholder="ada@example.com" required>
			Email
		</amb-text-field>
		<fieldset class="choice-group">
			<legend>Plan</legend>
			<amb-radio name="plan" value="annual" required>Annual</amb-radio>
			<amb-radio name="plan" value="monthly" required>Monthly</amb-radio>
		</fieldset>
		<amb-select name="country" required>
			Country
			<option value="">Choose a country</option>
			<option value="fr">France</option>
			<option value="jp">Japan</option>
		</amb-select>
		<amb-checkbox name="terms" value="accepted" required>I agree to the terms</amb-checkbox>
		<div class="row">
			<amb-button type="submit">Submit</amb-button>
		</div>
	</form>
	<p class="status" aria-live="polite">{status}</p>
</div>
<p class="lede">Collect one line. The slotted text is the label, and the value joins the nearest form.</p>

<h2>Types</h2>
<div class="form-stack">
	<amb-text-field name="password" type="password" autocomplete="current-password">Password</amb-text-field>
	<amb-text-field name="site" type="url" placeholder="https://">Website</amb-text-field>
	<amb-text-field name="reference" value="AMB-204" readonly>Reference</amb-text-field>
	<amb-text-field name="locked" disabled>Unavailable</amb-text-field>
</div>

<pre><code>&lt;amb-text-field name="email" type="email" autocomplete="email" required&gt;Email&lt;/amb-text-field&gt;</code></pre>

<div class="do-grid">
	<section class="note">
		<h2>Do</h2>
		<ul>
			<li>Write the label in the slot. It is the accessible name.</li>
			<li>Set <code>autocomplete</code> when the field collects a person's own data.</li>
			<li>Show the validation message after a failed submit.</li>
		</ul>
	</section>
	<section class="note">
		<h2>Don't</h2>
		<ul>
			<li>Don't use the placeholder as the label.</li>
			<li>Don't reflect <code>value</code> into the attribute. A password would leak into the markup.</li>
			<li>Don't submit with a link. Use <code>amb-button type="submit"</code>.</li>
		</ul>
	</section>
</div>
<p class="lede">
	<a href={storybookUrl} target="_blank" rel="external noreferrer">Open Storybook</a> to inspect every type, and both themes.
</p>
