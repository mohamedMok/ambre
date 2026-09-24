<script lang="ts">
	import CodeBlock from '$lib/CodeBlock.svelte';
	import ComponentPage from '$lib/ComponentPage.svelte';
	import Stage from '$lib/Stage.svelte';

	let validationStatus = $state('Submit the form empty to see the message.');
	let accountStatus = $state('The form has not been submitted.');

	function summarize(form: HTMLFormElement) {
		const entries = [...new FormData(form).entries()].map(([key, value]) =>
			key === 'password' ? `${key}=(hidden)` : `${key}=${typeof value === 'string' ? value : value.name}`
		);
		return entries.length ? `Submitted ${entries.join(', ')}.` : 'Submitted with no values.';
	}

	function onValidationSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) validationStatus = summarize(event.currentTarget);
	}

	function onAccountSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (event.currentTarget instanceof HTMLFormElement) accountStatus = summarize(event.currentTarget);
	}
</script>

<ComponentPage
	id="text-field"
	heroAlign="stretch"
	heroCode={`<amb-text-field name="email" type="email" autocomplete="email" placeholder="ada@example.com">
  Email
</amb-text-field>`}
	usage={{
		do: [
			'Write the label in the slot, such as <strong>Email</strong>. It stays visible and is the accessible name.',
			'Set <code>type</code> to match the data. <code>email</code>, <code>tel</code>, and <code>url</code> bring the right mobile keyboard.',
			'Set <code>autocomplete</code> when the field collects a person’s own data, such as <code>email</code> or <code>new-password</code>.',
			'Mark only the fields the form cannot do without as <code>required</code>, and say in the form which ones are optional.'
		],
		dont: [
			'Don’t use the placeholder as the label. It disappears as soon as someone types.',
			'Don’t put a format rule only in the placeholder. Write it in text that stays on screen.',
			'Don’t set <code>value</code> as an attribute. It is a property, so a password never lands in the markup.',
			'Don’t use a text field for more than one line. Use <code>&lt;amb-text-area&gt;</code>.'
		]
	}}
>
	{#snippet hero()}
		<div class="narrow">
			<amb-text-field name="email" type="email" autocomplete="email" placeholder="ada@example.com">
				Email
			</amb-text-field>
		</div>
	{/snippet}

	<h2 id="types">Types</h2>
	<p>
		<code>type</code> sets the native input type. It changes the keyboard on touch devices, the built-in format
		check, and how the browser offers saved values. <code>password</code> masks the characters.
	</p>
	<Stage
		align="stretch"
		code={`<amb-text-field name="name" autocomplete="name">Full name</amb-text-field>
<amb-text-field name="email" type="email" autocomplete="email">Email</amb-text-field>
<amb-text-field name="password" type="password" autocomplete="current-password">Password</amb-text-field>
<amb-text-field name="phone" type="tel" autocomplete="tel">Phone</amb-text-field>
<amb-text-field name="website" type="url" placeholder="https://">Website</amb-text-field>
<amb-text-field name="q" type="search">Search orders</amb-text-field>`}
	>
		<div class="grid">
			<amb-text-field name="name" autocomplete="name">Full name</amb-text-field>
			<amb-text-field name="email" type="email" autocomplete="email">Email</amb-text-field>
			<amb-text-field name="password" type="password" autocomplete="current-password">Password</amb-text-field>
			<amb-text-field name="phone" type="tel" autocomplete="tel">Phone</amb-text-field>
			<amb-text-field name="website" type="url" placeholder="https://">Website</amb-text-field>
			<amb-text-field name="q" type="search">Search orders</amb-text-field>
		</div>
	</Stage>

	<h2 id="states">States</h2>
	<p>
		<strong>Read-only</strong> shows a value that can be focused, copied, and submitted, but not edited.
		<strong>Disabled</strong> removes the field from the tab order and from the form data. Prefer read-only when
		people need to see or copy the value.
	</p>
	<Stage
		align="stretch"
		code={`<amb-text-field name="reference" readonly>Order reference</amb-text-field>
<amb-text-field name="coupon" disabled>Coupon code</amb-text-field>`}
	>
		<div class="grid">
			<amb-text-field name="reference" value="AMB-204" readonly>Order reference</amb-text-field>
			<amb-text-field name="coupon" disabled>Coupon code</amb-text-field>
		</div>
	</Stage>
	<p><code>value</code> is a property. Set it from script:</p>
	<CodeBlock lang="js" code={`document.querySelector('amb-text-field[name="reference"]').value = 'AMB-204';`} />

	<h2 id="validation">Validation</h2>
	<p>
		<code>required</code> blocks the submit while the field is empty. The type adds its own check, so an email
		field rejects a value without an <code>@</code>. The message appears under the field after a failed submit and
		clears once the value is valid.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <amb-text-field name="email" type="email" autocomplete="email" required>
    Email
  </amb-text-field>
  <amb-button type="submit">Subscribe</amb-button>
</form>`}
	>
		<form class="narrow form" onsubmit={onValidationSubmit}>
			<amb-text-field name="email" type="email" autocomplete="email" required>Email</amb-text-field>
			<div class="actions">
				<amb-button type="submit">Subscribe</amb-button>
			</div>
			<p class="status" aria-live="polite">{validationStatus}</p>
		</form>
	</Stage>

	<h2 id="account-form">Account form</h2>
	<p>
		A sign-up form combines several types. Each field has a visible label, the right <code>autocomplete</code>
		token, and only the fields the account needs are required. The optional field says so in its label.
	</p>
	<Stage
		align="stretch"
		code={`<form>
  <h3>Create your account</h3>
  <amb-text-field name="name" autocomplete="name" required>Full name</amb-text-field>
  <amb-text-field name="email" type="email" autocomplete="email" required>Work email</amb-text-field>
  <amb-text-field name="password" type="password" autocomplete="new-password" required>
    Password
  </amb-text-field>
  <amb-text-field name="phone" type="tel" autocomplete="tel">Phone (optional)</amb-text-field>
  <amb-button type="submit">Create account</amb-button>
</form>`}
	>
		<form class="panel form" onsubmit={onAccountSubmit}>
			<h3 class="panel-title">Create your account</h3>
			<amb-text-field name="name" autocomplete="name" required>Full name</amb-text-field>
			<amb-text-field name="email" type="email" autocomplete="email" required>Work email</amb-text-field>
			<amb-text-field name="password" type="password" autocomplete="new-password" required>Password</amb-text-field>
			<amb-text-field name="phone" type="tel" autocomplete="tel">Phone (optional)</amb-text-field>
			<div class="actions">
				<amb-button type="submit">Create account</amb-button>
			</div>
			<p class="status" aria-live="polite">{accountStatus}</p>
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
		gap: var(--amb-space-400);
	}

	.form {
		display: grid;
		gap: var(--amb-space-400);
	}

	.panel {
		width: min(100%, 26rem);
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
